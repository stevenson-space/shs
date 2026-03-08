<template>
  <div class="period" :class="{ 'not-mobile': !props.forceMobileLayout, invert: props.invert, 'tv-space': props.tvSpace }">
    <svg
      class="progress"
      v-if="
        progress != 0 &&
        !props.disableProgressBar &&
        (actualPeriod.length == 1 || actualPeriod.length == 2)
      "
      :class="{ invert: props.invert }"
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
    <text
      x="20"
      y="20"
      text-anchor="middle"
      dominant-baseline="middle"
    >
      {{ actualPeriod }}
    </text>
    </svg>

    <div
      v-else
      class="circle"
      :class="{ invert: props.invert }"
      :style="{ fontSize: periodFontSize }"
    >
      {{ actualPeriod }}
    </div>
    <!-- <p>{{ currentSeconds }}</p> -->
    <div class="range">
      <div class="time">{{ convertMilitaryTime(props.start) }}</div>
      <span class="dash"> – </span>
      <div class="time">{{ convertMilitaryTime(props.end) }}</div>
    </div>
  <div :style="{ width: spacerWidth }"></div>
  </div>
</template>
<script setup lang="ts">
import { computed, withDefaults } from 'vue';
import Bell from '@/utils/bell';
import { dateToSeconds, periodToSeconds } from '@/utils/util';
import useClockStore from '@/stores/clock';

const props = withDefaults(defineProps<{
  period: string
  start: string
  end: string
  invert?: boolean
  forceMobileLayout?: boolean
  disableProgressBar?: boolean
  tvSpace?: boolean
}>(), {
  invert: false,
  forceMobileLayout: false,
  disableProgressBar: false,
  tvSpace: false,
});

const clockStore = useClockStore();

const radius = 22; // radius of the progress bar
const stroke = 3;  // stroke of the progress bar

const normalizedRadius = computed(() => radius - stroke * 2);
const circumference = computed(() => normalizedRadius.value * 2 * Math.PI);

const actualPeriod = computed(() => {
  // remove the ! mark in front of period names
  return props.period[0] === '!' ? props.period.substring(1) : props.period;
});

const periodFontSize = computed(() => {
  if (!props.tvSpace) {
    return props.period.length > 10 ? '1em' : '1.3em';
  }
  // TV sizes - smaller for long names, bigger for short
  if (props.period.length > 7) return '0.85em';  // Long names like "Activity"
  if (props.period.length > 4) return '1.1em';   // Medium names
  return '1.3em';                                  // Short names like "1", "2"
});

const startSeconds = computed(() => periodToSeconds(props.start));
const endSeconds = computed(() => periodToSeconds(props.end));

const progress = computed(() => {
  const currentSeconds = dateToSeconds(clockStore.date);
  if (currentSeconds >= startSeconds.value && currentSeconds <= endSeconds.value) {
    if (currentSeconds - startSeconds.value < 1) { // fancy animation when the period starts
      return 0.00001;
    }
    const secondsLeft = endSeconds.value - currentSeconds;
    const periodLength = endSeconds.value - startSeconds.value;
    return secondsLeft / periodLength;
  }
  return 0;
});

const strokeDashoffset = computed(() => circumference.value - progress.value * circumference.value);

const spacerWidth = computed(() => {
  const isLongPeriod = actualPeriod.value.length > 4;
  return props.tvSpace
    ? (isLongPeriod ? '10px' : '20px')
    : (isLongPeriod ? '20px' : '40px');
});

const convertMilitaryTime = Bell.convertMilitaryTime;
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
