<template>
  <div class="calendar" :style="{ '--num-rows': numCalendarRows }">
    <calendar-navigation
      class="calendar-navigation"
      :month="month"
      :year="year"
      :filter-categories="filterCategories"
      @filter-selected="$emit('filter-selected', $event)"
      @previous-month="$emit('previous-month')"
      @next-month="$emit('next-month')"
    />

    <div v-for="dayOfWeek in daysOfWeek" :key="dayOfWeek" class="dayOfWeek calendar-cell">
      {{ dayOfWeek }}
    </div>

    <template v-for="date in dates">
      <calendar-date
        v-if="typeof date === 'object'"
        :key="date.dateString"
        class="calendar-cell with-data"
        v-bind="date"
        @event-click="$emit('event-click', $event)"
      />

      <!-- when date is not an object, there should be a blank calendar cell (the value of date is an integer index) -->
      <div v-else :key="date" class="calendar-cell" />
    </template>
  </div>
</template>

<script>
import CalendarDate from './CalendarDate.vue';
import CalendarNavigation from './CalendarNavigation.vue';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default {
  components: { CalendarDate, CalendarNavigation },
  props: {
    month: { type: String, required: true },
    year: { type: Number, required: true },
    dates: { type: Array, required: true },
    filterCategories: { type: Array, default: () => [] },
  },
  data() {
    return {
      daysOfWeek,

    };
  },
  computed: {
    numCalendarRows() {
      return this.dates.length / 7; // length of each row is 7 (days of week)
    },
  },
};
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.calendar
  --num-rows: 5 // changed through JavaScript to 5 or 6 depending on the month
  min-height: 100vh
  display: grid
  grid-template-columns: repeat(7, 1fr)
  grid-template-rows: 50px 30px repeat(var(--num-rows), auto)

  .calendar-navigation
    grid-column: span 7

  .calendar-cell
    border-top: 1px solid #BBB
    border-left: 1px solid #BBB
    min-height: 100px

  .dayOfWeek
    font-size: .9em
    text-align: center
    line-height: 30px
    user-select: none

</style>
