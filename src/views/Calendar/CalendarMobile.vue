<template>
  <div>
    <div class="calendar">
      <calendar-navigation
        class="calendar-navigation"
        :month="month"
        :year="year"
        :filter-categories="filterCategories"
        @filter-selected="$emit('filter-selected', $event)"
        @previous-month="$emit('previous-month')"
        @next-month="$emit('next-month')"
      />

      <div class="daysOfWeek">
        <div v-for="day in daysOfWeek" :key="day" class="day">{{ day }}</div>
      </div>

      <div class="dates">
        <template v-for="(date, i) in dates">
          <div
            v-if="typeof date === 'object'"
            :key="date.dateString"
            class="date"
            :class="{ inverted: date.isToday, border: !!date.schedule, selected: i === selected }"
            @mousedown="selected = i"
          >
            <span>{{ date.date }}</span>
            <div class="dot" :class="{ show: date.events.length > 0}" />
          </div>

          <!-- when date is not an object, there should be a blank space (the value of date is an integer index) -->
          <div v-else :key="date" />
        </template>
      </div>
    </div>

    <calendar-date
      v-for="date in selectedDates.filter(date => typeof date === 'object')"
      :key="date.dateString"
      class="calendar-cell"
      v-bind="date"
      @event-click="$emit('event-click', $event)"
    />
  </div>
</template>

<script>
import CalendarNavigation from './CalendarNavigation.vue';
import CalendarDate from './CalendarDate.vue';

export default {
  components: { CalendarNavigation, CalendarDate },
  props: {
    month: { type: String, required: true },
    year: { type: Number, required: true },
    dates: { type: Array, required: true },
    filterCategories: { type: Array, default: () => [] },
  },
  data() {
    return {
      daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      selected: 26,
    };
  },
  computed: {
    selectedDates() {
      return this.dates.slice(this.selected);
    },
  },
  watch: {
    month() {
      this.selected = 0;
    },
    year() {
      this.selected = 0;
    },
  },
  created() {
    // Initialize selected date to today
    this.dates.forEach((date, i) => {
      if (typeof date === 'object' && date.isToday) {
        this.selected = i;
      }
    });
  },
};
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.calendar
  padding-bottom: 5px
  +shadow

  .daysOfWeek
    font-size: .9em
    display: flex
    justify-content: space-around
    color: var(--tertiary)
    .day
      width: calc(100% / 7)
      text-align: center

  .dates
    display: grid
    grid-template-columns: repeat(7, 1fr)

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
        color: var(--background)
        .dot
          background-color: var(--background)

      .dot
        background-color: var(--color)
        height: 5px
        width: 5px
        border-radius: 5px
        display: none
        margin-top: 3px
        &.show
          display: block

.calendar-cell
  margin-top: 10px
  font-size: 1.2em

</style>
