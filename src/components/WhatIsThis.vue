<template>
  <div class="what-is-this" @click.stop="">
    <div class="icon">
      <font-awesome-icon :icon="icon" fixed-width />
    </div>

    <div class="info-bubble">
      <slot />
    </div>
  </div>
</template>

<script>
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

export default {
  props: {
    icon: { type: Object, required: false, default: () => faQuestionCircle },
  },
};
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.what-is-this
  display: inline-block
  cursor: default
  position: relative

  .icon
    position: relative
    +hover-darken-background
    color: var(--accent)
    font-size: 1.05em
    padding: 2px

  .info-bubble
    font-size: .85em
    position: fixed
    width: 250px
    background-color: var(--background)
    transform: translateX(-50%) translateY(-120%)
    border-radius: 10px
    padding: 10px
    +shadow
    opacity: 0
    visibility: hidden
    transition: opacity .3s, transform .3s
    font-weight: bold
    color: var(--secondary)
    +mobile
      transform: translateY(-120%)
      left: 10px
      width: calc(100vw - 40px)

  &:hover
    .info-bubble
      z-index: 1
      visibility: visible
      opacity: 1
      transform: translateX(-50%) translateY(-145%)
      +mobile
        transform: translateY(-145%)
</style>
