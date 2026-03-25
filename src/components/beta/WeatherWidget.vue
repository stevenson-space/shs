<template>
  <BaseCard
    label="WEATHER"
    :show-flag="true"
    :show-menu="true"
    @flag="emit('flag')"
    @menu="emit('menu')"
  >
    <div v-if="state.status === 'loading'" class="skeleton-body">
      <div class="skeleton-left">
        <div class="skeleton-block skeleton-icon" />
        <div class="skeleton-lines">
          <div class="skeleton-block skeleton-temp" />
          <div class="skeleton-block skeleton-desc" />
          <div class="skeleton-block skeleton-hl" />
        </div>
      </div>
      <div class="skeleton-chips">
        <div class="skeleton-block skeleton-chip" />
        <div class="skeleton-block skeleton-chip" />
      </div>
    </div>

    <div v-else-if="state.status === 'error'" class="error-state">
      <WifiOff :size="16" aria-hidden="true" />
      <span>Unable to load weather</span>
    </div>

    <div v-else class="weather-body">
      <div class="current">
        <component
          :is="currentCondition.icon"
          :size="32"
          :color="currentCondition.color"
          :stroke-width="1.75"
          aria-hidden="true"
        />
        <div class="current-text">
          <span class="temp">{{ state.data.currentTemp }}°</span>
          <span class="desc">{{ currentCondition.label }}</span>
          <span class="hl">
            H:{{ state.data.today.temp_high }}° · L:{{ state.data.today.temp_low }}°
          </span>
        </div>
      </div>
      <div class="forecast">
        <div
          v-for="day in forecastWithCondition"
          :key="day.day"
          class="chip"
          data-testid="forecast-chip"
        >
          <span class="chip-day">{{ day.day }}</span>
          <component
            :is="day.condition.icon"
            :size="18"
            :color="day.condition.color"
            :stroke-width="1.75"
            aria-hidden="true"
          />
          <span class="chip-temps">
            <b>{{ day.temp_high }}°</b>
            <span class="chip-low">{{ day.temp_low }}°</span>
          </span>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import { Sun, CloudSun, Cloud, CloudRain, WifiOff } from 'lucide-vue-next'
import BaseCard from './BaseCard.vue'
import { useWeatherData } from './useWeatherData'

const emit = defineEmits<{ flag: []; menu: [] }>()

const { state } = useWeatherData()

interface Condition {
  icon: Component
  color: string
  label: string
}

function getCondition(cloudcover: number, rainPercent: number): Condition {
  if (rainPercent >= 40) return { icon: CloudRain, color: '#3b82f6', label: 'Rainy' }
  if (cloudcover <= 30) return { icon: Sun, color: '#f59e0b', label: 'Sunny' }
  if (cloudcover <= 70) return { icon: CloudSun, color: '#f59e0b', label: 'Partly cloudy' }
  return { icon: Cloud, color: '#64748b', label: 'Cloudy' }
}

const currentCondition = computed((): Condition => {
  if (state.value.status !== 'loaded') return { icon: Sun, color: '#f59e0b', label: '' }
  const { cloudcover, rain_percent } = state.value.data.today
  return getCondition(cloudcover, rain_percent)
})

const forecastWithCondition = computed(() => {
  if (state.value.status !== 'loaded') return []
  return state.value.data.forecast.map((day) => ({
    ...day,
    condition: getCondition(day.cloudcover, day.rain_percent),
  }))
})
</script>

<style scoped>
.weather-body {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: space-between;
  min-height: 84px;
}

.current {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.current-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.temp {
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
  color: var(--primary);
  letter-spacing: -0.02em;
}

.desc,
.hl {
  font-size: 12px;
  color: var(--secondary);
  opacity: 0.6;
  line-height: 1.3;
}

.hl {
  font-size: 11px;
}

.forecast {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
  flex-grow: 1;
  max-width: 160px;
}

.chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 8px;
  padding: 10px 12px;
  min-width: 52px;
  flex: 1;
}

.chip-day {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--secondary);
  opacity: 0.6;
}

.chip-temps {
  font-size: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
}

.chip-temps b {
  font-weight: 600;
  color: var(--primary);
  line-height: 1;
}

.chip-low {
  font-size: 11px;
  opacity: 0.55;
  color: var(--secondary);
  line-height: 1;
}

.error-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 84px;
  font-size: 12px;
  color: var(--secondary);
  opacity: 0.6;
}

.skeleton-body {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 84px;
}

.skeleton-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.skeleton-lines {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.skeleton-chips {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.skeleton-block {
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.05) 25%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.05) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 4px;
}

.skeleton-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
}

.skeleton-temp {
  width: 48px;
  height: 20px;
  border-radius: 6px;
}

.skeleton-desc {
  width: 80px;
  height: 11px;
}

.skeleton-hl {
  width: 56px;
  height: 10px;
}

.skeleton-chip {
  width: 52px;
  height: 68px;
  border-radius: 8px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
