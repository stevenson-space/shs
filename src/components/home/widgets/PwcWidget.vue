<template>
  <WidgetShell title="PWC" :icon="Dumbbell" :size="size">
    <template v-if="size !== 'small'" #action>
      <span class="pill" :class="{ open: status.open }">{{ status.open ? 'Open' : 'Closed' }}</span>
    </template>

    <div class="pwc" :class="`is-${size}`">
      <span v-if="size === 'small'" class="pill" :class="{ open: status.open }">{{ status.open ? 'Open' : 'Closed' }}</span>

      <div class="main">
        <div class="value">{{ status.value }}</div>
        <div class="caption">{{ status.caption }}</div>
      </div>

      <template v-if="size !== 'small'">
        <div class="bar" aria-hidden="true">
          <div class="bar-fill" :style="{ width: status.progress * 100 + '%' }" />
        </div>
        <div class="foot">
          <span>{{ status.footLabel }}</span>
          <span class="foot-hours">{{ status.footHours }}</span>
        </div>
      </template>
    </div>
  </WidgetShell>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Dumbbell } from 'lucide-vue-next';
import useClockStore from '@/stores/clock';
import WidgetShell from '../WidgetShell.vue';
import type { WidgetSize } from '../layout';

const { size = 'small' } = defineProps<{ size?: WidgetSize }>();

const clockStore = useClockStore();

// Patriot Wellness Center hours by day of the week (0 = Sunday), 24-hour time.
const HOURS: Record<number, [string, string]> = {
  0: ['10:00', '14:00'],
  1: ['15:30', '20:00'],
  2: ['15:30', '20:00'],
  3: ['15:30', '20:00'],
  4: ['15:30', '20:00'],
  5: ['15:30', '18:00'],
  6: ['10:00', '14:00'],
};

// Holidays and other one-off closures, as YYYY-MM-DD.
const CLOSED_DAYS = new Set<string>([]);

const pad = (n: number) => String(n).padStart(2, '0');
const dayKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function at(day: Date, clock: string): Date {
  const [hours, minutes] = clock.split(':').map(Number);
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours, minutes, 0, 0);
}

// The open and close times on a given day, or null if the PWC is closed all day.
function windowFor(day: Date): { open: Date; close: Date } | null {
  if (CLOSED_DAYS.has(dayKey(day))) return null;
  const [open, close] = HOURS[day.getDay()];
  return { open: at(day, open), close: at(day, close) };
}

function clockLabel(date: Date): string {
  const hours = date.getHours() % 12 || 12;
  return `${hours}:${pad(date.getMinutes())} ${date.getHours() >= 12 ? 'PM' : 'AM'}`;
}

function dayLabel(target: Date, from: Date): string {
  const days = Math.round(
    (new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime()
      - new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime()) / 86400000,
  );

  if (days === 0) return 'today';
  if (days === 1) return 'tomorrow';
  return target.toLocaleDateString('en-US', { weekday: 'long' });
}

function duration(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return `${hours}:${pad(minutes)}:${pad(seconds)}`;
}

const status = computed(() => {
  const now = clockStore.date;
  const today = windowFor(now);

  if (today && now >= today.open && now < today.close) {
    return {
      open: true,
      value: duration(today.close.getTime() - now.getTime()),
      caption: 'until it closes',
      progress: (now.getTime() - today.open.getTime()) / (today.close.getTime() - today.open.getTime()),
      footLabel: 'Today',
      footHours: `${clockLabel(today.open)} – ${clockLabel(today.close)}`,
    };
  }

  // closed right now: find the next time it opens (today, or one of the next two weeks)
  let next = today && now < today.open ? today : null;

  for (let i = 1; !next && i <= 14; i++) {
    next = windowFor(new Date(now.getFullYear(), now.getMonth(), now.getDate() + i));
  }

  if (!next) {
    return { open: false, value: 'Closed', caption: 'No hours posted', progress: 0, footLabel: '', footHours: '' };
  }

  const when = dayLabel(next.open, now);

  return {
    open: false,
    value: clockLabel(next.open),
    caption: `Opens ${when}`,
    progress: 0,
    footLabel: when.charAt(0).toUpperCase() + when.slice(1),
    footHours: `${clockLabel(next.open)} – ${clockLabel(next.close)}`,
  };
});
</script>

<style scoped>
.pill {
  align-self: flex-start;
  padding: 3px 9px;
  border-radius: 999px;
  background: var(--w-soft);
  color: var(--w-muted);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  line-height: 1.2;
}

.pill.open {
  background: var(--accent);
  color: var(--w-on-accent);
}

.pwc {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 4px;
}

.value {
  font-size: 30px;
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.pwc.is-small .value {
  font-size: 27px;
}

.caption {
  margin-top: 2px;
  font-size: 13px;
  color: var(--w-muted);
}

.bar {
  height: 6px;
  border-radius: 999px;
  background: var(--w-soft);
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: inherit;
  background: var(--accent);
  transition: width 1s linear;
}

.foot {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 12.5px;
  color: var(--w-muted);
}

.foot-hours {
  font-weight: 700;
  color: var(--primary);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
</style>
