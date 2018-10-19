<template>
  <div class="bellschedules">
    <div class="background-block"/>
    
    <home-link class="home-link" :invert="false"/>

    <div class="card">
      <schedule
        v-for="schedule in schedules"
        v-if="schedule.modes.length > 0"
        :schedule="schedule"
        :key="schedule.name"/>
    </div>
  </div>
</template>

<script>
import schedules from 'src/data/schedules.json';
import Schedule from './Schedule.vue';
import HomeLink from 'common/HomeLink.vue';

export default {
  data() {
    return {
      schedules,
    }
  },
  components: { Schedule, HomeLink },
}
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.bellschedules
  width: 80%
  max-width: $content-width
  margin: auto
  position: relative
  +mobile
    width: 90%

  .background-block
    background-color: var(--color)
    height: 250px
    width: 100%
    position: fixed
    left: 0

  .home-link
    position: absolute
    right: 0
    top: 30px
    +mobile
      top: 20px

  .card
    +shadow
    background-color: white
    position: relative
    border-radius: 20px
    top: 100px
    overflow: hidden
    margin-bottom: 25px
    +mobile
      top: 75px

</style>
