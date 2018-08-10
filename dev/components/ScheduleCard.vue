<template>
  <card class="card" v-if="bell.school">
    <div class="title">Schedule</div>
    <period
      class="period"
      v-for="(period, i) in periods"
      :start="period.start"
      :end="period.end"
      :period="period.name"
      :invert="bell.period.name !== period.name"
      :force-mobile-layout="true"
      :key="period.name"/>
  </card>
</template>

<script>
import Bell from '../js/bell.js';
import Card from './Card.vue';
import Period from './Period.vue';

export default {
  props: {
    bell: { type: Bell, required: true },
  },
  computed: {
    periods() {
      const { start, end, periods } = this.bell.schedule;
      const result = [];

      periods.forEach((period, i) => {
        result.push({
          name: period,
          start: start[i],
          end: end[i],
        });
      });

      return result;
    }
  },
  components: { Card, Period },
}
</script>

<style lang="sass" scoped>
@import '../styles/style.sass'

.card
  padding: 0 10px
  padding-bottom: 5px

  .title
    text-align: center
    font-size: 1.5em
    margin: 15px 0

  .period
    margin-bottom: 7px
    font-size: .9em
    height: 37px

</style>

