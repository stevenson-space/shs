<template>
  <div class="schedule" :style="style">
    <div class="wrapper" ref="wrapper">
      <div class="schedule-name">{{ schedule.name }}</div>
      
      <div class="mode"
        v-for="(mode, i) in schedule.modes"
        :key="mode.name"
        v-show="i === 0 || showAllModes">

        <div class="mode-name">
          <div>{{ mode.name }}</div>
        </div>

        <div class="periods">
          <template v-if="isMultiDay(mode)">
            <multi-day-period
              v-for="(day, j) in multiDayModes[i].periods"
              :periods="day"
              :start="multiDayModes[i].start[j]"
              :end="multiDayModes[i].end[j]"
              :day="j + 1"
              :key="day.toString()"/>
          </template>
          <template v-else>
            <period
              v-for="(period, j) in mode.periods"
              :period="period"
              :start="mode.start[j]"
              :end="mode.end[j]"
              :key="period"/>
          </template>
        </div>
      </div>

      <div v-if="schedule.modes.length > 1">
        <font-awesome-icon
          class="show-more-icon"
          :icon="showAllModes ? faChevronUp : faChevronDown"
          @mousedown="toggleShowAllModes"/>
      </div>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import Period from '../components/Period.vue';
import MultiDayPeriod from '../components/MultiDayPeriod.vue';
import Bell from '../js/bell.js';

export default {
  props: {
    schedule: { type: Object, required: true },
  },
  data() {
    return {
      faChevronUp,
      faChevronDown,
      initialHeight: 0,
      height: null,
      showAllModes: false,
      resizeListener: null,
      resizeTimeout: null,
    }
  },
  mounted() {
    // initialHeight is necessary for the animation (to know end value of animation prior to doing it)
    this.setInitialHeight();
    this.setHeight();

    this.resizeListener = () => {
      // wait until user is finished resizing before setting height (debounce)
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        this.setInitialHeight();
        this.setHeight();
      }, 250);
    }
    window.addEventListener('resize', this.resizeListener);
  },
  computed: {
    style() {
      const { height } = this;
      return {
        height: height !== null ? `${height}px` : 'auto',
      };
    },
    multiDayModes() {
      // format the schedule to make the start, end, and periods Arrays have the same length
      const { modes } = this.schedule;
      const is2D = arr => Array.isArray(arr[0]);

      return modes.map(mode => {
        if (this.isMultiDay(mode)) {
          const numDays = is2D(mode.start) ? mode.start.length
            : is2D(mode.end) ? mode.end.length
            : is2D(mode.periods) ? mode.periods.length
            : 1;
          
          const fillDays = arr => is2D(arr) ? arr : Array(numDays).fill(arr)
          return {
            start: fillDays(mode.start),
            end: fillDays(mode.end),
            periods: fillDays(mode.periods),
          };
        }
        return mode;
      });
    }
  },
  methods: {
    isMultiDay(schedule){
      return Bell.isMultiDay(schedule)
    },
    setInitialHeight() {
      if (!this.showAllModes) {
        this.$nextTick(() => {
          this.initialHeight = this.$refs.wrapper.offsetHeight;
        }); 
      }
    },
    setHeight() {
      // wait until content updates before updating height
      this.$nextTick(() => {
        this.height = this.$refs.wrapper.offsetHeight;
      });
    },
    toggleShowAllModes() {
      const { showAllModes, initialHeight, $refs } = this;
      if (showAllModes) {
        this.height = initialHeight;

        // wait until animation finishes before hiding modes
        setTimeout(() => {
          this.showAllModes = false;
          this.setInitialHeight(); // in case initial height changed (due to resize or something else)
          this.setHeight();
        }, 300); // animation duration
      } else {
        this.showAllModes = true;
        this.setHeight();
      }
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeListener);
  },
  components: { Period, MultiDayPeriod, FontAwesomeIcon },
}
</script>

<style lang="sass" scoped>
@import '../styles/style.sass'

.schedule
  position: relative
  border-bottom: #BBB solid 1px
  transition: height .3s // when modifying, also modify duration of setTimeout above
  overflow: hidden

  .wrapper
    overflow: auto

  .schedule-name
    font-size: 2.5em
    font-weight: bold
    color: #555
    margin-left: 100px
    // height: 125px
    line-height: 125px
    +mobile
      font-size: 2em
      margin-left: 0
      text-align: center
      line-height: 100px

  .mode
    display: flex
    margin-bottom: 50px

    .mode-name
      +shadow
      flex: 0 0 50px
      border-radius: 0 50px 50px 0
      display: flex
      justify-content: center
      align-items: center
      border: $color 2px solid
      border-left-width: 0
      flex-direction: column
      overflow: hidden
      +mobile
        flex: 0 0 40px
      
      div
        transform: rotate(-90deg)
        font-size: 1.2em
        letter-spacing: 2px
        width: 500px
        text-align: center
        color: $color
        font-weight: bold
        // color: white

    .periods
      min-height: 200px
      flex-grow: 1
      display: flex
      justify-content: space-around
      align-items: center
      flex-wrap: wrap
      margin: 0 50px
      +mobile
        margin: 0 15px

  .show-more-icon
    margin: 15px auto
    display: block
    color: #555
    cursor: pointer
    font-size: 1.2em

</style>
