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
  padding: 2rem
  box-sizing: border-box

.countdown
  font-size: min(12vw, 12rem)
  font-weight: bold
  color: var(--secondary)
  margin-bottom: min(3vw, 3rem)
  line-height: 1em
  text-align: center
  +mobile-small
    font-size: min(15vw, 4rem)
    margin-bottom: min(4vw, 1.5rem)

.schedule-name
  font-size: min(4vw, 4rem)
  font-weight: bold
  color: var(--secondary)
  text-transform: uppercase
  text-align: center
  +mobile-small
    font-size: min(8vw, 2rem)

.next-day
  font-size: min(4vw, 4rem)
  color: var(--secondary)
  text-align: center
  white-space: pre-line
  font-weight: normal
  max-width: 80vw
  line-height: 1.3
  +mobile-small
    font-size: min(5vw, 1.5rem)
    max-width: 90vw
</style>
