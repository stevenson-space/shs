<template>
  <WidgetShell title="Upcoming" :icon="CalendarDays" to="/calendar" :size="size">
    <template #action>
      <router-link class="flag" to="/getHelp" title="Something look wrong? Tell us" aria-label="Report a problem with upcoming events">
        <Flag :size="13" :stroke-width="2.4" aria-hidden="true" />
      </router-link>
    </template>

    <div v-if="loaded && !events.length" class="empty">
      <div class="empty-title">Nothing special coming up</div>
      <div class="empty-sub">Late arrivals, assemblies and days off show here.</div>
    </div>

    <ul v-else class="events">
      <li v-for="event in visibleEvents" :key="event.key" class="event">
        <span class="date">
          <span class="date-month">{{ event.month }}</span>
          <span class="date-day">{{ event.day }}</span>
        </span>
        <span class="event-text">
          <span class="event-name">{{ event.name }}</span>
          <span class="event-when">{{ event.when }}</span>
        </span>
      </li>
    </ul>
  </WidgetShell>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { CalendarDays, Flag } from 'lucide-vue-next';
import Bell from '@/utils/bell';
import useClockStore from '@/stores/clock';
import useScheduleStore from '@/stores/schedules';
import WidgetShell from '../WidgetShell.vue';
import { loadDayOffNamer, type DayOffNamer } from '../calendarNames';
import type { WidgetSize } from '../layout';

// lastDate is set when the event runs over several school days (a break)
type UpcomingEvent = { key: string; date: Date; lastDate?: Date; name: string };

const { size = 'medium' } = defineProps<{ size?: WidgetSize }>();

const clockStore = useClockStore();
const scheduleStore = useScheduleStore();

// How far ahead to look, and how many events to collect at most.
const LOOKAHEAD_DAYS = 120;
const MAX_EVENTS = 8;

const events = ref<UpcomingEvent[]>([]);
const loaded = ref(false);
const dayOffName = ref<DayOffNamer | null>(null);
let timer: ReturnType<typeof setTimeout> | null = null;

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

// The day being viewed, as a number that stays the same all day, so the list
// (and the "in 8 days" text) only update when the date changes, not every clock tick.
const dayKey = computed(() => startOfDay(clockStore.date).getTime());
const today = computed(() => new Date(dayKey.value));

// Walks forward one day at a time and collects days with a special schedule
// (late arrival, activity period, no school...). A run of the same schedule
// on back-to-back days, like a week-long break, is listed once.
function findEvents(): UpcomingEvent[] {
  const found: UpcomingEvent[] = [];
  const start = startOfDay(clockStore.date);
  let previousName = '';

  for (let i = 1; i <= LOOKAHEAD_DAYS && found.length < MAX_EVENTS; i++) {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    const schedule = Bell.getScheduleType(date, scheduleStore.schedules);
    const special = schedule && schedule.isSpecial;

    if (special && schedule.name !== previousName) {
      // days off use the school calendar's name ("Spring Break") when it has one
      const calendarName = schedule.name === 'No School' && dayOffName.value ? dayOffName.value(date) : '';
      found.push({ key: `${schedule.name}-${date.getTime()}`, date, name: calendarName || schedule.name });
    } else if (special && found.length) {
      // still the same break: stretch the event so its full range is shown
      found[found.length - 1].lastDate = date;
    }

    // weekends in the middle of a break should not split it into two events
    if (special || date.getDay() % 6 !== 0) {
      previousName = special ? schedule.name : '';
    }
  }

  return found;
}

function reload(): void {
  if (timer) clearTimeout(timer);

  // deferred so flipping through days in the header stays snappy
  timer = setTimeout(() => {
    events.value = findEvents();
    loaded.value = true;
  }, 200);
}

const daysBetween = (from: Date, to: Date) => Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / 86400000);
const weekday = (date: Date, style: 'long' | 'short') => date.toLocaleDateString('en-US', { weekday: style });
const monthDay = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

// "Tomorrow", "Thursday · in 8 days", or for a break "Wed – Fri" / "Dec 21 – Jan 5 · in 30 days"
function describe({ date, lastDate }: UpcomingEvent): string {
  const days = daysBetween(today.value, date);
  let when = days === 1 ? 'Tomorrow' : weekday(date, 'long');

  if (lastDate) {
    const end = daysBetween(date, lastDate) < 7 ? weekday(lastDate, 'short') : monthDay(lastDate);
    const start = days === 1 ? 'Tomorrow' : (daysBetween(date, lastDate) < 7 ? weekday(date, 'short') : monthDay(date));
    when = `${start} – ${end}`;
  }

  return days < 7 ? when : `${when} · in ${days} days`;
}

const visibleEvents = computed(() => events.value
  .slice(0, size === 'large' ? 6 : 3)
  .map((event) => ({
    key: event.key,
    name: event.name,
    month: event.date.toLocaleDateString('en-US', { month: 'short' }),
    day: event.date.getDate(),
    when: describe(event),
  })));

watch(dayKey, reload);
onMounted(async () => {
  reload();
  dayOffName.value = await loadDayOffNamer();
  reload();
});
onBeforeUnmount(() => {
  if (timer) clearTimeout(timer);
});
</script>

<style scoped>
.flag {
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--w-muted);
  opacity: 0.7;
  transition: background-color 0.15s ease, opacity 0.15s ease;
}

.flag:hover {
  background: var(--w-soft);
  opacity: 1;
}

.empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  text-align: center;
  padding: 0 8px;
}

.empty-title {
  font-size: 15px;
  font-weight: 700;
}

.empty-sub {
  font-size: 12.5px;
  line-height: 1.35;
  color: var(--w-muted);
}

.events {
  flex: 1;
  min-height: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 4px;
  overflow: hidden;
}

.event {
  flex: 0 1 44px;
  min-height: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.date {
  flex: none;
  width: 34px;
  height: 100%;
  max-height: 38px;
  min-height: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  background: var(--w-soft);
  line-height: 1;
}

.date-month {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
}

.date-day {
  margin-top: 1px;
  font-size: 14px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.event-text {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.event-name {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.event-when {
  font-size: 12px;
  line-height: 1.2;
  color: var(--w-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* the medium size fits three rows on one line each */
.size-medium .events {
  gap: 2px;
}

.size-medium .event {
  flex-basis: 28px;
  min-height: 22px;
}

.size-medium .event-text {
  flex-direction: row;
  align-items: baseline;
  gap: 8px;
  flex: 1;
}

.size-medium .event-name {
  flex: 0 1 auto;
}

.size-medium .event-when {
  flex: 1 0 auto;
  text-align: right;
}

.size-medium .date {
  flex-direction: row;
  width: auto;
  min-width: 56px;
  height: 22px;
  min-height: 22px;
  gap: 4px;
  padding: 0 7px;
  box-sizing: border-box;
}

.size-medium .date-month {
  font-size: 10px;
}

.size-medium .date-day {
  margin-top: 0;
  font-size: 13px;
}
</style>
