<template>
  <div>
    <div class="calendar">
      <calendar-navigation
        class="calendar-navigation"
        :month="month"
        :year="year"
        @previous-month="$emit('previous-month')"
        @next-month="$emit('next-month')"/>

      <div class="daysOfWeek">
        <div class="day" v-for="day in daysOfWeek" :key="day">{{ day }}</div>
      </div>

      <div class="dates">
        <div
          v-for="(date, i) in dates"
          v-if="date"
          class="date"
          :class="{ inverted: date.isToday, border: !!date.schedule, selected: i === selected }"
          @mousedown="selected = i"
          :key="date.date">
          <span>{{ date.date }}</span>
          <div class="dot" :class="{ show: date.events.length > 0}"/>
        </div>

        <div v-else/>
      </div>
    </div>

    <calendar-date
      class="calendar-date"
      v-for="date in selectedDates"
      v-if="date"
      v-bind="date"
      :key="date.date"/>
  </div>
</template>

<script>
import events from 'src/data/events.json';
import CalendarNavigation from './CalendarNavigation.vue';
import CalendarDate from './CalendarDate.vue';

export default {
  props: {
    month: { type: String, required: true },
    year: { type: Number, required: true },
    dates: { type: Array, required: true },
  },
  data() {
    return {
      daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      selected: 26,
    }
  },
  computed: {
    selectedDates() {
      return this.dates.slice(this.selected);
    }
  },
  created() {
    // Initialize selected date to today
    this.dates.forEach((date, i) => {
      if (date && date.isToday) {
        this.selected = i;
      }
    });
  },
  watch: {
    month() {
      this.selected = 0;
    },
    year() {
      this.selected = 0;
    }
  },
  components: { CalendarNavigation, CalendarDate },
}
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.calendar
  // height: 50%
  padding-bottom: 5px
  +shadow

  .daysOfWeek
    font-size: .9em
    display: flex
    justify-content: space-around
    color: #555

    .day
      width: calc(100% / 7)
      text-align: center

  .dates
    display: grid
    grid-template-columns: repeat(7, 1fr)
    // height: 100%

    .date
      display: flex
      justify-content: center
      align-items: center
      flex-direction: column
      border-radius: 100px
      height: 37px
      width: 37px
      margin: 4px auto
      cursor: pointer
      font-weight: bold

      &:hover
        background-color: #DDD

      &.selected
        background-color: #CCC
      
      &.border
        border: var(--color) 1px dashed
      
      &.inverted
        background-color: var(--color)
        color: white
        .dot
          background-color: white

      .dot
        background-color: var(--color)
        height: 5px
        width: 5px
        border-radius: 5px
        display: none
        margin-top: 3px

        &.show
          display: block

.calendar-date
  margin-top: 10px
  font-size: 1.2em

</style>
