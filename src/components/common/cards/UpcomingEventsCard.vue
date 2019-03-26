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
        v-show="!eventsExhausted"
        class="down-arrow"
        :icon="downArrow"
        @mousedown="showMoreEvents()"/>
    </div>
  </card>
</template>

<script>
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import Bell from 'src/js/bell.js';
import Card from 'common/Card.vue';
import EventChip from 'common/EventChip.vue';

import { mapGetters } from 'vuex';

function getNextEvent(startDate) {
  // Generator that yields sequential dates starting from the day after start
  function* dates(start) {
    for(let i = 1; true; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      yield date;
    }
  }
  
  let event = null;

  // Go through dates starting from startDate until we find one with a special schedule and return that
  for (const date of dates(startDate)) {
    const schedule = Bell.isSpecialSchedule(date);
    if (schedule) {
      event = {
        key: `${schedule.name} ${date.getTime()}`, // unique key for each event used in v-for
        date,
        name: schedule.name
      };

      // need to break out of loop once an event is found since the generator will run forever
      break;
    }

    // give up searching after ~3 months
    if (date.getTime() - startDate.getTime() >= 1000 * 60 * 60 * 24 * 30 * 3) {
      console.log(date, startDate);
      break;
    }
  }

  return event;
}

export default {
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
      eventsExhausted: false,
    }
  },
  mounted() {
    setTimeout(this.reset, 250);
  },
  computed: {
    ...mapGetters([
      'date',
    ]),
    displayedEvents() {
      // Only display numEventsDisplayed events even if the events array contains more
      // and display blank placeholders if no events (possibly still loading)
      const { numEventsDisplayed, numEventsInitial } = this;

      // Placeholders still need unique keys to work with v-for
      const placeholders = Array(numEventsInitial).fill(0).map((_, i) => ({ key: i }));

      const events = this.events.slice(0, numEventsDisplayed);
      return events.length ? events : placeholders;
    },
  },
  methods: {
    loadEvents(num) {
      // Could potentially be expensive for large values of num, so load asynchronously
      return new Promise((resolve, reject) => {
        if (!this.eventsExhausted) {
          setTimeout(() => {
            // Get the next num events and add them to the events array
            for (let i = 0; i < num && !this.eventsExhausted; i++) {
              const event = getNextEvent(this.lastDate);
              if (event) {
                // Update the lastDate, so that we can start searching from that point for the next event
                this.lastDate = event.date;
                this.events.push(event);
              } else {
                this.eventsExhausted = true;
              }
            }
            resolve();
          }, 0);
        } else {
          reject('No more events left');
        }
      });
    },
    showMoreEvents(num = this.numEventsToAdd) {
      this.loadEvents(num);
      this.numEventsDisplayed += num;
    },
    reset() {
      this.lastDate = this.date;
      this.events = [];

      // Initially load just the number of events necessary before any user interaction
      this.loadEvents(this.numEventsInitial).then(() => {
        this.showMoreEvents(this.numEventsInitial);
      });
    }
  },
  watch: {
    $route() {
      // The timeout is used so that the user can switch through multiple dates quickly
      // without having to wait until the upcoming events load for each date
      // Upcoming Events only begin loading after the user does not switch date for at least 500ms
      clearTimeout(this.dateTimeout);
      this.numEventsDisplayed = 0;
      this.dateTimeout = setTimeout(this.reset, 1000);
    },
  },
  components: { Card, EventChip, FontAwesomeIcon }
}
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.title
  text-align: center
  font-size: 1.5em
  margin: 15px 0

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
    background-color: var(--color)

  .event-chip
    margin-top: 30px

.down-arrow
  margin: auto
  display: block
  margin-top: -3px
  font-size: 1.2em
  margin-bottom: 5px
  cursor: pointer
  color: var(--color)

</style>
