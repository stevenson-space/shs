<template>
  <BaseCard
    label="COUNTDOWN"
    show-menu
    @menu="emit('menu')"
  >
    <div class="countdown-body">
      <div class="countdown-header">
        <span class="event-name">{{ eventName }}</span>
        <span class="event-date">{{ formattedDate }}</span>
      </div>
      <div class="countdown-units" role="timer" :aria-label="`${eventName} countdown`">
        <div v-if="isEnded" class="unit-box reached-box">
          <CircleCheck :size="18" :stroke-width="2" aria-hidden="true" />
          <span class="reached-text">Reached</span>
        </div>
        <template v-else>
          <div
            v-for="(unit, i) in units"
            :key="i"
            class="unit-box"
          >
            <span class="unit-value">{{ unit.value }}</span>
            <span class="unit-label">{{ unit.label }}</span>
          </div>
        </template>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { CircleCheck } from 'lucide-vue-next'
import BaseCard from '../BaseCard.vue'
import { useCountdown } from './useCountdown'

const props = defineProps<{
  eventName: string
  targetDate: Date
}>()

const emit = defineEmits<{ menu: [] }>()

const { units, isEnded, formattedDate } = useCountdown(() => props.targetDate)
</script>

<style scoped>
.countdown-body {
  min-height: 68px;
}

.countdown-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
}

.event-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  letter-spacing: -0.025em;
}

.event-date {
  font-size: 9px;
  color: rgba(0, 0, 0, 0.38);
  font-family: monospace;
  white-space: nowrap;
}

.countdown-units {
  display: flex;
  gap: 6px;
  min-height: 48px;
}

.unit-box {
  flex: 1;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  padding: 7px 4px;
  text-align: center;
}

.unit-value {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: -0.03em;
  line-height: 1;
}

.unit-label {
  display: block;
  font-size: 7.5px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.35);
  margin-top: 2px;
}

.reached-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--accent);
}

.reached-text {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--accent);
}
</style>
