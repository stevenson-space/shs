<template>
  <div class="page">
    <div class="grid-container">
      <div class="period-card">
        <ScrollablePeriodList ref="periodList" :tv-space="true"/>
      </div>

      <div class="time-card">
        <div class="time-content">
          <div class="current-time">{{ formatTime(date) }}</div>
          <div class="current-date">{{ formatFullDate(date).toUpperCase() }}</div>
        </div>
      </div>

      <div class="countdown-card">
        <div class="countdown-content">
          <div class="countdown">
            {{ intoCountdownString(totalSecondsLeft) }} <span class="left-text">LEFT</span>
          </div>
          <div class="schedule-name">{{ bell.type.toUpperCase() }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import useClockStore from '@/stores/clock'
import { intoCountdownString } from '@/utils/countdown';
import { formatTime, formatFullDate } from '@/utils/clock';
import { mapActions, mapState } from "pinia";
import { dateToSeconds } from "@/utils/util";
import ScrollablePeriodList from "@/components/ScrollablePeriodList.vue";
import useThemeStore from '@/stores/themes';
import tvspaceTheme from "@/themes/tvspace.json";

export default {
  components: {
    ScrollablePeriodList
  },
  mounted() {
    if (this.$route.query.settheme === 'true') {
      this.setStyling(tvspaceTheme);
    }
  },
  computed: {
    ...mapState(useClockStore, ['bell', 'date']),
    totalSecondsLeft(): number {
      return this.bell.getSecondsUntilNextTarget() - dateToSeconds(this.date)
    },
  },
  methods: {
    ...mapActions(useThemeStore, ['setStyling']),
    formatFullDate,
    formatTime,
    intoCountdownString
  }
}
</script>

<style scoped lang="sass">
@import '@/styles/style.sass'

.page
  height: 100vh
  display: flex
  padding: 25px
  background: var(--background)
  box-sizing: border-box

.grid-container
  display: grid
  grid-template-columns: 1fr 2fr
  grid-template-rows: 1fr 1fr
  gap: 20px
  width: 100%
  height: 100%

.period-card, .time-card, .countdown-card
  background-color: var(--background)
  border-radius: 25px
  border: 3px solid rgba(0, 0, 0, 0.15)
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)
  display: flex
  align-items: center
  justify-content: center

.period-card
  grid-column: 1
  grid-row: 1 / 3
  padding: 25px
  flex-direction: column
  justify-content: center
  align-items: stretch
  overflow: hidden

  // Make periods larger to fill the card better
  :deep(.periods)
    padding: 10px
    gap: 18px

  :deep(.period)
    height: 60px
    min-width: 100%

    .range
      font-size: 2em
      font-weight: bold

    .circle
      font-size: 2.3em !important
      min-width: 50px
      width: auto
      height: 50px
      border-radius: 25px
      padding: 0 10px
      margin: 5px
      display: flex
      align-items: center
      justify-content: center
      flex-shrink: 0

      &.invert
        padding: 0 12px 0 8px

    .progress
      margin: 5px
      transform: scale(1.75)
      flex-shrink: 0

      text
        font-size: 19px

.time-card
  grid-column: 2
  grid-row: 1
  padding: 50px

.countdown-card
  grid-column: 2
  grid-row: 2
  padding: 50px

.time-content
  text-align: center
  width: 100%

.current-time
  font-size: 10em
  line-height: 0.9em
  color: var(--primary)
  margin-bottom: 20px
  font-family: 'Arial', 'Helvetica', sans-serif

.current-date
  font-size: 2.8em
  color: var(--tertiary)
  font-weight: bolder
  letter-spacing: 0.05em

.countdown-content
  text-align: center
  width: 100%

.countdown
  font-size: 8em
  line-height: 0.9em
  color: var(--primary)
  margin-bottom: 20px
  font-family: 'Arial', 'Helvetica', sans-serif

.left-text
  color: var(--primary)
  font-weight: normal
  font-size: 0.75em
  vertical-align: middle

.schedule-name
  color: var(--tertiary)
  font-weight: bolder
  font-size: 2.8em
  line-height: 1em
  letter-spacing: 0.05em
</style>
