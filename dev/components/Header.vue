<template>
  <div class="header">
    <div class="main">
      <router-link class="switch-day" :to="{ path: '/', query: {date: formatDateUrl(yesterday)}}">
        <font-awesome-icon :icon="leftArrow" class="arrow-icon"/>
      </router-link>

      <div>
        <countdown-circle
          :mode="mode"
          :in-school="inSchool"
          :countdown="countdownString"
          :range="bell.getRange()"
          :next-day="nextDayString"
          :schedule-type="bell.type"/>
        
        <div class="date">
          {{ formatDate(date) }}
        </div>
      </div>

      <router-link class="switch-day"  :to="{ path: '/', query: { date: formatDateUrl(tomorrow) }}">
        <font-awesome-icon :icon="rightArrow" class="arrow-icon"/>
      </router-link>
    </div>
    
    <header-schedule
      :mode="mode"
      :in-school="inSchool"
      :period="bell.getPeriodName()"
      :range="bell.getRange()"
      :schedule-type="bell.type"
      :schedule-modes="scheduleModeNames"
      :schedule-mode="scheduleMode"
      @schedule-mode-change="$emit('schedule-mode-change', $event)"/>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import Bell from '../js/bell.js';
import CountdownCircle from '../components/CountdownCircle.vue';
import HeaderSchedule from '../components/HeaderSchedule.vue';

function toSeconds([hour = 0, minute = 0, second = 0]) {
  return (((hour * 60) + minute) * 60) + second;
}

function dateToSeconds(date) {
  return toSeconds([date.getHours(), date.getMinutes(), date.getSeconds()]);
}

// period is in the format of a human readable 24-hour time string
function periodToSeconds(period) {
  return toSeconds(period.split(':').map(Number));
}

export default {
  props: {
    date: { type: Date, required: true },
    bell: { type: Bell, required: true },
    mode: {
      validator: mode => mode === 'current' || mode === 'day',
      required: true,
    },
    scheduleMode: { type: Number, required: true },
  },
  data() {
    return {
      rightArrow: faChevronRight,
      leftArrow: faChevronLeft,
      currentTime: dateToSeconds(this.date),
      interval: null,
    };
  },
  computed: {
    inSchool() {
      // To be in school, there must be school that day and we must not be before or after school
      const { bell } = this;
      return bell.school && !bell.period.afterSchool && !bell.period.beforeSchool;
    },
    nextSchoolBell() {
      return new Bell(this.bell.nextSchoolDay);
    },
    endTime() {
      const { bell, date, inSchool } = this;
      if (inSchool) {
        return periodToSeconds(bell.period.end);
      }
      // if not currently in school, return seconds left until school starts
      const { school, period, nextSchoolDay } = bell;
      let dayDifference = 0;

      // if before school, get the seconds until the first period today 
      let nextBell = bell;

      // if no school or after school, get the first period on the next school day
      if (!school || period.afterSchool) { 
        dayDifference = Math.floor((nextSchoolDay.getTime() - date.getTime()) / 1000 / 60 / 60 / 24);
        nextBell = new Bell(nextSchoolDay);
      }

      // return the start time of the next first period + 24 hours for each day elapsed in between
      const firstPeriod = nextBell.schedule.start[0];
      return periodToSeconds(firstPeriod) + dayDifference * 24 * 60 * 60;
    },
    totalSecondsLeft() {
      // this is seperated from endTime since totalSecondsLeft needs to be recalculated every
      // second while endTime (which is computationally expensive) does not
      return this.endTime - this.currentTime;
    },
    countdownString() {
      if (this.totalSecondsLeft > 60 * 60 * 24) {
        // if more than 1 day of seconds left, display number of days left
        const numDays = Math.ceil(this.totalSecondsLeft / 60 / 60 / 24);
        return `${numDays} days`;
      } else {
        // return a nicely formatted string with remaining hours, minutes, and seconds left
        const seconds = this.totalSecondsLeft % 60;
        const minutes = Math.floor(this.totalSecondsLeft / 60) % 60;
        const hours = Math.floor(this.totalSecondsLeft / 60 / 60);

        const h = ((hours > 0) ? `${hours}:` : ''); // hours is only displayed if > 0
        const mm = `${((minutes < 10 && hours > 0) ? '0' : '')}${minutes}:`; // minutes always has 2 digits if hours are displayed
        const ss = `${((seconds < 10) ? '0' : '')}${seconds}`; // seconds always has 2 digits

        return `${h}${mm}${ss}`;
      }
    },
    nextDayString() {
      // Returns when school resumes
      // Only displayed when not in school (either no school, before school, or after school)
      const { bell, date } = this;
      const { school, period, nextSchoolDay } = bell;

      // get days since January 1, 1970
      const getEpochDay = date => Math.floor(date.getTime() / 1000 / 60 / 60 / 24);

      // if school resumes on the same day or the next day, use 'today' or 'tomorrow' instead of the date
      let str;
      if (school && period.beforeSchool) {
        str = 'today';
      } else {
        const dayDifference = getEpochDay(nextSchoolDay) - getEpochDay(date);
        if (dayDifference === 1) {
          str = 'tomorrow';
        } else {
          str = this.formatDate(nextSchoolDay);
        }
      }
      return `School resumes ${str}`;
    },
    tomorrow() {
      // Date object for the next day, used for the arrow right
      const date = new Date(this.date);
      date.setDate(date.getDate() + 1);
      return date;
    },
    yesterday() {
      // Date object for the previous day, used for the arrow left
      const date = new Date(this.date);
      date.setDate(date.getDate() - 1);
      return date;
    },
    scheduleModeNames() {
      const modes = this.bell.scheduleModes;
      return modes.map(mode => mode.name);
    }
  },
  methods: {
    formatDate(date) {
      // Wednesday,
      // September 30
      return date
        .toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
        .replace(',', ',\n');
    },
    formatDateUrl(date) {
      // e.g. "6-11-2018"
      return date
        .toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
        .replace(/\//g, '-');
    },
    initializeCountdown() {
      this.stopCountdown();
      // start an interval which increments the currentTime every seconds (everything else updates based on that)
      this.interval = setInterval(() => {
        this.currentTime++;
      }, 1000);
    },
    stopCountdown() {
      clearInterval(this.interval);
    }
  },
  mounted() {
    this.initializeCountdown();
  },
  watch: {
    mode() {
      if (this.mode === 'current') {
        this.initializeCountdown();
      } else {
        this.stopCountdown();
      }
    },
    date() {
      this.currentTime = dateToSeconds(this.date);
    },
    totalSecondsLeft() {
      if (this.totalSecondsLeft === 0) {
        this.$emit('countdown-done');
      }
    }
  },
  destroyed() {
    clearInterval(this.interval);
  },
  components: { FontAwesomeIcon, CountdownCircle, HeaderSchedule },
}
</script>

<style lang="sass" scoped>
@import '../styles/style'

.header
  +shadow
  background-color: white
  text-align: center

  .main
    background-color: $color
    height: 350px
    display: flex
    align-items: center
    justify-content: space-between
    padding: 0 calc((100% - #{$content-width}) / 2)
    +mobile
      height: 300px
    
    .date
      +shadow
      background-color: white
      border-radius: 15px
      margin-top: 10px
      padding: 3px
      font-size: .9em

    .switch-day
      color: white
      width: 100px
      margin: 0 15px
      text-decoration: none
      +mobile
        margin: 0 10px

      .arrow-icon
        font-size: 5em
        margin-bottom: 10px
        +mobile
          font-size: 4em

      .text
        display: none
        +mobile
          display: none

</style>
