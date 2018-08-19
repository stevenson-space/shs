<template>
  <div>
    <div class="background-block"/>

    <div class="card">
      <home-link class="home-link" :invert="false"/>

      <schedule
        v-for="schedule in schedules"
        v-if="schedule.modes.length > 0"
        :schedule="schedule"
        :key="schedule.name"/>
    </div>
  </div>
</template>

<script>
import schedules from '../data/schedules.json';
import Schedule from '../components/Schedule.vue';
import HomeLink from '../components/HomeLink.vue';

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
@import '../styles/style.sass'

.background-block
  background-color: $color
  height: 250px
  width: 100%
  position: fixed

.home-link
  position: absolute
  right: 0
  top: -70px
  +mobile
    top: -55px

.card
  +shadow
  width: 80%
  max-width: $content-width
  background-color: white
  margin: auto
  position: relative
  border-radius: 20px
  top: 100px
  // overflow: hidden
  margin-bottom: 25px
  +mobile
    width: 90%
    top: 75px

</style>
