<template>
  <div>
    <div class="date" :class="{ today: isToday }">
      {{ date }}
    </div>
    <calendar-event v-if="schedule" :text="schedule.name" :invert="true" />
    <calendar-event
      v-for="event in events"
      :key="event.name + event.start"
      class="event"
      :text="event.name"
      @click.native="$emit('event-click', event)"
    />
  </div>
</template>

<script>
import CalendarEvent from './CalendarEvent.vue';

export default {
  components: { CalendarEvent },
  props: {
    date: { type: Number, required: true },
    schedule: { type: Object, default: null },
    events: { type: Array, required: true },
    isToday: { type: Boolean, default: false },
  },
};
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

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
    background-color: var(--color)

.event
  cursor: pointer

</style>
