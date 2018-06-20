<template>
  <div class="header">
    <div class="main" :style="{ backgroundColor: color }">
      <router-link class="switch-day" :to="{ path: '/', query: {date: formatDateUrl(yesterday)}}">
        <font-awesome-icon :icon="leftArrow" class="arrow"/>
        {{ formatDate(yesterday) }}
      </router-link>

      <div class="countdown-circle">
        <img :src="logo" class="logo">

        <div class="countdown" v-if="mode === 'current'">
          {{ countdownString }}
        </div>
        <div class="range" v-else>
          {{ bell.getRange() }}
        </div>

        <div class="type" v-if="inSchool || mode === 'day'">
          {{ bell.type }}
        </div>
        <div class="next-day" v-else>
          School resumes {{ nextDayString }}
        </div>
      </div>

      <router-link class="switch-day"  :to="{ path: '/', query: { date: formatDateUrl(tomorrow) }}">
        <font-awesome-icon :icon="rightArrow" class="arrow"/>
        {{ formatDate(tomorrow) }}
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

export default {
  props: {
    color: { type: String, required: true },
    logo: { type: String, required: true },
    date: { type: Date, required: true },
    bell: { type: Bell, required: true },
    mode: { type: String, required: true },
  },
  data() {
    return {
      rightArrow: faChevronRight,
      leftArrow: faChevronLeft,
      currentTime: this.dateToSeconds(this.date),
      interval: false,
    };
  },
  computed: {
    inSchool() {
      const { bell } = this;
      return bell.school && !bell.period.afterSchool && !bell.period.beforeSchool;
    },
    totalSecondsLeft() {
      const { bell, date } = this;
      let endSeconds;
      if (!this.inSchool) {
        // return seconds left until school starts
        const { school, period, nextSchoolDay } = bell;
        let dayDifference = 0;
        let nextBell = bell;
        if (!school || period.afterSchool) { // if no school or after school, look for next school day
          dayDifference = Math.floor((nextSchoolDay.getTime() - date.getTime()) / 1000 / 60 / 60 / 24);
          nextBell = new Bell(nextSchoolDay);
        }
        const firstPeriod = nextBell.schedule.start[0];
        endSeconds = this.periodToSeconds(firstPeriod) + dayDifference * 24 * 60 * 60;
      } else {
        const { end } = bell.period;
        endSeconds = this.periodToSeconds(end);
      }
      return endSeconds - this.currentTime;
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
      if (school && period.beforeSchool) {
        return 'today';
      } else {
        const getEpochDay = date => Math.floor(date.getTime() / 1000 / 60 / 60 / 24);
        const dayDifference = getEpochDay(nextSchoolDay) - getEpochDay(date);
        if (dayDifference === 1) {
          return 'tomorrow';
        } else {
          return this.formatDate(nextSchoolDay);
        }
      }
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
    toSeconds([hour = 0, minute = 0, second = 0]) {
      return (((hour * 60) + minute) * 60) + second;
    },
    dateToSeconds(date) {
      return this.toSeconds([date.getHours(), date.getMinutes(), date.getSeconds()]);
    },
    periodToSeconds(period) {
      return this.toSeconds(period.split(':').map(Number));
    },
    formatDate(date) {
      // e.g. "Wednesday, September 30"
      return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    },
    formatDateUrl(date) {
      // e.g. "6-11-2018"
      return date
        .toLocaleDateString('en-US', {month: 'numeric', day: 'numeric', year: 'numeric'})
        .replace(/\//g, '-')
    }
  },
  mounted() {
    this.interval = setInterval(() => {
      this.currentTime++;
    }, 1000);
  },
  watch: {
    date() {
      this.currentTime = this.dateToSeconds(this.date);
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

$circle-diameter: 285px
$logo-width: 100px

.header
  +shadow
  background-color: white
  text-align: center

  .main
    height: 325px
    display: flex
    align-items: center
    justify-content: space-between
    padding: 0 calc((100% - #{$content-width}) / 2)

    .countdown-circle
      background-color: white
      width: $circle-diameter
      height: $circle-diameter
      border-radius: $circle-diameter / 2

      .logo
        width: $logo-width
        margin: 0 ($circle-diameter - $logo-width) / 2
        margin-top: 15px
      
      .countdown
        font-size: 4em
        margin-top: -5px
        line-height: 1em

      .range
        font-size: 2.5em

      .type
        // width: $circle-diameter / 1.5
        // margin: 10px auto
        // font-size: .9em
        // height: 2em
        // display: flex
        // align-items: center
        // justify-content: center
        margin-top: 12px
        font-size: 1.2em
      
      .next-day
        width: $circle-diameter / 1.5
        font-size: .85em
        margin: 15px auto

    .switch-day
      color: white
      width: 100px
      margin: 0 15px
      text-decoration: none

      .arrow
        font-size: 6em
        margin-bottom: 10px

  .schedule
    padding: 5px

    .range
      font-size: 1.25em

    .button
      +shadow
      text-decoration: none
      color: white
      border-radius: 8px
      padding: 8px
      margin: 4px
      display: inline-block

</style>
