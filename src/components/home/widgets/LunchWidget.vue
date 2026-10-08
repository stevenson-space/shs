<template>
  <WidgetShell title="Lunch" :icon="Utensils" :size="size">
    <div v-if="!stations.length" class="empty">
      <Utensils class="empty-icon" :size="24" :stroke-width="1.8" aria-hidden="true" />
      <div class="empty-title">{{ emptyTitle }}</div>
      <div class="empty-sub">{{ emptySub }}</div>
    </div>

    <ul v-else class="stations" :class="`is-${size}`">
      <li v-for="station in visibleStations" :key="station.name" class="station">
        <p class="station-text">
          <span class="station-name">{{ station.name }}</span>
          <span class="station-items">{{ station.items.join(' · ') }}</span>
        </p>
      </li>
    </ul>
  </WidgetShell>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Utensils } from 'lucide-vue-next';
import { getLunchMenu } from '@/utils/food/lunch-menu';
import useClockStore from '@/stores/clock';
import WidgetShell from '../WidgetShell.vue';
import type { WidgetSize } from '../layout';

const { size = 'large' } = defineProps<{ size?: WidgetSize }>();

const clockStore = useClockStore();

const servesLunch = computed(() => clockStore.bell?.isSchoolDay && clockStore.bell?.type !== 'Summer');

// Same menu, station names and order as the rest of the site (see lunch-menu.ts).
const stations = computed(() => Object.entries(getLunchMenu(clockStore.date, clockStore.bell) ?? {})
  .map(([name, items]) => ({ name, items: items.filter(Boolean) }))
  .filter((station) => station.items.length > 0));

// The medium size only has room for the three main entrees.
const ENTREES = ['Comfort Food', 'Mindful', 'International'];
const visibleStations = computed(() => (size === 'medium'
  ? stations.value.filter((station) => ENTREES.includes(station.name))
  : stations.value));

const emptyTitle = computed(() => (servesLunch.value ? 'No menu posted' : 'No lunch today'));
const emptySub = computed(() => (servesLunch.value
  ? "We show it as soon as Stevenson's lunch site has it."
  : 'The menu comes back on the next school day.'));
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
  padding: 0 8px;
}

.empty-icon {
  color: var(--accent);
  margin-bottom: 4px;
}

.empty-title {
  font-size: 16px;
  font-weight: 700;
}

.empty-sub {
  font-size: 12.5px;
  line-height: 1.35;
  color: var(--w-muted);
}

.stations {
  flex: 1;
  min-height: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  scrollbar-width: none;
}

.stations::-webkit-scrollbar {
  display: none;
}

.station {
  flex: 1 0 auto;
  display: flex;
  align-items: center;
  padding: 6px 0;
  min-width: 0;
}

.station + .station {
  border-top: 1px solid var(--w-line);
}

/*
  The station's name runs in front of its dishes and wraps with them, so a
  long name like "International Station" costs no extra line.
*/
.station-text {
  margin: 0;
  min-width: 0;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.3;
  /* long menus wrap to two lines, then cut off */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}

.station-name {
  margin-right: 5px;
  color: var(--accent);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.stations.is-medium .station {
  padding: 3px 0;
}

.stations.is-medium .station-text {
  -webkit-line-clamp: 1;
  line-clamp: 1;
  font-size: 13.5px;
}
</style>
