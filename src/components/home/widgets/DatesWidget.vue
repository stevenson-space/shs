<template>
  <!-- "Breaks & Dates" doesn't fit a small widget, which shows just the next one anyway -->
  <WidgetShell :title="size === 'small' ? 'Next up' : 'Breaks & Dates'" :icon="CalendarHeart" to="/calendar" :size="size">
    <template #action>
      <button class="add-btn" type="button" title="Add a date" aria-label="Add an important date" @click.stop="openNew">
        <Plus :size="13" :stroke-width="3" aria-hidden="true" />
      </button>
    </template>

    <!-- Small: the next one, big -->
    <div v-if="size === 'small'" class="small">
      <template v-if="combined[0]">
        <div class="big">
          <span class="big-value">{{ combined[0].count }}</span>
          <span class="big-unit">{{ combined[0].unit }}</span>
        </div>
        <div class="meta">
          <span class="name"><Star v-if="combined[0].mine" class="star" :size="12" :stroke-width="2.6" aria-hidden="true" />{{ combined[0].name }}</span>
          <span class="when">{{ combined[0].shortWhen }}</span>
        </div>
      </template>
      <div v-else class="empty">
        <div class="empty-sub">Nothing coming up</div>
      </div>
    </div>

    <!-- Medium: the next few, breaks and the student's own dates together -->
    <ul v-else-if="size === 'medium'" class="list">
      <li v-for="item in combined.slice(0, 3)" :key="item.key">
        <component
          :is="item.mine ? 'button' : 'div'"
          class="item"
          :class="{ mine: item.mine, on: item.on }"
          v-bind="item.mine ? { type: 'button', title: 'Edit this date' } : {}"
          @click="item.mine && openEdit(item)"
        >
          <span class="count"><b>{{ item.count }}</b><small v-if="item.unit">{{ item.unit }}</small></span>
          <span class="text">
            <span class="name"><Star v-if="item.mine" class="star" :size="11" :stroke-width="2.6" aria-hidden="true" />{{ item.name }}</span>
            <span class="when">{{ item.when }}</span>
          </span>
        </component>
      </li>
      <li v-if="!combined.length" class="none">No breaks or dates coming up.</li>
    </ul>

    <!-- Large: every break this year, then the student's own dates -->
    <div v-else class="sections">
      <section>
        <h3 class="section-title">Breaks</h3>
        <ul class="list">
          <li v-for="item in breakItems" :key="item.key">
            <div class="item" :class="{ on: item.on }">
              <span class="count"><b>{{ item.count }}</b><small v-if="item.unit">{{ item.unit }}</small></span>
              <span class="text">
                <span class="name">{{ item.name }}</span>
                <span class="when">{{ item.when }}</span>
              </span>
            </div>
          </li>
          <li v-if="loaded && !breakItems.length" class="none">No more breaks this school year.</li>
        </ul>
      </section>

      <section>
        <h3 class="section-title">My dates</h3>
        <ul v-if="myItems.length" class="list">
          <li v-for="item in myItems" :key="item.key">
            <button class="item mine" type="button" title="Edit this date" @click="openEdit(item)">
              <span class="count"><b>{{ item.count }}</b><small v-if="item.unit">{{ item.unit }}</small></span>
              <span class="text">
                <span class="name"><Star class="star" :size="11" :stroke-width="2.6" aria-hidden="true" />{{ item.name }}</span>
                <span class="when">{{ item.when }}</span>
              </span>
            </button>
          </li>
        </ul>
        <button v-else class="add-row" type="button" @click="openNew">
          <Plus :size="14" :stroke-width="2.8" aria-hidden="true" />
          Add a test, a deadline, anything
        </button>
      </section>
    </div>

    <WidgetSettings
      v-if="editing"
      kind="date"
      :config="editing"
      @close="editing = null"
      @save="onSave"
      @remove="onRemove"
    />
  </WidgetShell>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { CalendarHeart, Plus, Star } from 'lucide-vue-next';
import useClockStore from '@/stores/clock';
import useScheduleStore from '@/stores/schedules';
import WidgetShell from '../WidgetShell.vue';
import WidgetSettings from '../WidgetSettings.vue';
import { findBreaks, type SchoolBreak } from '../breaks';
import { loadDayOffNamer, loadLastDayOfSchool, type DayOffNamer } from '../calendarNames';
import { dayOf, useMyDates } from '../myDates';
import type { WidgetSize } from '../layout';

/*
  How long until every big break (from the school calendar), next to the
  dates the student has added themselves: an AP exam, prom, a deadline.
*/

type Item = {
  key: string;
  name: string;
  start: Date;
  // the big number and its unit: "49" "days", "Today", "Now"
  count: string;
  unit: string;
  // the line under the name, and a shorter one for the small size
  when: string;
  shortWhen: string;
  // a break that is happening right now
  on: boolean;
  // one of the student's own dates (id is set)
  mine: boolean;
  id?: string;
  date?: string;
};

const { size = 'medium' } = defineProps<{ size?: WidgetSize }>();

const clockStore = useClockStore();
const scheduleStore = useScheduleStore();
const { dates, add, update, remove } = useMyDates();

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const daysBetween = (from: Date, to: Date) => Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / 86400000);
const fmt = (date: Date) => date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
const fmtShort = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

// the clock ticks every second; the day as a number stays the same all day, so
// everything below only re-runs when the date changes
const dayStart = computed(() => startOfDay(clockStore.date).getTime());
const today = computed(() => new Date(dayStart.value));

// The breaks only change when the day does, and finding them walks the whole year, so it is deferred.
const breaks = ref<SchoolBreak[]>([]);
const loaded = ref(false);
let dayOffName: DayOffNamer | null = null;
let lastDayOfSchool: Date | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;

function reload(): void {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    breaks.value = findBreaks({
      from: today.value,
      schedules: scheduleStore.schedules,
      nameFor: dayOffName ?? undefined,
      lastDayOfSchool,
    });
    loaded.value = true;
  }, 150);
}

function countdown(start: Date): { count: string; unit: string } {
  const days = daysBetween(today.value, start);
  if (days <= 0) return { count: 'Today', unit: '' };
  return { count: String(days), unit: days === 1 ? 'day' : 'days' };
}

const breakItems = computed((): Item[] => breaks.value.map((entry) => {
  const on = entry.start <= today.value;
  let when: string;

  if (on) {
    when = entry.back ? `You're on break · back ${fmt(entry.back)}` : "You're on break";
  } else if (entry.end) {
    when = `${fmt(entry.start)} – ${fmt(entry.end)}`;
  } else {
    when = `Starts ${fmt(entry.start)}`;
  }

  return {
    key: entry.key,
    name: entry.name,
    start: entry.start,
    ...(on ? { count: 'Now', unit: '' } : countdown(entry.start)),
    when,
    shortWhen: on ? 'On break' : fmtShort(entry.start),
    on,
    mine: false,
  };
}));

const myItems = computed((): Item[] => dates.value
  .map((entry) => ({ entry, start: dayOf(entry.date) }))
  .filter(({ start }) => start >= today.value)
  .sort((a, b) => a.start.getTime() - b.start.getTime())
  .map(({ entry, start }) => ({
    key: entry.id,
    id: entry.id,
    date: entry.date,
    name: entry.title,
    start,
    ...countdown(start),
    when: fmt(start),
    shortWhen: fmtShort(start),
    on: false,
    mine: true,
  })));

// soonest first; a break that is on right now stays at the top
const combined = computed(() => [...breakItems.value, ...myItems.value]
  .sort((a, b) => Number(b.on) - Number(a.on) || a.start.getTime() - b.start.getTime()));

/* ---- adding and editing the student's own dates ---- */

const editing = ref<Record<string, string> | null>(null);

function openNew(): void {
  editing.value = {};
}

function openEdit(item: Item): void {
  if (!item.id || !item.date) return;
  editing.value = { id: item.id, title: item.name, date: item.date };
}

function onSave(config: Record<string, string>): void {
  const id = editing.value?.id;
  if (id) {
    update(id, config.title, config.date);
  } else {
    add(config.title, config.date);
  }
  editing.value = null;
}

function onRemove(): void {
  if (editing.value?.id) remove(editing.value.id);
  editing.value = null;
}

watch(dayStart, reload);
onMounted(async () => {
  reload();
  [dayOffName, lastDayOfSchool] = await Promise.all([loadDayOffNamer(), loadLastDayOfSchool(today.value)]);
  reload();
});
onBeforeUnmount(() => {
  if (timer) clearTimeout(timer);
});
</script>

<style scoped>
.add-btn {
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: var(--accent);
  color: var(--w-on-accent);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.add-btn:hover {
  filter: brightness(1.08);
}

.add-btn:focus-visible,
.item:focus-visible,
.add-row:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.name {
  min-width: 0;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.when {
  font-size: 12px;
  color: var(--w-muted);
  line-height: 1.25;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.star {
  flex: none;
  margin-right: 4px;
  vertical-align: -1px;
  color: var(--accent);
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
  font-size: 42px;
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

.empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.empty-sub {
  font-size: 12.5px;
  color: var(--w-muted);
}

/* ---- lists (medium and large) ---- */
.sections {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  scrollbar-width: none;
}

.sections::-webkit-scrollbar {
  display: none;
}

.section-title {
  margin: 0 0 4px;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--w-muted);
}

.list {
  flex: 1;
  min-height: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  color: inherit;
  font: inherit;
  text-align: left;
}

button.item {
  cursor: pointer;
  border-radius: 12px;
  -webkit-tap-highlight-color: transparent;
}

@media (hover: hover) {
  button.item:hover .name {
    text-decoration: underline;
    text-decoration-thickness: 1.5px;
    text-underline-offset: 2px;
  }
}

/* the days-left chip */
.count {
  flex: none;
  box-sizing: border-box;
  width: 48px;
  height: 34px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
  background: var(--w-tint);
  color: var(--accent);
  line-height: 1;
}

.count b {
  font-size: 15px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

.count small {
  margin-top: 2px;
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--w-muted);
}

/* the student's own dates and a break that is on right now stand out */
.item.mine .count,
.item.on .count {
  background: var(--accent);
  color: var(--w-on-accent);
}

.item.mine .count small,
.item.on .count small {
  color: inherit;
  opacity: 0.8;
}

.text {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.none {
  font-size: 12.5px;
  color: var(--w-muted);
}

.add-row {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  height: 34px;
  padding: 0 10px;
  border: 1.5px dashed var(--w-line-strong);
  border-radius: 11px;
  background: transparent;
  color: var(--w-muted);
  font: inherit;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
}

.add-row:hover {
  color: var(--primary);
  border-color: var(--accent);
}
</style>
