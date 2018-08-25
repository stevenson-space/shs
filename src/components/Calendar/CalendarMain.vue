<template>
  <div class="calendar" :style="{ '--num-rows': numCalendarRows }">
    <calendar-navigation
      class="calendar-navigation"
      :month="month"
      :year="year"
      @previous-month="$emit('previous-month')"
      @next-month="$emit('next-month')"/>

    <div class="dayOfWeek calendar-cell" v-for="dayOfWeek in daysOfWeek">
      {{ dayOfWeek }}
    </div>

    <calendar-date
      class="calendar-cell"
      v-for="date in dates"
      v-if="date"
      v-bind="date"
      :key="date.date"/>
    <div class="calendar-cell" v-else/>
  </div>
</template>

<script>
import CalendarDate from './CalendarDate.vue';
import CalendarNavigation from './CalendarNavigation.vue'

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default {
  props: {
    month: { type: String, required: true },
    year: { type: Number, required: true },
    dates: { type: Array, required: true },
  },
  data() {
    return {
      daysOfWeek,
      
    }
  },
  computed: {
    numCalendarRows() {
      return this.dates.length / 7; // length of each row is 7 (days of week)
    }
  },
  components: { CalendarDate, CalendarNavigation },
}
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.calendar
  --num-rows: 5 // changed through JavaScript to 5 or 6 depending on the month
  height: 100vh
  // height: 98vh
  display: grid
  grid-template-columns: repeat(7, 1fr)
  grid-template-rows: 50px 30px repeat(var(--num-rows), 1fr)
  // grid-gap: 5px
  // margin: 1vh

  .calendar-navigation
    grid-column: span 7

  .calendar-cell
    border-top: 1px solid #BBB
    border-left: 1px solid #BBB

  .dayOfWeek
    font-size: .9em
    text-align: center
    // border-left: $border
    line-height: 30px
    // +shadow
    // border-radius: 10px
    user-select: none

</style>
