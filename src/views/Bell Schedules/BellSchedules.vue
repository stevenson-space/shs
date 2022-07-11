<template>
  <div class="bellschedules">
    <div class="background-block" />

    <div class="main">
      <home-link class="home-link" :invert="false" />

      <div class="card">
        <schedule
          v-for="schedule in schedules.filter(schedule => schedule.modes.length > 0)"
          :key="schedule.name"
          :schedule="schedule"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'pinia';
import useScheduleStore from '@/stores/schedules';
import HomeLink from '@/components/HomeLink.vue';
import Schedule from './Schedule.vue';

export default {
  components: { Schedule, HomeLink },
  computed: {
    ...mapState(useScheduleStore, ['schedules']),
  },
};
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.bellschedules
  .background-block
    background-color: var(--headerBackgroundColor)
    height: 250px
    width: 100%
    left: 0
    position: absolute

  .main
    width: 80%
    max-width: $content-width + 80px // hardcoded value :( to make standard schedule periods all fit in one line (on my display)
    margin: auto
    position: relative
    +mobile
      width: 90%

    .home-link
      position: absolute
      right: 0
      top: 30px
      +mobile
        top: 20px

    .card
      +shadow
      background-color: var(--background)
      position: relative
      border-radius: 20px
      top: 100px
      overflow: hidden
      margin-bottom: 25px
      +mobile
        top: 75px

</style>
