<template>
  <div class="header">
    <div class="main" :style="{ backgroundColor: color }">
      <router-link class="switch-day" :to="{ path: '/', query: {date: formatDateUrl(yesterday)}}">
        <font-awesome-icon :icon="leftArrow" class="arrow-icon"/>
      </router-link>

      <div>
        <div class="countdown-circle">
          <img :src="logo" class="logo">

          <div class="countdown" v-if="mode === 'current'">
            {{ countdownString }}
          </div>
          <div class="range" v-else>
            {{ bell.getRange() }}
          </div>

          <div class="type" v-if="inSchool || mode === 'day'">{{ bell.type }}</div>
          <div class="next-day" v-else>{{ nextDayString }}</div>
        </div>

        <div class="date">
          {{ formatDate(date) }}
        </div>
      </div>

      <router-link class="switch-day"  :to="{ path: '/', query: { date: formatDateUrl(tomorrow) }}">
        <font-awesome-icon :icon="rightArrow" class="arrow-icon"/>
      </router-link>
    </div>

    <div class="schedule">
      <template v-if="mode === 'current'">
        <div class="range">{{ bell.getRange() }}</div>

        <div class="period" v-if="inSchool">
          {{ bell.getPeriodName() }}
        </div>
        <div class="type" v-else>
          {{ bell.type }}
        </div>
      </template>

      <router-link class="button" to="/" :style="{ backgroundColor: color }" v-else>
        Go Back Live
      </router-link>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import Bell from '../js/bell.js';

function toSeconds([hour = 0, minute = 0, second = 0]) {
  return (((hour * 60) + minute) * 60) + second;
}

function dateToSeconds(date) {
  return toSeconds([date.getHours(), date.getMinutes(), date.getSeconds()]);
}

function periodToSeconds(period) {
  return toSeconds(period.split(':').map(Number));
}

export default {
  props: {
    color: { type: String, required: true },
    logo: { type: String, required: true },
    date: { type: Date, required: true },
    bell: { type: Bell, required: true },
    mode: {
      validator: mode => mode === 'current' || mode === 'day',
      required: true,
    },
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
      const { bell } = this;
      return bell.school && !bell.period.afterSchool && !bell.period.beforeSchool;
    },
    nextSchoolBell() {
      return new Bell(this.bell.nextSchoolDay);
    },
    endTime() {
      const { bell, date } = this;
      if (this.inSchool) {
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

      const firstPeriod = nextBell.schedule.start[0];
      return periodToSeconds(firstPeriod) + dayDifference * 24 * 60 * 60;
    },
    totalSecondsLeft() {
      return this.endTime - this.currentTime;
    },
    countdownString() {
      if (this.totalSecondsLeft > 60 * 60 * 24) { // if more than 1 day of seconds left
        const numDays = Math.ceil(this.totalSecondsLeft / 60 / 60 / 24);
        return `${numDays} days`;
      } else {
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
      const { bell, date } = this;
      const { school, period, nextSchoolDay } = bell;
      let str;
      if (school && period.beforeSchool) {
        str = 'today';
      } else {
        const getEpochDay = date => Math.floor(date.getTime() / 1000 / 60 / 60 / 24);
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
      const date = new Date(this.date);
      date.setDate(date.getDate() + 1);
      return date;
    },
    yesterday() {
      const date = new Date(this.date);
      date.setDate(date.getDate() - 1);
      return date;
    },
  },
  methods: {
    formatDate(date) {
      // Wednesday, September 30
      return date
        .toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    },
    formatDateUrl(date) {
      // e.g. "6-11-2018"
      return date
        .toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
        .replace(/\//g, '-')
    },
    initializeCountdown() {
      clearInterval(this.interval);
      if (this.mode === 'current') {
        this.interval = setInterval(() => {
          this.currentTime++;
        }, 1000);
      }
    }
  },
  mounted() {
    this.initializeCountdown();
  },
  watch: {
    mode() {
      this.initializeCountdown();
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
  components: { FontAwesomeIcon },
}
</script>

<style lang="sass" scoped>
@import '../styles/style'

.header
  --circle-diameter: 285px
  --logo-width: 100px
  +mobile
    --circle-diameter: 240px
    --logo-width: 75px

  +shadow
  background-color: white
  text-align: center

  .main
    height: 350px
    +mobile
      height: 300px
    
    display: flex
    align-items: center
    justify-content: space-between
    padding: 0 calc((100% - #{$content-width}) / 2)

    .countdown-circle
      +shadow
      background-color: white
      width: var(--circle-diameter)
      height: var(--circle-diameter)
      border-radius: calc(var(--circle-diameter) / 2)
      font-weight: bold
      color: #333

      .logo
        width: var(--logo-width)
        margin: 0 calc((var(--circle-diameter) - var(--logo-width)) / 2)
        margin-top: 15px
      
      .countdown
        font-size: 3.5em
        // margin-top: -5px
        line-height: 1em
        +mobile
          font-size: 3em

      .range
        font-size: 2.5em
        +mobile
          font-size: 2em

      .type
        margin-top: 12px
        font-size: 1.2em
        +mobile
          font-size: 1em
      
      .next-day
        font-size: .85em
        margin: auto
        height: 75px
        display: flex
        align-items: center
        justify-content: center
        white-space: pre
        font-weight: normal
        +mobile
          font-size: .8em
          height: 65px
    
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

  .schedule
    padding: 5px
    color: #333
    letter-spacing: 1px

    .range
      font-size: 1.1em

    .type, .period
      font-size: .9em

    .button
      +shadow
      text-decoration: none
      color: white
      border-radius: 8px
      padding: 8px
      margin: 4px
      display: inline-block
      font-weight: normal

</style>
