<template>
  <card class="card">
    <div class="title">Upcoming Events</div>
    <div class="events">
      <div class="line"/>
      <event-chip
        class="event-chip"
        v-for="(event, i) in displayedEvents"
        v-bind="event"
        :direction="(i % 2 === 0) ? 'left' : 'right'"
        :key="event.key"/>
    </div>
    <div>
      <font-awesome-icon
        class="down-arrow"
        :icon="downArrow"
        @mousedown="showMoreEvents()"/>
    </div>
  </card>
</template>

<script>
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import Bell from '../js/bell.js';
import Card from './Card.vue';
import EventChip from './EventChip.vue';

function getNextEvent(startDate) {
  function* dates(start) {
    for(let i = 1; true; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      yield date;
    }
  }
  
  let event = null;
  for (const date of dates(startDate)) {
    const schedule = Bell.isSpecialSchedule(date);
    if (schedule) {
      event = {
        key: `${schedule.name} ${date.getTime()}`,
        date,
        name: schedule.name
      };
      break;
    }

    // give up searching after 2 years
    if (date.getYear() - startDate.getYear() >= 2) {
      break;
    }
  }

  return event;
}

export default {
  props: {
    date: { type: Date, required: true },
  },
  data() {
    return {
      cardHeight: 0,
      downArrow: faChevronDown,
      events: [],
      numEventsInitial: 4,
      numEventsToAdd: 3,
      numEventsDisplayed: 0,
      lastDate: this.date, // the date until which events are currently being displayed
      dateTimeout: null,
    }
  },
  mounted() {
    this.reset();
  },
  computed: {
    displayedEvents() {
      const placeholders = Array(4).fill(0).map((_, i) => ({ key: i }));
      const events = this.events.slice(0, this.numEventsDisplayed);
      return events.length ? events : placeholders;
    },
    remainingEvents() {
      return this.events.length - this.numEventsDisplayed;
    }
  },
  methods: {
    loadEvents(num, timeout = 0) {
      return new Promise(resolve => {
        setTimeout(() => {
          for (let i = 0; i < num; i++) {
            const event = getNextEvent(this.lastDate);
            if (event) {
              this.lastDate = event.date;
              this.events.push(event);
            }
          }
          resolve();
        }, timeout);
      });
    },
    showMoreEvents(num = this.numEventsToAdd) {
      if (this.remainingEvents < num) {
        this.loadEvents(num - this.remainingEvents);
      }
      this.numEventsDisplayed += num;
    },
    reset() {
      this.lastDate = this.date;
      this.events = [];
      this.loadEvents(this.numEventsInitial).then(() => {
        this.showMoreEvents(this.numEventsInitial);
      });
      this.loadEvents(this.numEventsToAdd * 10, 1000); // 1s delay to allow page to load first
    }
  },
  watch: {
    $route() {
      // the timeout is used so that the user can switch through multiple dates quickly
      // without having to wait until the upcoming events load for each date
      clearTimeout(this.dateTimeout);
      this.numEventsDisplayed = 0;
      this.dateTimeout = setTimeout(this.reset, 250);
    },
  },
  components: { Card, EventChip, FontAwesomeIcon }
}
</script>

<style lang="sass" scoped>
@import '../styles/style.sass'

.title
  text-align: center
  font-size: 1.5em
  margin: 15px 0
  // font-weight: bold

.events
  position: relative
  overflow: auto
  padding-bottom: 25px

  .line
    --width: 3px
    height: 100%
    width: var(--width)
    position: absolute
    left: calc(100% / 2 - var(--width) / 2)
    border-radius: 50px
    background-color: $color

  .event-chip
    margin-top: 30px

.down-arrow
  margin: auto
  display: block
  margin-top: -3px
  font-size: 1.2em
  margin-bottom: 5px
  cursor: pointer
  color: $color

</style>
