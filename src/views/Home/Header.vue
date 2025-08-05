<template>
  <div
    class="header"
    :class="{ 'full-screen': fullScreenMode, 'spy': theme.name.toLowerCase() == 'spy', 'halloween': theme.name.toLowerCase() == 'halloween', 'minecraft': theme.name.toLowerCase() == 'minecraft', 'mars': theme.name.toLowerCase() == 'mars', 'cosmic-reef': theme.name.toLowerCase() == 'cosmic reef', 'cosmic-tarantula': theme.name.toLowerCase() == 'cosmic tarantula', 'summer': theme.name.toLowerCase() == 'summer', 'eclipse': theme.name.toLowerCase() == 'eclipse', 'zen': theme.name.toLowerCase() == 'zen' || theme.name.toLowerCase() == 'not windows xp'}"
    :style="colors"
  >
    <dropdown
      v-show="scheduleModes.length > 1"
      class="schedule-select"
      :options="scheduleModes"
      :modelValue="scheduleModes.indexOf(bell.mode)"
      @update:modelValue="setScheduleMode(scheduleModes[$event])"
    />

    <div
      class="main"
      :class="{ 'extra-padding': scheduleModes.length > 1, 'winterfest': theme.name.toLowerCase() == 'into the woods'}"
    >
      <video v-if="theme.name.toLowerCase() === 'stevenson space'" autoplay loop muted playsinline :class="'starry-night' + (fullScreenMode ? ' starry-night-full' : '')">
        <source
          :src="starryNight"
          type="video/mp4"
        />
      </video>
      <div @click="previousDay" class="switch-day">
        <font-awesome-icon
          :icon="icons.faChevronLeft"
          class="arrow-icon"
        />
      </div>

      <div>
        <countdown-circle
          :in-school="bell.inSchool"
          :countdown="intoCountdownString(this.totalSecondsLeft)"
          :range="bell.getRange()"
          :next-day="nextDayString"
          :schedule-type="bell.type"
          :full-screen-mode="fullScreenMode"
        />
        <div class="date">
          {{ formatDate(date) }}
        </div>
      </div>

      <div @click="nextDay" class="switch-day">
        <font-awesome-icon
          :icon="icons.faChevronRight"
          class="arrow-icon"
        />
      </div>

      <div @click="toggleColor" class="icon remove-color">
        <font-awesome-icon
          :icon="colored ? icons.faDropletSlash : icons.faDroplet"
          fixed-width
        />
      </div>
      <div
        v-show="mode === 'current'"
        @click="toggleFullScreen"
        class="icon full-screen-mode"
      >
        <font-awesome-icon
          :icon="fullScreenMode ? icons.faCompress : icons.faExpand"
          fixed-width
        />
      </div>
      <div
        v-show="mode === 'current'"
        @click="toggleVirtualBell"
        class="icon virtual-bell-toggle"
      >
        <font-awesome-icon
          :icon="useVirtualBell ? icons.faVolumeHigh : icons.faVolumeOff"
          fixed-width
        />
      </div>
    </div>

    <header-schedule
      :in-school="bell.inSchool"
      :period="bell.getPeriodName()"
      :range="bell.getRange()"
      :schedule-type="bell.type"
      :schedule-modes="scheduleModes"
      :full-screen-mode="fullScreenMode"
    />

    <announcements :full-screen-mode="fullScreenMode" />
    <snow v-if="theme.name.toLowerCase() == 'winter'" :images="[snowflake]"/>
    <snow v-if="theme.name.includes('Valentine')" :images="[heart]"/>

  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';

import heart from '@/assets/occasions/heart.svg';
import snowflake from '@/assets/occasions/snowflake.png';
import bellAudio from '@/assets/virtual-bell.wav';
import starryNight from '@/assets/occasions/starry-night-full.mp4';

import {
  faChevronRight,
  faChevronLeft,
  faExpand,
  faCompress,
  faDroplet,
  faDropletSlash,
  faVolumeHigh,
  faVolumeOff,
} from '@fortawesome/free-solid-svg-icons';
import Dropdown from '@/components/Dropdown.vue';
import Snow from '@/components/Snow.vue';
import useScheduleStore from '@/stores/schedules';
import useThemeStore from '@/stores/themes';

import Bell from '@/utils/bell';
import { dateToSeconds, periodToSeconds, formatDate } from '@/utils/util';
import CountdownCircle from './CountdownCircle.vue';
import HeaderSchedule from './HeaderSchedule.vue';
import Announcements from './Announcements.vue';
import { intoCountdownString } from "@/utils/countdown.js";

export default {
  components: {
    CountdownCircle,
    HeaderSchedule,
    Dropdown,
    Announcements,
    Snow,
  },
  props: {
    fullScreenMode: { type: Boolean, default: false },
  },
  data() {
    return {
      icons: {
        faChevronRight,
        faChevronLeft,
        faExpand,
        faCompress,
        faDroplet,
        faDropletSlash,
        faVolumeHigh,
        faVolumeOff,
      },
      heart,
      snowflake,
      currentTime: 0, // seconds since 12:00am
      interval: null,
      colored: true,
      useVirtualBell: false,
      starryNight,
    };
  },
  computed: {
    // this automatically gets the following properties from the store and adds them as computed properties
    ...mapState(useThemeStore, ['theme']),
    ...mapState(useScheduleStore, ['mode', 'date', 'bell']),
    colors() {
      const showColor = this.colored || !this.fullScreenMode;
      return {
        '--header-color': showColor ? 'var(--headerBackgroundColor)' : 'var(--background)',
        '--header-accent': showColor ? 'white' : 'var(--color)',
      };
    },
    endTime() {
      const { bell, date } = this;
      if (bell.inSchool) {
        return periodToSeconds(bell.period.end);
      }
      // if not currently in school, return seconds left until school starts
      const { isSchoolDay, period, nextSchoolDay } = bell;
      let dayDifference = 0;

      // if before school, get the seconds until the first period today
      let nextBell = bell;

      // if no school or after school, get the first period on the next school day
      if (!isSchoolDay || period.afterSchool) {
        dayDifference = Math.floor(
          (nextSchoolDay.getTime() - date.getTime())
            / 1000
            / 60
            / 60
            / 24,
        );
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
    nextDayString() {
      // Returns when school resumes
      // Only displayed when not in school (either no school, before school, or after school)
      const { bell, date } = this;
      const { isSchoolDay, period, nextSchoolDay } = bell;

      // get days since January 1, 1970
      const getEpochDay = (ofDate) => Math.floor(ofDate.getTime() / 1000 / 60 / 60 / 24);

      // if school resumes on the same day or the next day, use 'today' or 'tomorrow' instead of the date
      let str;
      if (isSchoolDay && period.beforeSchool) {
        str = '\ntoday';
      } else {
        const dayDifference = getEpochDay(nextSchoolDay) - getEpochDay(date);
        if (dayDifference === 1) {
          str = '\ntomorrow';
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
    scheduleModes() {
      if (!this.bell) {
        return [];
      }
      const { modes } = this.bell;
      return modes.map((mode) => mode.name);
    },
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
      let { bell } = this;

      if (this.totalSecondsLeft <= 0) {
        this.countdownDone();
        if (bell.inSchool && this.useVirtualBell) {
          const bell = new Audio(bellAudio);
          bell.volume = 0.05;
          bell.play();
        }
      }
    },
    colored() {
      localStorage.fullScreenColored = this.colored;
    },
  },
  created() {
    this.currentTime = dateToSeconds(this.date);
    if (localStorage.fullScreenColored === 'false') {
      this.colored = false;
    }
  },
  mounted() {
    this.initializeCountdown();
  },
  destroyed() {
    clearInterval(this.interval);
  },
  methods: {
    formatDate,
    intoCountdownString,
    ...mapActions(useScheduleStore, ['countdownDone', 'setScheduleMode']),
    formatDateUrl(date) {
      // e.g. "6-11-2018"
      return formatDate(date).replace(/\//g, '-');
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
    },
    previousDay() {
      // e.srcEvent.preventDefault();
      this.switchDay(this.yesterday);
    },
    nextDay() {
      // e.srcEvent.preventDefault();
      this.switchDay(this.tomorrow);
    },
    switchDay(date) {
      const { formatDateUrl, $router, mode } = this;
      if (formatDateUrl(date) === formatDateUrl(new Date())) {
        // if switching to today, switch to the normal view for today (mode === 'current')
        $router.push({ path: '/' });
      } else {
        const options = {
          path: '/',
          query: { date: formatDateUrl(date) },
        };

        // We only want to record a history entry if we're going from the current date to another date
        // Otherwise, we just want to replace the URL so that pressing the back button once
        // returns the user to the current date
        $router[mode === 'current' ? 'push' : 'replace'](options);
      }
    },
    toggleFullScreen() {
      this.$emit('toggle-fullscreen');
    },
    toggleColor() {
      this.colored = !this.colored;
    },
    toggleVirtualBell() {
      this.useVirtualBell = !this.useVirtualBell;
    },
  },
};
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.header
  +shadow
  background-color: var(--header-color)
  text-align: center
  transition: background-color .3s
  &.spy
    background: url(@/assets/occasions/spy-mobile.png) center center no-repeat, var(--header-color)
    background-size: cover
    +desktop
      background: url(@/assets/occasions/spy-full.png) center center no-repeat, var(--header-color)

  &.minecraft
    background: url(@/assets/occasions/minecraft-mobile.png) center center no-repeat, var(--header-color)
    background-size: cover
    +desktop
      background: url(@/assets/occasions/minecraft-desktop.png) center center no-repeat, var(--header-color)
  &.mars
    background: url(@/assets/occasions/mars-mobile.png) center center no-repeat, var(--header-color)
    background-size: cover
    +desktop
      background: url(@/assets/occasions/mars-full.png) center center no-repeat, var(--header-color)
  &.cosmic-reef
    background: url(@/assets/occasions/cosmic-reef-mobile.png) center center no-repeat, var(--header-color)
    background-size: cover
    +desktop
      background: url(@/assets/occasions/cosmic-reef-full.png) center center no-repeat, var(--header-color)
  &.cosmic-tarantula
    background: url(@/assets/occasions/cosmic-tarantula-mobile.png) center center no-repeat, var(--header-color)
    background-size: cover
    +desktop
      background: url(@/assets/occasions/cosmic-tarantula-full.png) center center no-repeat, var(--header-color)
  &.summer
    background: url(@/assets/occasions/beach-mobile.png) center center no-repeat, var(--header-color)
    background-size: cover
    +desktop
      background: url(@/assets/occasions/beach-full.png) center center no-repeat, var(--header-color)
  &.zen
    background: url(@/assets/occasions/zen-mobile.png) center center no-repeat, var(--header-color)
    background-size: cover
    +desktop
      background: url(@/assets/occasions/zen-full.png) center center no-repeat, var(--header-color)
  &.halloween
    background: url(@/assets/occasions/cob-webs-left.png) left top no-repeat, url(@/assets/occasions/cob-webs-right.png) right top no-repeat, var(--header-color)
    background-size: 250px
    +mobile-small
      background-size: 150px
  &.eclipse
    background: url(@/assets/occasions/eclipse-mobile.png) center center no-repeat, var(--header-color)
    background-size: cover
    +desktop
      background: url(@/assets/occasions/eclipse-full.png) center center no-repeat, var(--header-color)
      background-size: fit

  .starry-night
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    object-fit: cover
    z-index: -3

  .starry-night-full
    position: fixed
    height: 95% !important

  .schedule-select
    position: absolute
    right: 0
    margin: 7px
    display: none
    +mobile-small
      display: block

  .main
    height: 360px
    display: flex
    align-items: center
    justify-content: space-between
    max-width: 1000px
    margin: auto
    position: relative
    z-index: 0
    +mobile-small
      height: 280px
      &.extra-padding
        padding-top: 35px

    &.winterfest
      // background: url(/static/occasions/trees.png) center bottom no-repeat, var(--header-color)
      background-size: 700px
      +mobile-small
        background-size: 500px
    .date
      background-color: var(--background)
      border-radius: 100px
      margin-top: 10px
      padding: 3px
      font-size: 0.95em
      +mobile-small
        margin-top: 7px

    .switch-day
      color: white
      width: 100px
      margin: 0 15px
      cursor: pointer
      border-radius: 1000px
      +mobile-small
        margin: 0 5px
      &:active
        +shadow

      .arrow-icon
        font-size: 5em
        margin: 50px 0
        +mobile-small
          font-size: 3.5em

    .icon
      position: absolute
      top: 9px
      color: var(--header-accent) // set in computed property 'colors'
      padding: 10px 13px
      border-radius: 200px
      font-size: 1.75em
      cursor: pointer
      transition: box-shadow .2s
      +hover-darken-background
      +mobile
        display: none

    .remove-color
      display: none

    .virtual-bell-toggle
      right: 70px
      +mobile
        font-size: 1.25em
        display: block
        right: 9px
        top: 45px

    .full-screen-mode
      right: 9px

  &.full-screen
    top: 0
    height: 100%
    width: 100%
    position: fixed
    z-index: 2
    display: flex
    flex-direction: column
    background-size: cover

    .main
      flex-grow: 1
      justify-content: center

      .switch-day
        display: none

      .date
        font-size: 2.75vh
        margin-top: 25px
        padding: 5px

      .icon
        position: fixed
        top: 25px
        font-size: 4vh

      .virtual-bell-toggle
        right: 105px

      .remove-color
        display: block
        right: 190px

      .full-screen-mode
        position: fixed
        right: 25px
</style>
