<template>
  <div class="period" :class="{ 'not-mobile': !forceMobileLayout, invert }">
   <svg class="progress" v-if="(progress != 0) && !disableProgressBar && (actualPeriod.length  == 1 || actualPeriod.length  == 2) " :class="{invert}" width="40" height="40">
      <circle
        class="progress-circle"
        cx="20"
        cy="20"
        stroke="var(--color)"
        stroke-linecap="round"
        :r="normalizedRadius"
        :style="{
          strokeDashoffset: strokeDashoffset,
          strokeDasharray: circumference + ' ' + circumference
        }"
        fill="white"
        :stroke-width="stroke"
      />
      <text x="19.5" y="21" alignment-baseline="middle" text-anchor="middle">
        {{ actualPeriod }}
      </text>
    </svg>
        <div v-else class="circle" :class="{invert}" :style="{ fontSize: periodFontSize }">
      {{ actualPeriod }}
    </div>
    <div class="range">
      <div class="time">{{ convertMilitaryTime(start) }}</div>
      <span class="dash"> – </span>
      <div class="time">{{ convertMilitaryTime(end) }}</div>
    </div>
    <div class="spacer"></div>
  </div>
</template>
<script>
import Bell from "@/utils/bell";
import { mapGetters } from 'vuex';

export default {
  props: {
    period: { type: String, required: true },
    start: { type: String, required: true },
    end: { type: String, required: true },
    invert: { type: Boolean, default: false },
    forceMobileLayout: { type: Boolean, default: false },
    disableProgressBar: { type: Boolean, default: false },
  },
  data() {
    return {
      radius: 22,
      stroke: 3,
      normalizedRadius: 0, // don't touch
      circumference: 0, // don't touch
      currentTime: 0,
      date: new Date()
    };
  },
  computed: {
      ...mapGetters([
      'bell',
    ]),
    actualPeriod() {
      // remove the ! mark in front of period names
      const { period } = this;
      return period[0] === "!" ? period.substring(1) : period;
    },
    periodFontSize() {
      return this.period.length > 10 ? "1em" : "1.3em";
    },
progress() {
      const start = this.start;
      const end = this.end;
      const startHours = this.start.substring(0, start.indexOf(":"));
      const startMin = this.start.substring(start.indexOf(":") + 1);
      const endHours = this.end.substring(0, end.indexOf(":"));
      const endMin = this.end.substring(end.indexOf(":") + 1);
      const currentdate = this.date;
      const startTime = Date.parse(
        `${currentdate.getMonth() +
          1}/${currentdate.getDate()}/${currentdate.getFullYear()} ${startHours}:${startMin}:00`
      );
      const endTime = Date.parse(
        `${currentdate.getMonth() +
          1}/${currentdate.getDate()}/${currentdate.getFullYear()} ${endHours}:${endMin}:00`
      );
      const todayMillis = currentdate.getTime();
      if (todayMillis >= startTime && todayMillis <= endTime) {
        const periodLength = endTime - startTime;
        const elapsedTime = endTime - todayMillis;
        return (elapsedTime / periodLength);
      }else{
       return 0
      }
    },
    strokeDashoffset() {
      return this.circumference - (this.progress ) * this.circumference;
    }
  },
  methods: {
    convertMilitaryTime: Bell.convertMilitaryTime
  },
  created() {
    this.normalizedRadius = this.radius - this.stroke * 2;
    this.circumference = this.normalizedRadius * 2 * Math.PI;
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.date = new Date();
    }, 1000);
  }
};
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.period
  +shadow
  height: 37px
  border-radius: 100px
  background-color: var(--color)
  display: flex
  align-items: center
  justify-content: space-between
  flex-grow: 1
  margin: 7px
  padding: 2px
  width: calc(100% - 14px) 

  .circle
    min-width: 15px
    height: 15px
    line-height: 15px
    border-radius: 15px
    background-color: white
    text-align: center
    font-weight: bold
    color: #333
    margin: 5px
    padding: 8px
    overflow: hidden
    white-space: nowrap
    text-overflow: ellipsis
    &.invert
      color: var(--color)

  &.not-mobile
    +tablet
      width: calc(50% - 14px)
  .progress
    transform: scale(1.17) translateY(-1px)
    background: white
    border-radius: 100px
    fill: #333
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
    stroke-dashoffset: 189
    transition: stroke-dashoffset 1s ease-in-out
  .spacer
    width: 40px
    height: 2px
    
  .range
    color: white
    text-align: center
    flex-grow: 1
    font-size: 1.1em
    font-weight: bold
    min-width: 100px
   
    .time
      display: inline-block

  &.invert
    box-shadow: none
    background-color: white
    border: var(--color) 1px solid
    
    .progress
      fill: var(--color)
    .range
      color: black
      font-weight: normal

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
</style>
