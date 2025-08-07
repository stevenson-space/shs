<template>
  <card
    v-if="schedule || bell?.isSchoolDay"
    class="card"
    :ignoreStyleMutations="true"
    @height-change="scrollToCurrentPeriod"
  >
    <div class="title">{{ title }}</div>
    <div
      ref="periods"
      class="periods"
      :style="{ maxHeight: maxHeight || undefined }"
    >
      <template v-for="period in periods">
        <div v-if="period.isUpNextIndicator" :key="period.name" class="up-next-indicator">
          <div class="line">
            <span class="title">Up Next</span>
          </div>
        </div>
        <period
          v-else
          :key="period.name"
          ref="period"
          :class="period.name == 'Passing' ? 'passing' : 'period'"
          :start="period.start"
          :end="period.end"
          :period="period.name"
          :invert="!period.isCurrent"
          :force-mobile-layout="true"
        />
      </template>
    </div>
    <slot />
  </card>
</template>

<script>
import Card from '@/components/Card.vue';
import Period from '@/components/Period.vue';
import { mapState } from 'pinia';
import { isBellOnSchoolDay } from '@/utils/bell';
import useClockStore from '@/stores/clock';

export default {
  components: { Card, Period },
  props: {
    schedule: { type: Object, default: null },
    title: { type: String, default: 'Schedule' },
    maxHeight: { type: String, default: null },
  },
  computed: {
    ...mapState(useClockStore, ['bell']),

    periods() {
      const convertPeriods = ({ start, end, periods }, currentPeriodName) => periods.map((period, i) => ({
        name: period,
        start: start[i],
        end: end[i],
        isCurrent: currentPeriodName === period,
      }));

      // first we check if the `schedule` prop is specified and use that if so
      if (this.schedule) {
        return convertPeriods(this.schedule, null);
      }

      // otherwise we check if we can default to using today's schedule (i.e if it's a school day)
      if (isBellOnSchoolDay(this.bell)) {
        const results = convertPeriods(this.bell.schedule, this.bell.period.name);

        // if we're displaying today's schedule and we're in a passing period,
        // we want to display an "Up Next" indicator between the two periods (so we manually add it in)
        if (this.bell.period.name === '!Passing') {
          for (let i = 0; i < results.length; i++) {
            // find the period that ends right before the current passing period
            if (results[i].end === this.bell.period.start) {
              // insert an object corresponding to the "Up Next" indicator right after it
              results.splice(i + 1, 0, { isUpNextIndicator: true });
            }
          }
        }
        return results;
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
@import '@/styles/style.sass'

.card
  padding: 0 8px 6px

  .title
    text-align: center
    font-size: 1.5em
    margin: 15px 0

  .periods
    padding: 8px
    display: flex
    flex-direction: column
    gap: 8px
    overflow-y: auto
    scrollbar-width: none
    -webkit-overflow-scrolling: touch
    position: relative

    .up-next-indicator
      padding: 0px 13px

      .line
        width: 100%
        height: 13px
        margin: 10px auto 20px auto
        border-bottom: 1px solid grey
        text-align: center

      .title
        font-size: 15px
        background-color: var(--secondaryBackground)
        color: grey
        padding: 3px

</style>
