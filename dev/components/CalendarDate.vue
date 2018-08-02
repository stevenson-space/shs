<template>
  <div>
    <div class="date" :class="{ today: isToday }">
      {{ dateObject.getDate() }}
    </div>
    <calendar-event v-if="schedule" :text="schedule.name" :invert="true"/>
    <calendar-event
      v-for="event in processedEvents"
      :text="event.name"
      :key="event.name + event.start"/>
  </div>
</template>

<script>
import Bell from '../js/bell.js';
import CalendarEvent from '../components/CalendarEvent.vue';

export default {
  props: {
    date: { type: String, required: true },
    events: { type: Array, default: () => [] },
    isToday: { type: Boolean, default: false },
  },
  computed: {
    dateObject() {
      return new Date(this.date);
    },
    schedule() {
      // only show the schedule if it is special
      return Bell.isSpecialSchedule(this.dateObject);
    },
    processedEvents() {
      const { events, schedule } = this
      const processedEvents = [];
      events.forEach(event => {
        // If the event just repeats the schedule type (already displayed), don't display it
        if (event.name.indexOf(schedule.name) > -1) {
          // However, if the event also adds information in the following format (e.g. No School - Labor Day)
          // then keep the additional information as an event and just stip off the schedule type
          const regex = new RegExp(`^${schedule.name} - (.+)$`);
          if (event.name.match(regex)) {
            event.name = event.name.replace(regex, '$1');
            processedEvents.push(event);
          }
        } else {
          processedEvents.push(event);
        }
      });
      return processedEvents;
    }
  },
  components: { CalendarEvent },
}
</script>

<style lang="sass" scoped>
@import '../styles/style.sass'

.date
  margin: 5px
  display: inline-block
  border-radius: 20px
  width: 27px
  height: 27px
  text-align: center
  line-height: 27px
  font-weight: bold
  user-select: none
  
  &.today
    color: white
    background-color: $color

</style>
