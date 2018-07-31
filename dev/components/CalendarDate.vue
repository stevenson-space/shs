<template>
  <div>
    <div class="date" :class="{ today: isToday }">
      {{ date.getDate() }}
    </div>
    <calendar-event :text="schedule.name" :invert="invert"/>
  </div>
</template>

<script>
import Bell from '../js/bell.js';
import CalendarEvent from '../components/CalendarEvent.vue';

export default {
  props: {
    date: { type: Date, required: true },
    isToday: { type: Boolean, default: false },
  },
  computed: {
    schedule() {
      return Bell.getSchedule(this.date);
    },
    invert() {
      return !!Bell.isSpecialSchedule(this.date, this.schedule);
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
  
  &.today
    color: white
    background-color: $color

</style>
