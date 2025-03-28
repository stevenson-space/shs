<template>
  <div class="day">
    <h2>Day {{ day }}</h2>
    <period
      v-for="(period, i) in periods"
      :key="period"
      :disableProgressBar="true"
      class="period"
      :period="period"
      :start="start[i]"
      :end="end[i]"
    />
  </div>
</template>

<script>
import Period from '@/components/Period.vue';

export default {
  components: { Period },
  props: {
    periods: { type: Array, required: true },
    start: { type: Array, required: true },
    end: { type: Array, required: true },
    day: { type: Number, required: true },
  },
};
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.day
  flex-grow: 1
  margin: 0 10px

  h2
    text-align: center

  .period
    width: 100%

</style>
