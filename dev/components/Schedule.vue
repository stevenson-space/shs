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
          <period
            v-for="(period, i) in mode.periods"
            :period="period"
            :start="mode.start[i]"
            :end="mode.end[i]"
            :key="period"/>
        </div>
      </div>

      <div v-if="schedule.modes.length > 1">
        <font-awesome-icon
          class="show-more-icon"
          :icon="showAllModes ? faChevronUp : faChevronDown"
          @click="toggleShowAllModes"/>
      </div>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import Period from '../components/Period.vue';

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
    }
  },
  mounted() {
    this.initialHeight = this.$refs.wrapper.offsetHeight;
    this.height = this.initialHeight;
  },
  computed: {
    style() {
      const { height } = this;
      return {
        height: height !== null ? `${height}px` : 'auto',
      };
    }
  },
  methods: {
    toggleShowAllModes() {
      const { showAllModes, initialHeight, $refs } = this;
      if (showAllModes) {
        this.height = initialHeight;

        // wait until animation finishes before hiding modes
        setTimeout(() => {
          this.showAllModes = false;
        }, 200);
      } else {
        this.showAllModes = true;
        
        // wait until content updates before updating height
        this.$nextTick(() => {
          this.height = $refs.wrapper.offsetHeight;
        });
      }
    }
  },
  components: { Period, FontAwesomeIcon },
}
</script>

<style lang="sass" scoped>
@import '../styles/style.sass'

.schedule
  position: relative
  border-bottom: #BBB solid 1px
  transition: height .2s
  overflow: hidden

  .wrapper
    overflow: auto

  .schedule-name
    font-size: 2.5em
    font-weight: bold
    color: #555
    margin-left: 100px
    height: 125px
    line-height: 125px

  .mode
    display: flex
    margin-bottom: 50px

    .mode-name
      flex: 0 0 50px
      border-radius: 0 50px 50px 0
      +shadow
      display: flex
      justify-content: center
      align-items: center
      // background-color: #064789
      border: #064789 2px solid
      border-left-width: 0
      flex-direction: column
      overflow: hidden
      
      div
        transform: rotate(-90deg)
        font-size: 1.2em
        letter-spacing: 2px
        width: 500px
        text-align: center
        color: #064789
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

  .show-more-icon
    margin: 15px auto
    display: block
    color: #555
    cursor: pointer
    font-size: 1.2em

</style>
