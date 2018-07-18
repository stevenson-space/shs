<template>
  <card>
    <div class="title">Upcoming Events</div>
    <div class="events">
      <div class="line" :style="{ backgroundColor: color }"/>
      <event-chip
        class="event-chip"
        :color="color"
        v-for="(event, i) in sampleData"
        v-bind="event"
        :direction="(i % 2 === 0) ? 'left' : 'right'"
        :key="event.event"/>
    </div>
    <div>
      <font-awesome-icon class="down-arrow" :icon="downArrow" :style="{ color }"/>
    </div>
  </card>
</template>

<script>
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import Card from './Card.vue';
import EventChip from './EventChip.vue';

export default {
  props: {
    color: { type: String, required: true },
  },
  data() {
    return {
      downArrow: faChevronDown,
      sampleData: [
        { date: new Date('7/20/2018'), name: 'Event 1' },
        { date: new Date('7/21/2018'), name: 'Event 2' },
        { date: new Date('7/25/2018'), name: 'Event 3' },
      ]
    }
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
