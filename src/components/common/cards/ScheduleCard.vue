<template>
  <card v-if="schedule || bell.school" class="card" @height-change="scrollToCurrentPeriod">
    <div class="title">{{ title }}</div>
    <div ref="periods" class="periods">
      <period
        v-for="period in periods"
        :key="period.name"
        ref="period"
        :class="period.name == 'Passing' ? 'passing' : 'period'"
        :start="period.start"
        :end="period.end"
        :period="period.name"
        :invert="!period.isCurrent"
        :force-mobile-layout="true"
      />
    </div>
    <slot />
  </card>
</template>

<script>
import Card from 'common/Card.vue';
import Period from 'common/Period.vue';
import { mapGetters } from 'vuex';

export default {
  components: { Card, Period },
  props: {
    schedule: { type: Object, default: null },
    title: { type: String, default: 'Schedule' },
  },
  computed: {
    ...mapGetters([
      'bell',
    ]),
    periods() {
      if (this.schedule || this.bell.school) {
        const { start, end, periods } = this.schedule || this.bell.schedule;
        const result = [];
        periods.forEach((period, i) => {
            if(this.bell.period.name == '!Passing' && this.bell.period.end == start[i]){
             result.push({
             name: "Passing",
             start: start[i],
             end: end[i],
              isCurrent: true,
             });
            }

          result.push({
            name: period,
            start: start[i],
            end: end[i],
            isCurrent: this.schedule ? false : (this.bell.period && this.bell.period.name === period),
          });
        });

        return result;
      }
      return [];
    },
  },
  watch: {
    bell() {
      // wait until periods rerender before scrolling
      this.$nextTick(() => {
        this.scrollToCurrentPeriod();
      });
    },
  },
  mounted() {
    this.scrollToCurrentPeriod();
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
    },
  },
};
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
    -webkit-overflow-scrolling: touch
    position: relative
    +no-scrollbar

    .period
      margin-left: 4px
      margin-bottom: 7px
      font-size: .9em
      height: 37px

</style>
