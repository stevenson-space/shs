<template>
  <div class="navigation">
    <font-awesome-icon class="icon" :icon="icons.faChevronLeft" @click="$emit('previous-month')"/>

    <home-link class="hidden"/>

    <div class="text">
      <div class="month">{{ month }}</div>
      <div class="year">{{ year }}</div>
    </div>

    <home-link/>

    <font-awesome-icon class="icon" :icon="icons.faChevronRight" @click="$emit('next-month')"/>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import HomeLink from '../components/HomeLink.vue';

export default {
  props: {
    month: { type: String, required: true },
    year: { type: Number, required: true },
  },
  data() {
    return {
      icons: {
        faChevronLeft,
        faChevronRight,
      },
    };
  },
  components: { FontAwesomeIcon, HomeLink },
}
</script>

<style lang="sass" scoped>
@import '../styles/style.sass'

.hidden
  visibility: hidden

.navigation
  display: flex
  align-items: center
  justify-content: space-between
  color: $color
  // justify-content: space-around
  // border-bottom: $border
  // +shadow
  // background-color: $color
  // color: white
  // border-radius: 0 0 35px 35px

  .icon
    cursor: pointer
    width: 50px
    font-size: 1.5em
    // background-color: $color
    // height: 100%
    // color: $color

  .text
    text-align: center
    flex-grow: 1
    // color: #333
    // color: white
    // color: $color
    background-color: white
    // background-color: $color
    // border-radius: 0 0 100px 100px
    // border-radius: 100px 100px 0 0
    // border-radius: 25px
    font-weight: bold
    padding: 5px 15px
    // min-width: 30%
    // +shadow
    // height: 100%
    user-select: none

    .month
      font-size: 1.2em
      letter-spacing: 2px
      
    .year
      font-size: .7em
      // font-weight: bold

</style>
