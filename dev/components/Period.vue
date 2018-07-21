<template>
  <div class="period">
    <div class="circle">{{ actualPeriod }}</div>
    <div class="time">{{ start }}</div>
    <div class="time">{{ end }}</div>
  </div>
</template>

<script>
export default {
  props: {
    period: { type: String, required: true },
    start: { type: String, required: true },
    end: { type: String, required: true },
  },
  computed: {
    actualPeriod() {
      const { period } = this;
      return period[0] === '!' ? period.substring(1) : period;
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../styles/style.sass'

.period
  min-width: 70px
  height: 100px
  border-radius: 12px
  background-color: #064789
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  flex-grow: 1
  +shadow
  margin: 5px

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
    padding: 10px
  
  .time
    color: white
</style>
