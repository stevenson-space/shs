<template>
  <div>
    <schedule-header
      :bell="bell"
      :date="date"
      :mode="mode"
      :schedule-mode="scheduleMode"
      @countdown-done="updateDate"
      @schedule-mode-change="scheduleMode = $event"/>
    
    <card-container>
      <lunch-card :date="date" :bell="bell"/>

      <schedule-card :bell="bell"/>

      <upcoming-events-card :date="date"/>

      <icon-text-card
        :icon="icons.faBell"
        text="Bell Schedules"
        link="bellschedules"/>
      
      <icon-text-card
        :icon="icons.faLink"
        text="Links"
        link="links"
        :invert="true"/>
      
      <icon-text-card
        :icon="icons.faFileAlt"
        text="Documents"
        link="documents"/>
      
      <icon-text-card
        :icon="icons.faCalendarAlt"
        text="Calendar"
        link="calendar"
        :invert="true"/>
    </card-container>
  </div>
</template>

<script>
import Bell from '../js/bell.js';

import ScheduleHeader from '../components/Header.vue';
import CardContainer from '../components/CardContainer.vue';
import UpcomingEventsCard from '../components/UpcomingEventsCard.vue';
import LunchCard from '../components/LunchCard.vue';
import IconTextCard from '../components/IconTextCard.vue';
import ScheduleCard from '../components/ScheduleCard.vue';

import { faBell, faLink, faFileAlt, faCalendarAlt, faTv } from '@fortawesome/free-solid-svg-icons';

export default {
  props: {
    initialDate: { type: Number, default: Date.now() }
  },
  data() {
    return {
      // initialDate: Date.now(), // relative to url specified date (set in created())
      startDate: Date.now(), // relative to real time
      currentDate: Date.now(), // relative to real time
      icons: {
        faBell,
        faLink,
        faFileAlt,
        faCalendarAlt,
        faTv
      },
      scheduleMode: 0,
    };
  },
  created() {
    // Sometimes the interval used in Header.vue stops when the tab leaves focus
    // so updating the date when focus returns is necessary
    window.addEventListener('focus', () => {
      this.updateDate();
    });
  },
  computed: {
    mode() {
      // in 'current' mode, everything is configured as if the specified date is current (e.g. countdown shown)
      // in 'day' mode, only details about that date are displayed (e.g. calendar events, lunch)
      // if 'date' url parameter is specified, 'day' mode is triggered
      // the 'time' url parameter is to be used for testing and always sets mode to 'current'
      const { date, time } = this.$route.query;
      return (!date || time) ? 'current' : 'day';
    },
    date() {
      const { initialDate, startDate, currentDate } = this;
      const date = new Date(initialDate + (currentDate - startDate));

      // if mode is 'day' return date at time 0:00 instead (to get range string for whole day instead for current period)
      return (this.mode === 'current') ? date : new Date(date.toLocaleDateString());
    },
    bell() {
      return this.date ? new Bell(this.date, this.scheduleMode) : null;
    }
  },
  methods: {
    // date is not updated automatically to avoid creating a new Date object every second
    // instead updateDate is called evey time the countdown finishes
    updateDate() {
      this.currentDate = Date.now();
    },
  },
  watch: {
    initialDate() {
      this.startDate = Date.now();
      this.updateDate();
    },
  },
  components: { 
    ScheduleHeader, 
    CardContainer,
    UpcomingEventsCard,
    LunchCard,
    IconTextCard,
    ScheduleCard,
  },
}
</script>

<style lang="sass" scoped>
  
</style>
