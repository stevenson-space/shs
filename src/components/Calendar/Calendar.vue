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
      @filter-selected="filter = $event"
      @next-month="nextMonth"
      @previous-month="previousMonth"
      @event-click="displayedEvent = $event"/>

    <calendar-mobile
      class="calendar-mobile"
      v-bind="childProps"
      @filter-selected="filter = $event"
      @next-month="nextMonth"
      @previous-month="previousMonth"
      @event-click="displayedEvent = $event"/>

    <popup :show="!!displayedEvent.name" @close="displayedEvent = {}">
      <div class="event-details">
        <div class="date">{{ formatDate(displayedEvent.start) }}</div>

        <div class="title">{{ displayedEvent.name }}</div>

        <div class="time">
          <font-awesome-icon class="icon" :icon="icons.faClock" fixed-width/>&nbsp;

          <span v-if="displayedEvent.allDay">All Day</span>

          <span v-else-if="displayedEvent.start && displayedEvent.end">
            {{ formatTime(displayedEvent.start) }}&nbsp; – &nbsp;{{ formatTime(displayedEvent.end) }}
          </span>

          <span v-else>{{ formatTime(displayedEvent.start) }}</span>
        </div>

        <div class="location" v-show="displayedEvent.location">
          <font-awesome-icon class="icon" :icon="icons.faMapMarkerAlt" fixed-width/>
          &nbsp;{{ displayedEvent.location }}
        </div>

        <div class="description">{{ displayedEvent.description }}</div>
      </div>
    </popup>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';

import Bell from 'src/js/bell.js';
import allEvents from 'src/data/events.json';
import CalendarMain from './CalendarMain.vue';
import CalendarMobile from './CalendarMobile.vue';
import Popup from 'common/Popup.vue';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'];

export default {
  data() {
    return {
      icons: {
        faMapMarkerAlt,
        faClock,
      },
      today: new Date(),
      month: 0,
      year: 0,
      displayedEvent: {},
      filter: 'All',
    }
  },
  created() {
    this.today = this.$store.getters.date;
    this.month = this.today.getMonth();
    this.year = this.today.getFullYear();
  },
  computed: {
    childProps() {
      const { today, month, year, dates, schedules, categories, filteredEvents } = this;

      // combine the date, schedule, and events into one object for each date
      // to make it easier for the child components to use
      const combined = dates.map((date, i) => date ? {
        isToday: date === today.toLocaleDateString(),
        date: new Date(date).getDate(),
        schedule: schedules[i],
        events: filteredEvents[i],
      } : null);

      return {
        month: months[month],
        year,
        dates: combined,
        filterCategories: categories
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

            // schedules[i].eventAliases contains equivalent names for the schedule type (e.g. "Non-Attendance Day" for "No School")
            const scheduleIndicatingWords = [schedules[i].name].concat(schedules[i].eventAliases || []);

            // Sort it so that the longest strings come first in case the strings overlap
            // for example, in ['PM Assembly', 'PM Assembly Schedule'] we would want 'PM Assembly Schedule' to be replaced in event.name
            scheduleIndicatingWords.sort((a, b) => b.length - a.length);

            // Remove any events that are exact duplicates of the schedule type or equivalent
            events = events.filter(event => !scheduleIndicatingWords.includes(event.name.trim()));

            // If any of the removed events contain extra information in addition to the schedule type
            // then remove the schedule type, leaving just the extra information
            for (let i = events.length - 1; i >= 0; i--) {
              const event = events[i];
              scheduleIndicatingWords.forEach(words => {
                if (event.name.indexOf(words) > -1) {
                  // Inefficiently, but cleanly remove schedule type
                  event.name = event.name.split(words).join('');

                  // Trim any non word characters on the sides (spaces, hyphens, ...)
                  event.name = event.name.replace(/^[\W]+|[\W]+$/g, '');

                  // Check to make sure none of the other events contain the same information as the extra info in this event
                  const eventNames = events.map(event => event.name);
                  eventNames.splice(i, 1); // remove this event from the list of event names

                  let isInfoAlreadyPresent = false;
                  eventNames.forEach(name => {
                    if (name.indexOf(event.name) > -1) isInfoAlreadyPresent = true;
                  });

                  // If the same information as what's left in this event is present in another event, remove this event
                  if (isInfoAlreadyPresent) {
                    events.splice(i, 1);
                  }
                }
              });
            }

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
    },
    categories() {
      const categories = new Set(['All']); // using Set to prevent duplicates
      const allEvents = this.events.reduce((allEvents, dayEvents) => allEvents.concat(dayEvents), []);
      allEvents.forEach(event => {
          if (event.categories) {
            event.categories.forEach(category => {
              categories.add(category);
            });
          }
      });
      return Array.from(categories);
    },
    filteredEvents() {
      if (this.filter == 'All') {
        return this.events;
      }

      return this.events.map(dayEvents => {
        return dayEvents.filter(event => event.categories && event.categories.includes(this.filter));
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
    },
    formatTime(ms) {
      return (new Date(ms)).toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit' });
    },
    formatDate(ms) {
      return (new Date(ms)).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'});
    }
  },
  components: {
    CalendarMain,
    CalendarMobile,
    Popup,
    FontAwesomeIcon,
  },
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

.event-details
  max-width: 500px
  padding: 20px 30px
  box-sizing: border-box
  user-select: text
  width: calc(100vw - 40px)
  max-height: calc(100vh - 100px)
  overflow: auto
  -webkit-overflow-scrolling: touch;

  .date
    // text-align: right
    font-size: .9em
    font-weight: bold
    color: var(--color)

  .title
    font-size: 1.4em
    // text-align: center
    font-weight: bold
    color: #333
    margin-top: 3px

  .time
    // text-align: center
    font-size: 1.05em
    // font-weight: bold
    margin-top: 15px

  .location
    // text-align: center
    margin-top: 20px

  .icon
    color: var(--color)
    font-size: 1.25em

  .description
    margin-top: 15px
    font-size: .9em
    // max-height: 250px
    // overflow: auto
    // -webkit-overflow-scrolling: touch;


</style>
