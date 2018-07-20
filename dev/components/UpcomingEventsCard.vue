<template>
  <card class="card">
    <div class="title">Upcoming Events</div>
    <div class="events">
      <div class="line" :style="{ backgroundColor: color }"/>
      <event-chip
        class="event-chip"
        :color="color"
        v-for="(event, i) in events"
        v-bind="event"
        :direction="(i % 2 === 0) ? 'left' : 'right'"
        :key="event.event"/>
    </div>
    <div>
      <font-awesome-icon
        class="down-arrow"
        :icon="downArrow"
        :style="{ color }"
        @mousedown="addEvents(3)"/>
    </div>
  </card>
</template>

<script>
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import constants from '../js/const.js';
import testDate from '../js/dateparser.js';
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

  const defaultSchedule = constants.schedules[0];
  
  let event = null;
  for (const date of dates(startDate)) {
    // check if there would normally be the default schedule on that date
    // (to prevent weekends from being counted as 'No School' events)
    if (testDate(date, defaultSchedule.dates)) {
      // check if the actual schedule is different from the normal one
      const schedule = Bell.getSchedule(constants.schedules, date);
      if (schedule.name !== defaultSchedule.name) {
        event = { date, name: schedule.name };
        break;
      }
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
    color: { type: String, required: true },
  },
  data() {
    return {
      cardHeight: 0,
      downArrow: faChevronDown,
      events: [],
      next: [], // preload later events to save time
      lastDate: new Date(), // the date until which events are currently being displayed
    }
  },
  mounted() {
    this.$refs.card.setHeight();
    this.addEvents(4);
  },
  methods: {
    preloadNextEvents(num) {
      for (let i = 0; i < num; i++) {
        const event = getNextEvent(this.lastDate);
        if (event) {
          this.lastDate = event.date;
          this.next.push(event);
        }
      }
    },
    addNextEvent() {
      if (this.next.length === 0) {
        this.preloadNextEvents(1);
      }
      this.events.push(this.next.shift());
    },
    addEvents(num) {
      for (let i = 0; i < num; i++) {
        this.addNextEvent();
      }
      this.preloadNextEvents(num);
    },
  },
  components: { Card, EventChip, FontAwesomeIcon }
}
</script>

<style lang="sass" scoped>

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

  .event-chip
    margin-top: 30px

.down-arrow
  margin: auto
  display: block
  margin-top: -3px
  font-size: 1.2em
  margin-bottom: 5px
  cursor: pointer

</style>
