<template>
  <div
    @keydown.right="nextMonth"
    @keydown.left="previousMonth"
    v-hammer:swipe.horizontal="onSwipe"
    tabindex="-1"
    style="outline: none"
    v-focus>
    <calendar-main
      class="calendar-main"
      v-bind="childProps"
      @next-month="nextMonth"
      @previous-month="previousMonth"/>

    <calendar-mobile
      class="calendar-mobile"
      v-bind="childProps"
      @next-month="nextMonth"
      @previous-month="previousMonth"/>
  </div>
</template>

<script>
import Bell from 'src/js/bell.js';
import allEvents from 'src/data/events.json';
import CalendarMain from './CalendarMain.vue';
import CalendarMobile from './CalendarMobile.vue';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'];

export default {
  data() {
    return {
      today: new Date(),
      month: 0,
      year: 0,
    }
  },
  created() {
    this.today = this.$store.getters.date;
    this.month = this.today.getMonth();
    this.year = this.today.getFullYear();
  },
  computed: {
    childProps() {
      const { today, month, year, dates, schedules, events } = this;

      // combine the date, schedule, and events into one object for each date
      // to make it easier for the child components to use
      const combined = dates.map((date, i) => date ? {
        isToday: date === today.toLocaleDateString(),
        date: new Date(date).getDate(),
        schedule: schedules[i],
        events: events[i],
      } : null);

      return {
        month: months[month],
        year,
        dates: combined,
      };
    },
    dates() {
      const { month, year } = this;
      const firstDayInMonth = new Date(year, month, 1);

      // day 0 gets the last day of the previous month
      const numDaysInMonth = (new Date(year, month + 1, 0)).getDate();

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
    schedules() {
      // Get the schedule for each date currently displayed on the calendar
      return this.dates.map(date => {
        if (date) {
          const schedule = Bell.getScheduleType(new Date(date));

          // We only care about the schedule if it is special ("Late Arrival", "No School", etc.)
          return (schedule && schedule.isSpecial) ? schedule : undefined;
        }
        return undefined;
      });
    },
    events() {
      // Get the events for each date currently displayed on the calendar
      const { dates, schedules } = this;
      return dates.map((date, i) => {
        if (date) {
          let events = allEvents[date] || [];

          // If there is a special schedule, we need to remove or modify any events that contain the same information
          if (schedules[i]) {

            // Remove any events that are exact duplicates of the schedule type
            events = events.filter(event => event.name.trim() !== schedules[i].name);

            // If any of the removed events contain extra information in addition to the schedule type
            // then remove the schedule type, leaving just the extra information
            events.forEach(event => {
              if (event.name.indexOf(schedules[i].name) > -1) {
                // Inefficiently, but cleanly remove schedule type
                event.name = event.name.split(schedules[i].name).join('');

                // Trim any non word characters on the sides (spaces, hyphens, ...)
                event.name = event.name.replace(/^[\W]+|[\W]+$/g, '');
              }
            });

            // After the trimming and removal of the schedule type, if all that is left is a word/phrase
            // that does not add any useful information, remove it
            const boringWords = ['schedule'];
            boringWords.forEach(word => {
              events = events.filter(event => !event.name.match(new RegExp(`^${word}$`, 'i')));
            });
          }

          return events;
        }
        return [];
      });
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
    },
    onSwipe(e) {
      this[e.deltaX < 0 ? 'nextMonth' : 'previousMonth']();
    }
  },
  components: { CalendarMain, CalendarMobile },
}
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.calendar-main
  +mobile
    display: none

.calendar-mobile
  +tablet
    display: none
  +desktop
    display: none

</style>
