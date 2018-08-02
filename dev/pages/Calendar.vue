<template>
  <div
    class="calendar"
    :style="{ '--num-rows': numCalendarRows }"
    @keydown.right="nextMonth"
    @keydown.left="previousMonth"
    tabindex="-1">
    <div class="navigation">
      <font-awesome-icon class="icon" :icon="icons.faChevronLeft" @click="previousMonth"/>
      <div class="text">
        <div class="month">{{ months[month] }}</div>
        <div class="year">{{ year }}</div>
      </div>
      <font-awesome-icon class="icon" :icon="icons.faChevronRight" @click="nextMonth"/>
    </div>

    <div class="dayOfWeek calendar-cell" v-for="dayOfWeek in daysOfWeek">
      {{ dayOfWeek }}
    </div>

    <calendar-date
      class="calendar-cell"
      v-for="date in dates"
      v-if="date"
      :date="date"
      :events="events[date]"
      :isToday="date === today"
      :key="date"/>
    <div class="calendar-cell" v-else/>
  </div>
</template>

<script>
import CalendarDate from '../components/CalendarDate.vue';
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import events from '../data/events.json';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'];

const today = new Date();

export default {
  data() {
    return {
      events,
      daysOfWeek,
      months,
      today: today.toLocaleDateString(),
      month: today.getMonth(),
      year: today.getFullYear(),
      icons: {
        faChevronLeft,
        faChevronRight,
      },
    }
  },
  computed: {
    firstDayInMonth() {
      const { month, year } = this;
      return new Date(year, month, 1);
    },
    numDaysInMonth() {
      const { month, year } = this;

      // day 0 gets the last day of the previous month
      return (new Date(year, month + 1, 0)).getDate();
    },
    dates() {
      const { month, year, firstDayInMonth, numDaysInMonth } = this;

      // offset the dates by to ensure they match with the days of week
      const start = firstDayInMonth.getDay();

      // number of calendar cells must be a multiple of 7 (could be 5 or 6 rows depending on start)
      const length = Math.ceil((numDaysInMonth + start) / 7) * 7;
      const dates = new Array(length).fill(null);

      // set each cell to the appropriate date
      for (let i = 0; i < numDaysInMonth; i++) {
        dates[start + i] = `${month + 1}/${i + 1}/${year}`;
      }

      return dates;
    },
    numCalendarRows() {
      return this.dates.length / 7; // length of each row is 7 (days of week)
    }
  },
  methods: {
    nextMonth() {
      this.month++;
      if (this.month >= 12) {
        this.year += Math.floor(this.month / 12);
        this.month %= 12;
      }
    },
    previousMonth() {
      this.month--;
      while (this.month < 0) {
        this.year -= 1;
        this.month += 12;
      }
    }
  },
  components: { CalendarDate, FontAwesomeIcon },
}
</script>

<style lang="sass" scoped>
@import '../styles/style.sass';

.calendar
  --num-rows: 5 // changed through JavaScript to 5 or 6 depending on the month
  height: 100vh
  // height: 98vh
  display: grid
  grid-template-columns: repeat(7, 1fr)
  grid-template-rows: 50px 30px repeat(var(--num-rows), 1fr)
  // grid-gap: 5px
  // margin: 1vh
  outline: none

  .calendar-cell
    border-top: 1px solid #BBB
    border-left: 1px solid #BBB

  .navigation
    grid-column: span 7
    display: flex
    align-items: center
    justify-content: space-between
    // justify-content: space-around
    // border-bottom: $border
    // +shadow
    // background-color: $color
    // color: white
    // border-radius: 0 0 35px 35px

    .icon
      cursor: pointer
      width: 50px
      font-size: 1.5em
      // background-color: $color
      // height: 100%
      color: $color

    .text
      text-align: center
      // flex-grow: 1
      color: #333
      // color: white
      color: $color
      background-color: white
      // background-color: $color
      // border-radius: 0 0 100px 100px
      // border-radius: 100px 100px 0 0
      border-radius: 25px
      font-weight: bold
      padding: 5px 15px
      min-width: 30%
      // +shadow
      // height: 100%
      user-select: none

      .month
        font-size: 1.2em
        letter-spacing: 2px
        
      .year
        font-size: .7em
        // font-weight: bold
      

  .dayOfWeek
    font-size: .9em
    text-align: center
    // border-left: $border
    line-height: 30px
    // +shadow
    // border-radius: 10px
    user-select: none

  // .tile
    // background-color: blue
    // height: 100%
    // border: .5px solid gray
    // border-top: $border
    // border-left: $border
    // +shadow
    // border-radius: 10px

    // .day
    //   margin: 5px

</style>
