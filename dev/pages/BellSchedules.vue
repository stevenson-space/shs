<template>
  <div>
    <div class="background-block"/>
    <div class="card">
      <template v-for="schedule in schedules">
        <schedule
          v-if="schedule.modes.length > 0"
          :schedule="schedule"
          :key="schedule.name"/>
      </template>
    </div>
  </div>
</template>

<script>
import constants from '../js/const.js';
import Schedule from '../components/Schedule.vue';

export default {
  data() {
    return {
      schedules: constants.schedules,
    }
  },
  components: { Schedule },
}
</script>

<style lang="sass" scoped>
@import '../styles/style.sass'

.background-block
  background-color: $color
  height: 250px
  width: 100%
  position: fixed

.card
  +shadow
  width: 80%
  max-width: 1000px
  background-color: white
  margin: auto
  position: relative
  border-radius: 20px
  top: 100px
  overflow: hidden
  margin-bottom: 25px
  +mobile
    width: 90%
    top: 50px

</style>
