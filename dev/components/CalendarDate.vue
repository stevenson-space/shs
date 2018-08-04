<template>
  <div>
    <div class="date" :class="{ today: isToday }">
      {{ date }}
    </div>
    <calendar-event v-if="schedule" :text="schedule.name" :invert="true"/>
    <calendar-event
      v-for="event in events"
      :text="event.name"
      :key="event.name + event.start"/>
  </div>
</template>

<script>
import Bell from '../js/bell.js';
import CalendarEvent from '../components/CalendarEvent.vue';

export default {
  props: {
    date: { type: Number, required: true },
    schedule: { type: Object, default: null },
    events: { type: Array, required: true },
    isToday: { type: Boolean, default: false },
  },
  components: { CalendarEvent },
}
</script>

<style lang="sass" scoped>
@import '../styles/style.sass'

.date
  font-size: 16px // prevents parent from enlarging the date number (parent actually intends to enlarge CalendarEvent's text)
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
