<template>
  <div class="what-is-this" @click.stop="">
    <div class="icon">
      <font-awesome-icon :icon="icons.faQuestionCircle" fixed-width/>
    </div>

    <div class="info-bubble">
      Notifies you when the timer finishes even if you're on a different tab/app (requires permission)
      <slot/>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

export default {
  data() {
    return {
      icons: {
        faQuestionCircle
      }
    }
  },
  methods: {
  },
  components: { FontAwesomeIcon }
}
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.what-is-this
  display: inline-block
  cursor: default
  position: relative

  .icon
    position: relative
    +hover-darken-background
    color: var(--color)
    font-size: 1.05em
    padding: 2px


  .info-bubble
    font-size: .85em
    position: fixed
    width: 350px
    background-color: white
    transform: translateX(-50%) translateY(-120%)
    border-radius: 10px
    padding: 10px
    +shadow
    opacity: 0
    visibility: hidden
    transition: opacity .3s, transform .3s
    font-weight: bold
    color: #333
    +mobile
      transform: translateY(-120%)
      left: 10px
      width: calc(100vw - 40px)

  &:hover
    .info-bubble
      visibility: visible
      opacity: 1
      transform: translateX(-50%) translateY(-145%)
      +mobile
        transform: translateY(-145%)

</style>
