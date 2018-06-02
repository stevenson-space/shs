<template>
  <div class="header">
    <div class="main" :style="{ backgroundColor: color }">
      <div class="switch-day">
        <font-awesome-icon :icon="leftArrow" class="arrow"/>
        Wednesday, March 21
      </div>

      <div class="countdown-circle">
        <img :src="logo" class="logo">
        <div class="countdown">32:57</div>
        <div class="schedule-type">Standard Schedule</div>
      </div>

      <div class="switch-day">
        <font-awesome-icon :icon="rightArrow" class="arrow"/>
        Friday, March 23
      </div>
    </div>

    <div class="schedule">
      <div class="range">9:26 – 10:13</div>
      <div class="period">Period 2</div>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

export default {
  props: {
    color: { type: String, required: true },
    logo: { type: String, required: true },
  },
  data() {
    return {
      rightArrow: faChevronRight,
      leftArrow: faChevronLeft,
    };
  },
  components: { FontAwesomeIcon },
}
</script>

<style lang="sass" scoped>
@import '../styles/style'

$circle-diameter: 275px
$logo-width: 100px

.header
  +shadow
  background-color: white
  text-align: center

  .main
    height: 325px
    display: flex
    align-items: center
    justify-content: space-between
    padding: 0 calc((100% - #{$content-width}) / 2)

    .countdown-circle
      background-color: white
      width: $circle-diameter
      height: $circle-diameter
      border-radius: $circle-diameter / 2

      .logo
        width: $logo-width
        margin: 0 ($circle-diameter - $logo-width) / 2
        margin-top: 15px
      
      .countdown
        font-size: 4em
        margin-top: -15px
      
    .switch-day
      color: white
      width: 100px
      margin: 0 15px

      .arrow
        font-size: 6em
        margin-bottom: 10px

  .schedule
    padding: 5px

    .range
      font-size: 1.25em

</style>
