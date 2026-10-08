<template>
  <WidgetShell title="Weather" :icon="CloudSun" :size="size">
    <template v-if="size !== 'small'" #action>
      <a class="credit" href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo</a>
    </template>

    <div v-if="state.status === 'loading'" class="center muted" aria-busy="true">
      <div class="skeleton" />
    </div>

    <div v-else-if="state.status === 'error'" class="center muted">
      <WifiOff :size="20" :stroke-width="2" aria-hidden="true" />
      <span>Weather is unavailable</span>
    </div>

    <!-- Small: just right now -->
    <div v-else-if="size === 'small'" class="small">
      <component :is="today.icon" class="small-icon" :size="30" :color="today.color" :stroke-width="1.9" aria-hidden="true" />
      <div class="temp">{{ state.data.current }}°</div>
      <div class="small-meta">
        <span>{{ today.label }}</span>
        <span class="hl">H {{ today.high }}° · L {{ today.low }}°</span>
      </div>
    </div>

    <!-- Medium: now + the next three days -->
    <div v-else-if="size === 'medium'" class="medium">
      <div class="current">
        <component :is="today.icon" class="current-icon" :size="36" :color="today.color" :stroke-width="1.8" aria-hidden="true" />
        <div class="current-text">
          <div class="temp">{{ state.data.current }}°</div>
          <div class="cond">{{ today.label }}</div>
          <div class="hl">H {{ today.high }}° · L {{ today.low }}°</div>
        </div>
      </div>
      <div class="chips">
        <div v-for="day in upcoming.slice(0, 3)" :key="day.name" class="day-chip">
          <span class="chip-day">{{ day.name }}</span>
          <component :is="day.icon" :size="19" :color="day.color" :stroke-width="2" aria-hidden="true" />
          <span class="chip-high">{{ day.high }}°</span>
          <span class="chip-low">{{ day.low }}°</span>
        </div>
      </div>
    </div>

    <!-- Large: now + the rest of the week as a list -->
    <div v-else class="large">
      <div class="current">
        <component :is="today.icon" :size="44" :color="today.color" :stroke-width="1.7" aria-hidden="true" />
        <div class="current-text">
          <div class="temp big">{{ state.data.current }}°</div>
        </div>
        <div class="current-side">
          <div class="cond">{{ today.label }}</div>
          <div class="hl">H {{ today.high }}° · L {{ today.low }}°</div>
          <div class="hl">{{ today.rain }}% chance of rain</div>
        </div>
      </div>
      <ul class="week">
        <li v-for="day in upcoming" :key="day.name" class="week-row">
          <span class="week-day">{{ day.name }}</span>
          <component :is="day.icon" :size="19" :color="day.color" :stroke-width="2" aria-hidden="true" />
          <span class="week-rain">{{ day.rain >= 20 ? day.rain + '%' : '' }}</span>
          <span class="week-low">{{ day.low }}°</span>
          <span class="range" aria-hidden="true">
            <span class="range-fill" :style="day.rangeStyle" />
          </span>
          <span class="week-high">{{ day.high }}°</span>
        </li>
      </ul>
    </div>
  </WidgetShell>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue';
import { Cloud, CloudRain, CloudSun, Sun, WifiOff } from 'lucide-vue-next';
import WidgetShell from '../WidgetShell.vue';
import { useWeather, type WeatherDay } from '../useWeather';
import type { WidgetSize } from '../layout';

const { size = 'medium' } = defineProps<{ size?: WidgetSize }>();

const { state } = useWeather();

type Condition = { icon: Component; color: string; label: string };

function condition(day: WeatherDay): Condition {
  if (day.rain >= 40) return { icon: CloudRain, color: '#3b82f6', label: 'Rainy' };
  if (day.cloud <= 30) return { icon: Sun, color: '#f59e0b', label: 'Sunny' };
  if (day.cloud <= 70) return { icon: CloudSun, color: '#f59e0b', label: 'Partly cloudy' };
  return { icon: Cloud, color: '#94a3b8', label: 'Cloudy' };
}

const days = computed(() => (state.value.status === 'ready' ? state.value.data.days : []));

const today = computed(() => {
  const day = days.value[0] ?? { label: 'Today', high: 0, low: 0, rain: 0, cloud: 0 };
  return { ...day, ...condition(day) };
});

// The days after today, with where each one's low-to-high bar sits within the week's range.
const upcoming = computed(() => {
  const rest = days.value.slice(1);
  const min = Math.min(...rest.map((day) => day.low));
  const max = Math.max(...rest.map((day) => day.high));
  const span = Math.max(1, max - min);

  return rest.map((day) => ({
    name: day.label,
    high: day.high,
    low: day.low,
    rain: day.rain,
    ...condition(day),
    rangeStyle: {
      left: `${((day.low - min) / span) * 100}%`,
      right: `${((max - day.high) / span) * 100}%`,
    },
  }));
});
</script>

<style scoped>
.credit {
  font-size: 10.5px;
  font-weight: 600;
  color: var(--w-muted);
  opacity: 0.75;
  text-decoration: none;
}

.credit:hover {
  opacity: 1;
  text-decoration: underline;
}

.center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
}

.muted {
  color: var(--w-muted);
}

.skeleton {
  width: 70%;
  height: 46%;
  border-radius: 12px;
  background: linear-gradient(90deg, var(--w-soft) 25%, var(--w-line) 50%, var(--w-soft) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.temp {
  font-size: 34px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}

.temp.big {
  font-size: 46px;
}

.cond {
  font-size: 13.5px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hl {
  font-size: 12.5px;
  color: var(--w-muted);
  font-variant-numeric: tabular-nums;
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

.small-icon {
  margin-top: 2px;
}

.small-meta {
  display: flex;
  flex-direction: column;
  gap: 1px;
  font-size: 13px;
  font-weight: 600;
}

/* ---- medium ---- */
.medium {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.current {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
}

.current-icon {
  flex: none;
}

.current-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.chips {
  flex: none;
  display: flex;
  gap: 5px;
  height: 100%;
  max-height: 96px;
}

.day-chip {
  box-sizing: border-box;
  width: 42px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0 7px;
  border-radius: 12px;
  background: var(--w-soft);
}

.chip-day {
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--w-muted);
}

.chip-high {
  font-size: 13.5px;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.chip-low {
  font-size: 12px;
  line-height: 1;
  color: var(--w-muted);
  font-variant-numeric: tabular-nums;
}

/* ---- large ---- */
.large {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.large .current {
  flex: none;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--w-line);
}

.current-side {
  margin-left: auto;
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.week {
  flex: 1;
  min-height: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.week-row {
  display: grid;
  grid-template-columns: 38px 22px 34px 30px minmax(20px, 1fr) 30px;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-variant-numeric: tabular-nums;
}

.week-day {
  font-weight: 700;
}

.week-rain {
  font-size: 11.5px;
  font-weight: 700;
  color: #3b82f6;
}

.week-low {
  text-align: right;
  color: var(--w-muted);
}

.week-high {
  font-weight: 700;
}

.range {
  position: relative;
  height: 5px;
  border-radius: 999px;
  background: var(--w-soft);
}

.range-fill {
  position: absolute;
  top: 0;
  bottom: 0;
  min-width: 6px;
  border-radius: inherit;
  background: linear-gradient(90deg, #60a5fa, #f59e0b);
}

@media (prefers-reduced-motion: reduce) {
  .skeleton {
    animation: none;
  }
}
</style>
