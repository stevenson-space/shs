<template>
  <div
    tabindex="-1"
    style="outline: none"
    @keydown.right="nextMonth"
    @keydown.left="previousMonth"
  >
    <calendar-main
      class="calendar-main"
      v-bind="childProps"
      @filter-selected="filter = $event"
      @next-month="nextMonth"
      @previous-month="previousMonth"
      @event-click="displayedEvent = $event"
    />

    <calendar-mobile
      class="calendar-mobile"
      v-bind="childProps"
      @filter-selected="filter = $event"
      @next-month="nextMonth"
      @previous-month="previousMonth"
      @event-click="displayedEvent = $event"
    />
    <event-popup :event="displayedEvent" :show="!!displayedEvent.name" @close="displayedEvent = {}" />
  </div>
</template>

<script>
import { mapState } from 'pinia';
import allEvents from '@/data/events.json';
import useClockStore from '@/stores/clock';
import Bell from '@/utils/bell';
import CalendarMain from './CalendarMain.vue';
import CalendarMobile from './CalendarMobile.vue';
import EventPopup from './EventPopup.vue';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'];

export default {
  components: {
    CalendarMain,
    CalendarMobile,
    EventPopup,
  },
  data() {
    return {
      today: new Date(),
      month: 0,
      year: 0,
      displayedEvent: {},
      filter: 'All',
    };
  },
  computed: {
    ...mapState(useClockStore, ['date']),
    childProps() {
      const {
        today, month, year, dates, schedules, categories, filteredEvents,
      } = this;

      // combine the date, schedule, and events into one object for each date
      // to make it easier for the child components to use
      const combined = dates.map((date, i) => (date ? {
        isToday: date === today.toLocaleDateString(),
        date: new Date(date).getDate(),
        dateString: date,
        schedule: schedules[i],
        events: filteredEvents[i],
      } : i));

      return {
        month: months[month],
        year,
        dates: combined,
        filterCategories: categories,
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
      return this.dates.map((date) => {
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
            // schedules[i].eventAliases contains equivalent names for the schedule type (e.g. "Non-Attendance Day" for "No School")
            const scheduleIndicatingWords = [schedules[i].name].concat(schedules[i].eventAliases || []);

            // Sort it so that the longest strings come first in case the strings overlap
            // for example, in ['PM Assembly', 'PM Assembly Schedule'] we would want 'PM Assembly Schedule' to be replaced in event.name
            scheduleIndicatingWords.sort((a, b) => b.length - a.length);

            // Remove any events that are exact duplicates of the schedule type or equivalent
            events = events.filter((event) => !scheduleIndicatingWords.includes(event.name.trim()));

            // If any of the removed events contain extra information in addition to the schedule type
            // then remove the schedule type, leaving just the extra information
            for (let j = events.length - 1; j >= 0; j--) {
              const event = events[j];
              for (const words of scheduleIndicatingWords) {
                if (event.name.indexOf(words) > -1) {
                  // Inefficiently, but cleanly remove schedule type
                  event.name = event.name.split(words).join('');

                  // Trim any non word characters on the sides (spaces, hyphens, ...)
                  event.name = event.name.replace(/^[\W]+|[\W]+$/g, '');

                  // Check to make sure none of the other events contain the same information as the extra info in this event
                  const eventNames = events.map((e) => e.name);
                  eventNames.splice(j, 1); // remove this event from the list of event names

                  let isInfoAlreadyPresent = false;
                  eventNames.forEach((name) => {
                    if (name.indexOf(event.name) > -1) isInfoAlreadyPresent = true;
                  });

                  // If the same information as what's left in this event is present in another event, remove this event
                  if (isInfoAlreadyPresent) {
                    events.splice(j, 1);
                  }
                }
              }
            }

            // After the trimming and removal of the schedule type, if all that is left is a word/phrase
            // that does not add any useful information, remove it
            const boringWords = ['schedule'];
            boringWords.forEach((word) => {
              events = events.filter((event) => !event.name.match(new RegExp(`^${word}$`, 'i')));
            });
          }

          return events;
        }
        return [];
      });
    },
    categories() {
      const categories = new Set(['All']); // using Set to prevent duplicates
      const combinedEvents = this.events.reduce((combined, dayEvents) => combined.concat(dayEvents), []);
      combinedEvents.forEach((event) => {
        if (event.categories != null) {
          event.categories.forEach((category) => {
            categories.add(category);
          });
        }
      });
      return Array.from(categories);
    },
    filteredEvents() {
      if (this.filter === 'All') {
        return this.events;
      }

      return this.events.map(
        (dayEvents) => dayEvents.filter(
          (event) => event.categories != null && event.categories.includes(this.filter),
        ),
      );
    },
  },
  created() {
    this.today = this.date;
    this.month = this.today.getMonth();
    this.year = this.today.getFullYear();
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
    },
  },
};
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.calendar-main
  +mobile
    display: none

.calendar-mobile
  +tablet
    display: none
  +desktop
    display: none

</style>
