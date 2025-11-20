<template>
  <div class="page">
    <div class="grid-container">
      <div class="period-card">
        <ScrollablePeriodList ref="periodList" :tv-space="true"/>
      </div>

      <div class="time-card">
        <div class="time-content">
          <div class="current-time">{{ formattedTime }}</div>
          <div class="current-date">{{ formattedDate }}</div>
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
import { mapState } from "pinia";
import { dateToSeconds } from "@/utils/util";
import ScrollablePeriodList from "@/components/ScrollablePeriodList.vue";

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

export default {
  components: {
    ScrollablePeriodList
  },
  computed: {
    ...mapState(useClockStore, ['bell', 'date']),
    totalSecondsLeft(): number {
      return this.bell.getSecondsUntilNextTarget() - dateToSeconds(this.date)
    },
    formattedTime() {
      const date = this.date;
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const minutesStr = minutes < 10 ? '0' + minutes : minutes;
      return `${hours}:${minutesStr} ${ampm}`;
    },
    formattedDate() {
      const date = this.date;
      const dayName = DAYS[date.getDay()].toUpperCase();
      const monthName = MONTHS[date.getMonth()].toUpperCase();
      const dayNum = date.getDate();
      return `${dayName}, ${monthName} ${dayNum}`;
    }
  },
  methods: {
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

.period-card
  grid-column: 1
  grid-row: 1 / 3
  background-color: var(--secondaryBackground)
  border-radius: 25px
  border: 3px solid rgba(0, 0, 0, 0.15)
  padding: 25px
  display: flex
  flex-direction: column
  overflow: hidden
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)

.time-card
  grid-column: 2
  grid-row: 1
  background-color: var(--secondaryBackground)
  border-radius: 25px
  border: 3px solid rgba(0, 0, 0, 0.15)
  padding: 50px
  display: flex
  align-items: center
  justify-content: center
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)

.countdown-card
  grid-column: 2
  grid-row: 2
  background-color: var(--secondaryBackground)
  border-radius: 25px
  border: 3px solid rgba(0, 0, 0, 0.15)
  padding: 50px
  display: flex
  align-items: center
  justify-content: center
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)

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
