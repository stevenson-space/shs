<template>
  <div class="schedule" :style="style">
    <div ref="wrapper" class="wrapper">
      <div class="schedule-name">
        {{ schedule.name }}
      </div>

      <div v-if="dropdownOptions.length > 1" class="schedule-select">
        <dropdown
          v-model="selectedMode"
          class="schedule-dropdown"
          :options="dropdownOptions"
        />
      </div>

      <div class="periods">
        <component
          :is="isMultiDay ? 'MultiDayPeriod' : 'Period'"
          v-for="period in periods"
          :disableProgressBar="schedule.name != bell.type"
          :key="period._id"
          v-bind="period"
        />
      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Bell from '@/utils/bell';
import Period from '@/components/Period.vue';
import Dropdown from '@/components/Dropdown.vue';
import ScrollSelector from '@/components/ScrollSelector.vue';
import MultiDayPeriod from './MultiDayPeriod.vue';

export default {
  components: {
    Period,
    MultiDayPeriod,
    Dropdown,
    ScrollSelector,
  },
  props: {
    schedule: { type: Object, required: true },
  },
  data() {
    return {
      height: null,
      selectedMode: 0,
      resizeListener: null,
      resizeTimeout: null,
    };
  },
  computed: {
    ...mapGetters([
      'bell',
    ]),
    selectedModeString() {
      return this.dropdownOptions[this.selectedMode];
    },
    style() {
      const { height } = this;
      return {
        height: height !== null ? `${height}px` : 'auto',
      };
    },
    mode() {
      return this.formatMultiDayMode(this.schedule.modes[this.selectedMode]);
    },
    isMultiDay() {
      return Bell.isMultiDaySchedule(this.mode);
    },
    periods() {
      const { isMultiDay, mode: { periods, start, end } } = this;
      return periods.map((period, i) => ({
        _id: period.toString(),
        [isMultiDay ? 'periods' : 'period']: period,
        start: start[i],
        end: end[i],
        day: i + 1,
      }));
    },
    dropdownOptions() {
      return this.schedule.modes.map((mode) => mode.name);
    },
  },
  watch: {
    selectedMode() {
      this.setHeight();
    },
  },
  mounted() {
    this.setHeight();

    this.resizeListener = () => {
      // wait until user is finished resizing before setting height (debounce)
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        this.setHeight();
      }, 250);
    };
    window.addEventListener('resize', this.resizeListener);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeListener);
  },
  methods: {
    setHeight() {
      // wait until content updates before updating height
      this.$nextTick(() => {
        this.height = this.$refs.wrapper.offsetHeight;
      });
    },
    formatMultiDayMode(mode) {
      // Reformat the schedule to make the start, end, and periods arrays all 2D arrays
      // by duplicating any arrays that are not 2D
      // {start: [1,3,5], end: [2,4,6], periods: [['1','2','3'],['4','5','6'],['7','8','9']]} becomes
      // {start: [[1,3,5],[1,3,5],[1,3,5]], end: [[2,4,6],[2,4,6],[2,4,6]], periods: [['1','2','3'],['4','5','6'],['7','8','9']]}

      const is2D = (arr) => Array.isArray(arr[0]);

      if (Bell.isMultiDaySchedule(mode)) {
        // If it is multiday, any of the 3 properties (start, end, periods) could be a 2D array
        // We need the length (number of days) of whichever property is a 2D array
        const numDays = is2D(mode.start) ? mode.start.length
          : is2D(mode.end) ? mode.end.length
            : is2D(mode.periods) ? mode.periods.length
              : 1;

        // for the remaining properties that are not 2D arrays, we need to make them 2D
        // by duplicating their array by the number of days
        const fillDays = (arr) => (is2D(arr) ? arr : Array(numDays).fill(arr));
        return {
          name: mode.name,
          start: fillDays(mode.start),
          end: fillDays(mode.end),
          periods: fillDays(mode.periods),
        };
      }

      // If it is not a multiday mode, just return the normal mode
      return mode;
    },
    nextMode() {
      this.selectedMode = (this.selectedMode + 1) % this.schedule.modes.length;
    },
    previousMode() {
      const numModes = this.schedule.modes.length;
      this.selectedMode = (this.selectedMode - 1 + numModes) % numModes;
    },
    onSwipe(e) {
      this[e.deltaX < 0 ? 'nextMode' : 'previousMode']();
    },
  },
};
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.schedule
  position: relative
  border-bottom: #BBB solid 1px
  transition: height .3s
  text-align: center

  .schedule-name
    text-align: left
    font-size: 2.5em
    font-weight: bold
    color: var(--tertiary)
    margin-left: 54px
    padding: 35px 0 15px 0
    display: flex
    align-items: center

    +mobile
      font-size: 2em
      margin-left: 0
      justify-content: center
      padding: 25px 0 10px 0

    .hybrid-info
      display: inline-block
      font-size: 1.3rem
      margin-left: 10px

  .schedule-select
    display: flex
    justify-content: flex-end
    +mobile-small
      justify-content: center

    .schedule-dropdown
      margin: 0 75px
      +mobile
        margin: 0 40px

  .periods
    flex-grow: 1
    display: flex
    justify-content: space-around
    align-items: center
    flex-wrap: wrap
    padding: 25px 50px
    +mobile
      padding: 10px 15px

</style>
