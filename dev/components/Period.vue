<template>
  <div class="period">
    <div class="circle">{{ actualPeriod }}</div>
    <div class="range">
      <div class="time">{{ convertMilitaryTime(start) }}</div>
      <span class="dash"> – </span>
      <div class="time">{{ convertMilitaryTime(end) }}</div>
    </div>
  </div>
</template>

<script>
import Bell from '../js/bell.js';

export default {
  props: {
    period: { type: String, required: true },
    start: { type: String, required: true },
    end: { type: String, required: true },
  },
  computed: {
    actualPeriod() {
      // remove the ! mark in front of period names
      const { period } = this;
      return period[0] === '!' ? period.substring(1) : period;
    }
  },
  methods: {
    convertMilitaryTime: Bell.convertMilitaryTime,
  }
}
</script>

<style lang="sass" scoped>
@import '../styles/style.sass'

.period
  +shadow
  border-radius: 100px
  background-color: $color
  display: flex
  align-items: center
  flex-grow: 1
  margin: 5px
  justify-content: space-between
  padding: 2px
  +mobile
    width: calc(100% - 14px); // 2 * 5px (margin) + 2 * 2px (padding) = 14px
  +tablet
    width: calc(50% - 14px)
  +desktop
    border-radius: 15px
    padding: 0
    flex-direction: column
    min-width: 70px
    height: 100px
    justify-content: center

  .circle
    min-width: 15px
    height: 15px
    line-height: 15px
    border-radius: 20px
    background-color: white
    text-align: center
    font-size: 1.3em
    font-weight: bold
    color: #333
    margin: 5px 10px
    padding: 8px
    +desktop
      padding: 10px
  
  .range
    color: white
    text-align: center
    flex-grow: 1
    font-size: 1.1em
    +desktop
      margin: 0
      flex-grow: 0
      font-size: 1em

    .time
      display: inline-block
      +desktop
        display: block

    .dash
      +desktop
        display: none

</style>
