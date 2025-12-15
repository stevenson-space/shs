<template>
  <div class="period" :class="{ 'not-mobile': !forceMobileLayout, invert, 'tv-space': tvSpace }">
    <svg
      class="progress"
      v-if="
        progress != 0 &&
        !disableProgressBar &&
        (actualPeriod.length == 1 || actualPeriod.length == 2)
      "
      :class="{ invert }"
      width="40"
      height="40"
    >
      <circle
        class="progress-circle"
        cx="20"
        cy="20"
        stroke="var(--accent)"
        stroke-linecap="round"
        :r="normalizedRadius"
        :style="{
          strokeDashoffset: strokeDashoffset,
          strokeDasharray: circumference + ' ' + circumference,
        }"
        fill="var(--secondaryBackground)"
        :stroke-width="stroke"
      />
      <text x="19.5" y="21" alignment-baseline="middle" text-anchor="middle">
        {{ actualPeriod }}
      </text>
    </svg>

    <div
      v-else
      class="circle"
      :class="{ invert }"
      :style="{ fontSize: periodFontSize }"
    >
      {{ actualPeriod }}
    </div>
    <!-- <p>{{ currentSeconds }}</p> -->
    <div class="range">
      <div class="time">{{ convertMilitaryTime(start) }}</div>
      <span class="dash"> – </span>
      <div class="time">{{ convertMilitaryTime(end) }}</div>
    </div>
  <div :style="{ width: spacerWidth }"></div>
  </div>
</template>
<script>
import { mapState } from 'pinia';
import Bell from '@/utils/bell';
import { dateToSeconds, periodToSeconds } from '@/utils/util';
import useClockStore from '@/stores/clock';

export default {
  props: {
    period: { type: String, required: true },
    start: { type: String, required: true },
    end: { type: String, required: true },
    invert: { type: Boolean, default: false },
    forceMobileLayout: { type: Boolean, default: false },
    disableProgressBar: { type: Boolean, default: false },
    tvSpace: { type: Boolean, default: false },
  },
  data() {
    return {
      radius: 22, // radius of the progress bar
      stroke: 3, // stroke of the progress bar
    };
  },
  computed: {
    ...mapState(useClockStore, ['date']),
    normalizedRadius() {
      return this.radius - this.stroke * 2;
    },
    circumference() {
      return this.normalizedRadius * 2 * Math.PI;
    },

    actualPeriod() {
      // remove the ! mark in front of period names
      const { period } = this;
      return period[0] === '!' ? period.substring(1) : period;
    },
    periodFontSize() {
      if (!this.tvSpace) {
        return this.period.length > 10 ? '1em' : '1.3em';
      }
      // TV sizes - smaller for long names, bigger for short
      if (this.period.length > 7) return '0.85em';  // Long names like "Activity"
      if (this.period.length > 4) return '1.1em';   // Medium names
      return '1.3em';                                // Short names like "1", "2"
    },
    startSeconds() {
      return periodToSeconds(this.start);
    },
    endSeconds() {
      return periodToSeconds(this.end);
    },
    progress() {
      const currentSeconds = dateToSeconds(this.date);
      const { startSeconds, endSeconds } = this;
      if (currentSeconds >= startSeconds && currentSeconds <= endSeconds) {
        if (currentSeconds - startSeconds < 1) { // fancy animation when the period starts
          return 0.00001;
        }
        const secondsLeft = endSeconds - currentSeconds;
        const periodLength = endSeconds - startSeconds;
        return secondsLeft / periodLength;
      }
      return 0;
    },
    strokeDashoffset() {
      return this.circumference - this.progress * this.circumference;
    },
    spacerWidth() {
      const isLongPeriod = this.actualPeriod.length > 4;

      if (this.tvSpace) {
        return isLongPeriod ? '10px' : '20px';
      }

      return isLongPeriod ? '20px' : '40px';
    },
  },
  methods: {
    convertMilitaryTime: Bell.convertMilitaryTime,
  },
};
</script>

<style lang='sass' scoped>
@import '@/styles/style.sass'

.period
  +shadow
  min-width: 225px
  height: 37px
  border-radius: 100px
  background-color: var(--accent)
  display: flex
  align-items: center
  justify-content: space-between
  padding: 2px
  margin: 0
  width: auto

  &.tv-space
    min-width: 200px
    height: 34px
    padding: 0px

    &:not(.invert)
      margin-top: 2px
      margin-bottom: 2px

    .range
      font-size: 1.1em
      min-width: 85px

    .circle
      margin: 2.5px
      padding: 5.5px

      &:not(.invert)
        background-color: var(--secondaryBackground)

  .circle
    min-width: 15px
    height: 15px
    line-height: 15px
    border-radius: 15px
    background-color: var(--background)
    text-align: center
    font-weight: bold
    color: var(--primary)
    margin: 5px
    padding: 8px
    overflow: hidden
    white-space: nowrap
    text-overflow: ellipsis
    &.invert
      color: var(--accent)

  &.not-mobile
    +tablet
      width: calc(50% - 14px)
  .progress
    transform: scale(1.17) translateY(-1px)
    background: var(--background)
    border-radius: 100px
    fill: var(--tertiary)
    font-weight: bold
    font-size: 17px
    box-shadow: 0px 0px 6px -4px rgba(0,0,0,1)
    margin: 6px 0px

    &.invert
      font-size: 19px
      box-shadow: none
      transform: scale(1)
      margin-left: 1px

  .progress-circle
    transform-origin: center
    transform: rotate(-90deg)
    stroke-dasharray: 189
    stroke-dashoffset: 0
    transition: stroke-dashoffset 1s
    transition-timing-function: linear

  .range
    color: white
    text-align: center
    flex-grow: 1
    font-size: 1.1em
    min-width: 100px

    .time
      display: inline-block

  &.invert
    box-shadow: none
    background-color: var(--secondaryBackground)
    border: var(--accent) 1px solid

    .progress
      fill: var(--accent)
    .range
      color: var(--primary)

  &.not-mobile
    +desktop
      width: auto
      border-radius: 15px
      padding: 0
      flex-direction: column
      min-width: 70px
      height: 100px
      justify-content: center

      .range
        margin: 0
        flex-grow: 0
        font-size: 1em

        .time
          display: block

        .dash
          display: none

.period:not(.invert)
  .range
    font-weight: bold

</style>
