<template>
  <div
    class="header"
    :class="{ 'full-screen': fullScreenMode }"
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
      :class="{ 'extra-padding': scheduleModes.length > 1, 'winterfest': theme.metadata.name.toLowerCase() == 'into the woods'}"
    >
      <video v-if="theme.metadata.name.toLowerCase() === 'stevenson space'" autoplay loop muted playsinline :class="'starry-night' + (fullScreenMode ? ' starry-night-full' : '')">
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
          :next-day="schoolResumesString(this.bell, this.date)?.replace(',', ',\n') ?? null"
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
        v-show="clockMode === 'current'"
        @click="toggleFullScreen"
        class="icon full-screen-mode"
      >
        <font-awesome-icon
          :icon="fullScreenMode ? icons.faCompress : icons.faExpand"
          fixed-width
        />
      </div>
      <div
        v-show="clockMode === 'current'"
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
    <particle-system
      v-if="particleImages.length > 0"
      :images="particleImages"
      :speed="styling.particles?.speed"
      :count="styling.particles?.count"
      :size="styling.particles?.size"
      :opacity="styling.particles?.opacity"
      :wind-power="styling.particles?.windPower"
      :interaction="false"
    />

  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';

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
import ParticleSystem from '@/components/ParticleSystem.vue';
import useClockStore from '@/stores/clock';
import useScheduleStore from '@/stores/schedules';
import useThemeStore from '@/stores/themes';

import Bell from '@/utils/bell';
import { dateToSeconds, formatDate } from '@/utils/util';
import CountdownCircle from './CountdownCircle.vue';
import HeaderSchedule from './HeaderSchedule.vue';
import Announcements from './Announcements.vue';
import { intoCountdownString, schoolResumesString } from '@/utils/countdown';

import { globalImageResolver } from '@/utils/imageResolver';

export default {
  components: {
    CountdownCircle,
    HeaderSchedule,
    Dropdown,
    Announcements,
    ParticleSystem,
  },
  props: {
    fullScreenMode: { type: Boolean, default: false },
  },
  data() {
    return {
      imageCache: globalImageResolver.getCache(),
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
      colored: true,
      useVirtualBell: false,
      starryNight,
    };
  },
  computed: {
    // this automatically gets the following properties from the store and adds them as computed properties
    ...mapState(useThemeStore, ['styling', 'theme']),
    ...mapState(useClockStore, ['clockMode', 'date', 'bell']),
    colors() {
      const showColor = this.colored || !this.fullScreenMode;
      const styling = this.styling;

      let headerStyle = {
        '--header-color': showColor ? 'var(--headerBackground)' : 'var(--background)',
        '--header-accent': showColor ? 'white' : 'var(--accent)',
      };

      if (styling?.header?.image?.full) {
        // trigger reactivity when cache updates
        const _ = this.imageCache;

        const fullResolved = globalImageResolver.resolve(styling.header.image.full);
        const mobileResolved = globalImageResolver.resolve(styling.header.image.mobile || styling.header.image.full);

        if (fullResolved) {
          headerStyle['--header-image-full'] = fullResolved.startsWith('data:')
            ? `url("${fullResolved}")`
            : `url(${fullResolved})`;
        }
        if (mobileResolved) {
          headerStyle['--header-image-mobile'] = mobileResolved.startsWith('data:')
            ? `url("${mobileResolved}")`
            : `url(${mobileResolved})`;
        }
        if (fullResolved || mobileResolved) {
          headerStyle['--has-header-image'] = '1';
        }

        this.loadImages(styling.header.image.full, styling.header.image.mobile);
      }

      return headerStyle;
    },
    endTime() {
      return this.bell.getSecondsUntilNextTarget();
    },
    totalSecondsLeft() {
      // this is seperated from endTime since totalSecondsLeft needs to be recalculated every
      // second while endTime (which is computationally expensive) does not
      return this.endTime - dateToSeconds(this.date);
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
    particleImages() {
      if (!this.styling?.particles?.images) {
        return [];
      }

      // trigger reactivity when cache updates
      const _ = this.imageCache;

      this.loadImages(...this.styling.particles.images);

      return this.styling.particles.images
        .map(url => globalImageResolver.resolve(url))
        .filter(img => img !== null);
    },
  },
  watch: {
    date() {
      if (this.totalSecondsLeft === 1) {
        setTimeout(() => {
          if (this.bell.inSchool && this.useVirtualBell) {
            const bell = new Audio(bellAudio);
            bell.volume = 0.05;
            bell.play();
          }
        }, 1000);
      }
    },
    colored() {
      localStorage.fullScreenColored = this.colored;
    },
  },
  created() {
    if (localStorage.fullScreenColored === 'false') {
      this.colored = false;
    }

    this.unsubscribeImageCache = globalImageResolver.onUpdate((cache) => {
      this.imageCache = cache;
    });
  },
  beforeUnmount() {
    if (this.unsubscribeImageCache) {
      this.unsubscribeImageCache();
    }
  },
  methods: {
    formatDate,
    schoolResumesString,
    intoCountdownString,

    async loadImages(...paths) {
      await globalImageResolver.loadAll(paths);
    },
    ...mapActions(useScheduleStore, ['setScheduleMode']),
    formatDateUrl(date) {
      // e.g. "6-11-2018"
      return date
        .toLocaleDateString('en-US', {
          month: 'numeric',
          day: 'numeric',
          year: 'numeric',
        })
        .replace(/\//g, '-');
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

  // Dynamic header images using CSS variables
  &[style*="--has-header-image"]
    background: var(--header-image-mobile, var(--header-color)) center center no-repeat
    background-size: cover
    +desktop
      background: var(--header-image-full, var(--header-color)) center center no-repeat

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
