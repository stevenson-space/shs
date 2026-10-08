<template>
  <WidgetShell title="Countdown" :icon="Hourglass" :size="size">
    <div v-if="!target" class="empty">
      <div class="empty-title">Nothing to count down to</div>
      <div class="empty-sub">Edit this widget to pick a date.</div>
    </div>

    <!-- Small: one big number -->
    <div v-else-if="size === 'small'" class="small">
      <div class="big">
        <span class="big-value">{{ headline.value }}</span>
        <span class="big-unit">{{ headline.unit }}</span>
      </div>
      <div class="meta">
        <div class="name">{{ title }}</div>
        <div class="date">{{ dateLabel }}</div>
      </div>
    </div>

    <!-- Medium: days / hours / minutes -->
    <div v-else class="medium">
      <div class="meta row">
        <div class="name">{{ title }}</div>
        <div class="date">{{ dateLabel }}</div>
      </div>
      <div v-if="reached" class="reached">
        <PartyPopper :size="20" :stroke-width="2" aria-hidden="true" />
        It's here
      </div>
      <div v-else class="units" role="timer" :aria-label="`${title} countdown`">
        <div v-for="unit in units" :key="unit.label" class="unit">
          <span class="unit-value">{{ unit.value }}</span>
          <span class="unit-label">{{ unit.label }}</span>
        </div>
      </div>
    </div>
  </WidgetShell>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Hourglass, PartyPopper } from 'lucide-vue-next';
import Bell from '@/utils/bell';
import useClockStore from '@/stores/clock';
import useScheduleStore from '@/stores/schedules';
import WidgetShell from '../WidgetShell.vue';
import { loadDayOffNamer, type DayOffNamer } from '../calendarNames';
import type { WidgetSize } from '../layout';

/*
  Counts down to a date the student picks. Until they pick one, it counts
  down to the next weekday with no school, named from the school calendar
  when the calendar has an entry for that day.
*/

const { size = 'small', config = undefined } = defineProps<{
  size?: WidgetSize;
  // { title, date } where date is a local "YYYY-MM-DDTHH:mm" string
  config?: Record<string, string>;
}>();

const clockStore = useClockStore();
const scheduleStore = useScheduleStore();

const LOOKAHEAD_DAYS = 200;

const dayOffName = ref<DayOffNamer | null>(null);

onMounted(async () => {
  // only an automatic countdown needs the calendar's name for the day
  if (!config?.date) dayOffName.value = await loadDayOffNamer();
});

function parseLocal(value: string | undefined): Date | null {
  if (!value) return null;

  const match = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?$/.exec(value);
  if (!match) return null;

  const [, year, month, day, hours = '0', minutes = '0'] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes));
  return Number.isNaN(date.getTime()) ? null : date;
}

// A stable key for "today", so the search below only reruns once a day.
const todayKey = computed(() => {
  const d = clockStore.date;
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
});

const nextDayOff = computed((): Date | null => {
  const [year, month, day] = todayKey.value.split('-').map(Number);

  for (let i = 1; i <= LOOKAHEAD_DAYS; i++) {
    const date = new Date(year, month, day + i);

    if (Bell.getScheduleType(date, scheduleStore.schedules).name === 'No School') {
      return date;
    }
  }

  return null;
});

const custom = computed(() => parseLocal(config?.date));
const target = computed(() => custom.value ?? nextDayOff.value);

// e.g. "Spring Break", when the school calendar names the day
const calendarName = computed(() => (nextDayOff.value && dayOffName.value ? dayOffName.value(nextDayOff.value) : ''));

const title = computed(() => {
  if (custom.value) return config?.title?.trim() || 'Countdown';
  return calendarName.value || 'Next day off';
});

const dateLabel = computed(() => {
  const date = target.value;
  if (!date) return '';

  const day = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const hasTime = date.getHours() !== 0 || date.getMinutes() !== 0;
  if (!hasTime) return day;

  const hours = date.getHours() % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day} · ${hours}:${minutes} ${date.getHours() >= 12 ? 'PM' : 'AM'}`;
});

const remaining = computed(() => (target.value ? target.value.getTime() - clockStore.date.getTime() : 0));
const reached = computed(() => remaining.value <= 0);

const parts = computed(() => {
  const total = Math.max(0, Math.floor(remaining.value / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
});

const plural = (n: number, word: string) => (n === 1 ? word : `${word}s`);

// The single number the small size shows.
const headline = computed(() => {
  const { days, hours, minutes } = parts.value;

  if (reached.value) return { value: '0', unit: 'days' };
  // a partial day still counts: 2 days 5 hours away reads as "3 days"
  if (days >= 1) {
    const rounded = days + (hours || minutes ? 1 : 0);
    return { value: String(rounded), unit: plural(rounded, 'day') };
  }
  if (hours >= 1) return { value: String(hours), unit: plural(hours, 'hour') };
  return { value: String(Math.max(1, minutes)), unit: 'min' };
});

const units = computed(() => {
  const { days, hours, minutes, seconds } = parts.value;
  const two = (n: number) => String(n).padStart(2, '0');

  if (days >= 1) {
    return [
      { value: String(days), label: plural(days, 'Day') },
      { value: two(hours), label: 'Hrs' },
      { value: two(minutes), label: 'Min' },
    ];
  }

  return [
    { value: two(hours), label: 'Hrs' },
    { value: two(minutes), label: 'Min' },
    { value: two(seconds), label: 'Sec' },
  ];
});
</script>

<style scoped>
.empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  text-align: center;
}

.empty-title {
  font-size: 14px;
  font-weight: 700;
}

.empty-sub {
  font-size: 12.5px;
  color: var(--w-muted);
}

.name {
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.date {
  font-size: 12.5px;
  color: var(--w-muted);
  white-space: nowrap;
}

/* ---- small ---- */
.small {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.big {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.big-value {
  font-size: 46px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.03em;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}

.big-unit {
  font-size: 14px;
  font-weight: 700;
  color: var(--w-muted);
}

.meta {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

/* ---- medium ---- */
.medium {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
}

.meta.row {
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}

.units {
  flex: 1;
  min-height: 0;
  max-height: 72px;
  display: flex;
  gap: 8px;
}

.unit {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  border-radius: 12px;
  background: var(--w-soft);
}

.unit-value {
  font-size: 26px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}

.unit-label {
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--w-muted);
}

.reached {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 12px;
  background: var(--w-soft);
  color: var(--accent);
  font-size: 18px;
  font-weight: 700;
}
</style>
