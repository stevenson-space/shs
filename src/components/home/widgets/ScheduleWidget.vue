<template>
  <WidgetShell title="Schedule" :icon="CalendarClock" to="/bellschedules" :size="size">
    <template #action>
      <span v-if="typeChip" class="chip">{{ typeChip }}</span>
      <!-- the student's own classes: right here, not hidden in edit mode -->
      <button
        class="classes-btn"
        :class="{ first: !hasAny }"
        type="button"
        :title="hasAny ? 'Edit my classes' : 'Add my classes'"
        :aria-label="hasAny ? 'Edit my classes' : 'Add my classes'"
        @click.stop="classesOpen = true"
      >
        <Pencil v-if="hasAny" :size="12" :stroke-width="2.6" aria-hidden="true" />
        <template v-else>
          <Plus :size="12" :stroke-width="3" aria-hidden="true" />
          <span>My classes</span>
        </template>
      </button>
    </template>

    <!-- No school today -->
    <div v-if="!rows.length" class="empty">
      <Coffee class="empty-icon" :size="26" :stroke-width="1.8" aria-hidden="true" />
      <div class="empty-title">{{ dayOffTitle }}</div>
      <div v-if="resumes" class="empty-sub">{{ resumes }}</div>
    </div>

    <!-- Medium: what is happening right now -->
    <div v-else-if="size === 'medium'" class="now">
      <div class="now-top">
        <span class="now-pill" :class="{ live: status.live }">{{ status.pill }}</span>
        <span v-if="status.range" class="now-range">{{ status.range }}</span>
      </div>
      <div class="now-title">{{ status.title }}</div>
      <div v-if="status.live" class="bar" role="progressbar" :aria-valuenow="Math.round(status.progress * 100)" aria-valuemin="0" aria-valuemax="100">
        <div class="bar-fill" :style="{ width: status.progress * 100 + '%' }" />
      </div>
      <div class="now-bottom">
        <span class="now-next">{{ status.next }}</span>
        <span v-if="status.left" class="now-left">{{ status.left }}</span>
      </div>
    </div>

    <!-- Large: the whole day -->
    <ol v-else ref="list" class="rows">
      <li
        v-for="row in rows"
        :key="row.key"
        class="row"
        :class="`is-${row.state}`"
        :data-state="row.state"
      >
        <span v-if="row.state === 'now'" class="row-fill" :style="{ width: row.progress * 100 + '%' }" aria-hidden="true" />
        <span class="badge">{{ row.badge }}</span>
        <span class="row-name">{{ row.title }}<span v-if="row.room" class="row-room">{{ row.room }}</span></span>
        <span v-if="row.state === 'next'" class="row-tag">Next</span>
        <span class="row-time">{{ row.range }}</span>
      </li>
    </ol>

    <WidgetSettings v-if="classesOpen" kind="classes" @close="classesOpen = false" />
  </WidgetShell>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from 'vue';
import { CalendarClock, Coffee, Pencil, Plus } from 'lucide-vue-next';
import Bell, { isBellOnSchoolDay } from '@/utils/bell';
import useClockStore from '@/stores/clock';
import { dateToSeconds, periodToSeconds } from '@/utils/util';
import { intoCountdownString, schoolResumesString } from '@/utils/countdown';
import WidgetShell from '../WidgetShell.vue';
import WidgetSettings from '../WidgetSettings.vue';
import { usePeriodNames } from '../periodNames';
import type { WidgetSize } from '../layout';

type RowState = 'past' | 'now' | 'next' | 'later' | 'plain';

type Row = {
  key: string;
  badge: string;
  title: string;
  // the student's room for this period, if they added one
  room: string;
  // title and room together, for the one-line spots
  label: string;
  range: string;
  start: string;
  end: string;
  state: RowState;
  progress: number;
};

const { size = 'large' } = defineProps<{ size?: WidgetSize }>();

const clockStore = useClockStore();
const { nameFor, roomFor, hasAny } = usePeriodNames();
const classesOpen = ref(false);
const list = useTemplateRef<HTMLOListElement>('list');

const time = (value: string) => Bell.convertMilitaryTime(value);

// "3" -> "3", "3A" -> "3A", "!Activity" -> "A"
function badgeFor(period: string): string {
  if (period[0] === '!') return period[1]?.toUpperCase() ?? '';
  return period.length <= 2 ? period : period.slice(0, 2);
}

// The student's own class name when they have set one, otherwise "Period 3".
function titleFor(period: string): string {
  return nameFor(period) || Bell.formatPeriodName(period);
}

const rows = computed((): Row[] => {
  const { bell } = clockStore;

  if (!isBellOnSchoolDay(bell)) return [];

  const { start, end, periods } = bell.schedule;
  // highlighting only makes sense on the live clock, not when browsing another day
  const live = clockStore.clockMode === 'current';
  const now = dateToSeconds(clockStore.date);
  let nextMarked = false;

  const lastEnd = periodToSeconds(end[end.length - 1]);
  // once the day is over there is nothing to highlight, so nothing gets dimmed either
  const tracking = live && now < lastEnd;

  return periods.map((period, i): Row => {
    const startSeconds = periodToSeconds(start[i]);
    const endSeconds = periodToSeconds(end[i]);
    let state: RowState = 'plain';
    let progress = 0;

    if (tracking) {
      if (now >= endSeconds) {
        state = 'past';
      } else if (now >= startSeconds) {
        state = 'now';
        progress = (now - startSeconds) / Math.max(1, endSeconds - startSeconds);
      } else if (!nextMarked) {
        state = 'next';
      } else {
        state = 'later';
      }

      if (state === 'now' || state === 'next') nextMarked = true;
    }

    const title = titleFor(period);
    const room = roomFor(period);

    return {
      key: `${period}-${i}`,
      badge: badgeFor(period),
      title,
      room,
      label: room ? `${title} · ${room}` : title,
      range: `${time(start[i])} – ${time(end[i])}`,
      start: start[i],
      end: end[i],
      state,
      progress,
    };
  });
});

// Shown next to the title on days that are not a normal schedule.
const typeChip = computed(() => {
  const { type } = clockStore.bell;
  return type && type !== 'Standard Schedule' && !type.startsWith('No School') ? type : '';
});

const dayOffTitle = computed(() => {
  const { type } = clockStore.bell;
  return type === 'No School (Weekend)' ? 'No school today' : type || 'No school today';
});

const resumes = computed(() => {
  const text = schoolResumesString(clockStore.bell, clockStore.date);
  return text ? text.replace(/\s+/g, ' ').trim() : '';
});

// Everything the medium ("right now") layout needs, for each part of the day.
const status = computed(() => {
  const all = rows.value;
  const current = all.find((row) => row.state === 'now');
  const next = all.find((row) => row.state === 'next' || (current && row.state === 'later'));
  const now = dateToSeconds(clockStore.date);
  const first = all[0];
  const last = all[all.length - 1];
  const base = { live: false, pill: '', range: '', title: '', next: '', left: '', progress: 0 };

  if (!first || !last) return base;

  // browsing another day: just summarize it
  if (clockStore.clockMode !== 'current') {
    return {
      ...base,
      pill: `${all.length} periods`,
      title: `${time(first.start)} – ${time(last.end)}`,
      next: `Starts with ${first.label}`,
    };
  }

  if (current) {
    return {
      ...base,
      live: true,
      pill: 'Now',
      range: current.range,
      title: current.label,
      progress: current.progress,
      next: next ? `Next: ${next.label} · ${time(next.start)}` : 'Last period of the day',
      left: `${intoCountdownString(periodToSeconds(current.end) - now)} left`,
    };
  }

  if (now < periodToSeconds(first.start)) {
    return {
      ...base,
      pill: 'Before school',
      title: `Starts at ${time(first.start)}`,
      next: `First: ${first.label}`,
      left: `in ${intoCountdownString(periodToSeconds(first.start) - now)}`,
    };
  }

  if (next) {
    return {
      ...base,
      pill: 'Passing',
      range: `until ${time(next.start)}`,
      title: `Up next: ${next.label}`,
      next: next.range,
      left: `in ${intoCountdownString(periodToSeconds(next.start) - now)}`,
    };
  }

  return {
    ...base,
    pill: 'Done',
    title: "School's out",
    next: resumes.value || 'See you next time',
  };
});

// Keeps the current period in view when the day has more rows than fit.
function scrollToCurrent(): void {
  const el = list.value;
  if (!el) return;

  const target = el.querySelector<HTMLElement>('[data-state="now"], [data-state="next"]');
  if (!target) return;

  el.scrollTop = target.offsetTop - el.offsetTop - el.clientHeight / 2 + target.offsetHeight / 2;
}

const currentKey = computed(() => rows.value.find((row) => row.state === 'now' || row.state === 'next')?.key ?? '');

watch([currentKey, () => size], () => nextTick(scrollToCurrent));
onMounted(() => nextTick(scrollToCurrent));
</script>

<style scoped>
.classes-btn {
  flex: none;
  height: 22px;
  white-space: nowrap;
  min-width: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 0 6px;
  border: none;
  border-radius: 999px;
  background: var(--w-soft);
  color: var(--accent);
  font: inherit;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

/* before any classes are added it is a labelled button ("first", not "empty": that is the day-off layout) */
.classes-btn.first {
  padding: 0 9px 0 7px;
  background: var(--accent);
  color: var(--w-on-accent);
}

.classes-btn:hover {
  filter: brightness(0.95);
}

.classes-btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.chip {
  padding: 3px 8px;
  border-radius: 999px;
  background: var(--w-soft);
  color: var(--secondary);
  font-size: 11px;
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
}

/* ---- empty ---- */
.empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  text-align: center;
  padding: 0 6px;
}

.empty-icon {
  color: var(--accent);
  margin-bottom: 4px;
}

.empty-title {
  font-size: 17px;
  font-weight: 700;
}

.empty-sub {
  font-size: 13px;
  color: var(--w-muted);
}

/* ---- medium ---- */
.now {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 4px;
}

.now-top,
.now-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;
}

.now-pill {
  flex: none;
  padding: 3px 9px;
  border-radius: 999px;
  background: var(--w-soft);
  color: var(--secondary);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.now-pill.live {
  background: var(--accent);
  color: var(--w-on-accent);
}

.now-range {
  font-size: 13px;
  font-weight: 600;
  color: var(--w-muted);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.now-title {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.01em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.now-next {
  min-width: 0;
  font-size: 13px;
  color: var(--w-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.now-left {
  flex: none;
  font-size: 13px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--primary);
}

/* ---- large ---- */
.rows {
  flex: 1;
  min-height: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 3px;
  overflow-y: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}

.rows::-webkit-scrollbar {
  display: none;
}

.row {
  position: relative;
  /* rows share the height: roomy on an 8-period day, tighter on a 9-period one, scrolling beyond that */
  flex: 1 0 24px;
  max-height: 40px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 11px 0 4px;
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: 14px;
  overflow: hidden;
}

.row > * {
  position: relative;
}

.badge {
  flex: none;
  box-sizing: border-box;
  min-width: 22px;
  height: 22px;
  padding: 0 5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: var(--w-soft);
  color: var(--secondary);
  font-size: 11.5px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

.row-name {
  flex: 1 1 auto;
  min-width: 0;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.row-room {
  margin-left: 7px;
  font-size: 12px;
  font-weight: 600;
  color: var(--w-muted);
}

.row.is-now .row-room {
  color: inherit;
  opacity: 0.8;
}

.row-time {
  flex: none;
  font-size: 13px;
  font-weight: 600;
  color: var(--w-muted);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.row-tag {
  flex: none;
  padding: 2px 7px;
  border-radius: 999px;
  background: var(--w-soft);
  color: var(--secondary);
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.row.is-past {
  opacity: 0.45;
}

.row.is-next {
  border-color: var(--w-line-strong);
}

.row.is-now {
  background: var(--accent);
  color: var(--w-on-accent);
  box-shadow: 0 4px 12px -6px rgba(0, 0, 0, 0.5);
}

/* the part of the period that has already gone by */
.row.is-now .row-fill {
  position: absolute;
  inset: 0 auto 0 0;
  background: rgba(0, 0, 0, 0.16);
  transition: width 1s linear;
}

.row.is-now .badge {
  background: var(--w-on-accent);
  color: var(--accent);
}

.row.is-now .row-time {
  color: inherit;
  font-weight: 700;
}
</style>
