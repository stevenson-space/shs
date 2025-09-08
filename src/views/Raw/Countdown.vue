<template>
  <div class="countdown-container">
    <div class="countdown">
      {{ intoCountdownString(totalSecondsLeft) }}
    </div>
    <div v-if="bell.inSchool || clockMode === 'day'" class="schedule-name">
      {{ bell.type.toUpperCase() }}
    </div>
    <div v-else class="next-day">
      {{ nextDayMessage }}
    </div>
  </div>
</template>

<script lang="ts">
import useClockStore from '@/stores/clock';
import { intoCountdownString, schoolResumesString } from '@/utils/countdown';
import { mapState } from 'pinia';
import { dateToSeconds } from '@/utils/util';

export default {
  computed: {
    ...mapState(useClockStore, ['bell', 'date', 'clockMode']),
    totalSecondsLeft(): number {
      return this.bell.getSecondsUntilNextTarget() - dateToSeconds(this.date);
    },
    nextDayMessage(): string | null {
      return schoolResumesString(this.bell, this.date)?.replace(',', ',\n') ?? null;
    }
  },
  methods: {
    intoCountdownString,
  }
};
</script>

<style scoped lang="sass">
@import '@/styles/style.sass'

.countdown-container
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  height: 100vh
  background: var(--background)
  color: var(--secondary)
  font-family: 'Open Sans', Helvetica, sans-serif

.countdown
  font-size: 4rem
  font-weight: bold
  color: var(--secondary)
  margin-bottom: 1rem

.schedule-name
  font-size: 2rem
  font-weight: bold
  color: var(--secondary)
  text-transform: uppercase

.next-day
  font-size: 1.5rem
  color: var(--secondary)
  text-align: center
  white-space: pre-line
  font-weight: normal
</style>
