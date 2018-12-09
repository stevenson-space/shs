<template>
  <card class="card" v-if="bell.school" @height-change="scrollToCurrentPeriod">
    <div class="title">Schedule</div>
    <div class="periods" ref="periods">
      <period
        class="period"
        v-for="(period, i) in periods"
        :start="period.start"
        :end="period.end"
        :period="period.name"
        :invert="!period.isCurrent"
        :force-mobile-layout="true"
        :key="period.name"
        ref="period"/>
    </div>
  </card>
</template>

<script>
import Bell from 'src/js/bell.js';
import Card from 'common/Card.vue';
import Period from 'common/Period.vue';

export default {
  props: {
    bell: { type: Bell, required: true },
  },
  computed: {
    periods() {
      if (this.bell.school) {
        let { start, end, periods } = this.bell.schedule;

        if (Bell.isMultiDay(this.bell.schedule)) {
          ({ start, end, periods } = Bell.getMultiDay({ start, end, periods }, this.bell.date, this.bell.dates));
        }

        const result = [];

        periods.forEach((period, i) => {
          result.push({
            name: period,
            start: start[i],
            end: end[i],
            isCurrent: this.bell.period && this.bell.period.name === period,
          });
        });

        return result;
      }
      return [];
    }
  },
  methods: {
    scrollToCurrentPeriod() {
      // Get the html element for the current period if there is one
      let $period = null;
      this.periods.forEach((period, i) => {
        if (period.isCurrent) {
          $period = this.$refs.period[i];
        }
      });

      if ($period) {
        const $container = this.$refs.periods;
        const containerHeight = $container.offsetHeight;
        const { offsetTop, offsetHeight } = $period.$el;

        // Set the scroll so that the current period is centered
        $container.scrollTop = offsetTop - containerHeight / 2 + offsetHeight / 2;
      }
    }
  },
  mounted() {
    this.scrollToCurrentPeriod();
  },
  watch: {
    bell() {
      // wait until periods rerender before scrolling
      this.$nextTick(() => {
        this.scrollToCurrentPeriod();
      });
    }
  },
  components: { Card, Period },
}
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.card
  padding: 0 10px
  padding-bottom: 5px

  .title
    text-align: center
    font-size: 1.5em
    margin: 15px 0

  .periods
    max-height: 275px
    overflow-y: scroll
    -webkit-overflow-scrolling: touch;
    position: relative
    +no-scrollbar
    // +mobile
      // height: 175px
    
    .period
      margin-left: 4px
      margin-bottom: 7px
      font-size: .9em
      height: 37px

</style>

