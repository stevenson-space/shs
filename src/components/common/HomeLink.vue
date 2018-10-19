<template>
  <div v-hammer:tap="goHome">
    <router-link to="/" class="home" :class="{ invert }" event="">
      <font-awesome-icon class="icon" :icon="faHome" fixed-width/>
      <span class="text">Home</span>
    </router-link>
  </div>
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
  methods: {
    goHome(e) {
      if (e.pointerType === 'touch') {
        // if touched, show animation first before going home (computers will see animation on hover)
        setTimeout(() => {
          this.$router.push('/');
        }, 200);
      } else {
        this.$router.push('/');
      }
    }
  },
  components: { FontAwesomeIcon }
}
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

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

