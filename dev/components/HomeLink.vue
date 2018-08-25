<template>
  <router-link to="/" class="home" :class="{ invert }">
    <font-awesome-icon class="icon" :icon="faHome" fixed-width/>
    <span class="text">Home</span>
  </router-link>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

export default {
  props: {
    invert: { type: Boolean, default: true },
  },
  data() {
    return {
      faHome,
    }
  },
  components: { FontAwesomeIcon }
}
</script>

<style lang="sass" scoped>
@import '../styles/style.sass'

.home
  color: var(--color)
  border-radius: 100px
  padding: 7px
  transition: box-shadow .2s
  text-decoration: none
  display: flex
  align-items: center
  background-color: white
  z-index: 1
  transition: background-color .2s, color .2s

  .icon
    font-size: 1.5em

  .text
    display: block
    max-width: 0
    overflow: hidden
    // display: none
    transition: max-width .2s
    font-size: 1.1em
  
  &:hover
    +shadow

    .text
      max-width: 60px
      margin: 0 5px
  
  &.invert:hover
    color: white
    background-color: var(--color)

</style>

