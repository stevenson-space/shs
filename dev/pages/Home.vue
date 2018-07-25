<template>
  <div>
    <schedule-header
      :color="color"
      logo="images/patriot.png"
      :bell="bell"
      :date="date"
      :mode="mode"
      @countdown-done="updateDate"/>
    
    <card-container>
      <upcoming-events-card
        :color="color"
        :date="date"/>

      <icon-text-card
        :color="color"
        :icon="icons.faBell"
        text="Bell Schedules"
        link="bellschedules"/>
      
      <icon-text-card
        :color="color"
        :icon="icons.faLink"
        text="Links"
        link="links"
        :invert="true"/>
      
      <icon-text-card
        :color="color"
        :icon="icons.faFileAlt"
        text="Documents"
        link="documents"
        :invert="true"/>
      
      <icon-text-card
        :color="color"
        :icon="icons.faCalendarAlt"
        text="Calendar"
        link="calendar"/>
      
      <icon-text-card
        :color="color"
        :icon="icons.faTv"
        text="Projector Mode"
        link="projector"/>
    </card-container>
  </div>
</template>

<script>
import Bell from '../js/bell.js';

import ScheduleHeader from '../components/Header.vue';
import CardContainer from '../components/CardContainer.vue';
import Card from '../components/Card.vue' //basic card for testing purposes
import UpcomingEventsCard from '../components/UpcomingEventsCard.vue';
import IconTextCard from '../components/IconTextCard.vue';

import { faBell, faLink, faFileAlt, faCalendarAlt, faTv } from '@fortawesome/free-solid-svg-icons';

export default {
  data() {
    return {
      initialDate: Date.now(), // relative to url specified date (set in created())
      startDate: Date.now(), // relative to real time
      currentDate: Date.now(), // relative to real time
      color: '#064789',
      icons: {
        faBell,
        faLink,
        faFileAlt,
        faCalendarAlt,
        faTv
      }
    };
  },
  created() {
    this.resetDate();

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
    resetDate() {
      let { date='', time='' } = this.$route.query;
      time = time.replace(/\./g, ':'); // lets you use "." (url safe) instead of ":" (not url safe)
      date = date.replace(/-/g, '/'); // lets you use "-" instead of "/"
      const today = new Date();
      const todayDate = today.toLocaleDateString();
      const todayTime = today.toLocaleTimeString();
      this.initialDate = new Date(`${date || todayDate} ${time || todayTime}`).getTime();
    }
  },
  watch: {
    $route() { // when the url changes
      this.resetDate();
    }
  },
  components: { 
    ScheduleHeader, 
    CardContainer, 
    Card,
    UpcomingEventsCard,
    IconTextCard,
  },
}
</script>

<style lang="sass" scoped>
  
</style>
