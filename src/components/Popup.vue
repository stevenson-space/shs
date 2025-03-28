<template>
  <div v-if="show" class="popup" @click="$emit('close')">
    <div class="content" @click.stop="">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: { type: Boolean, required: true },
  },
};
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.popup
  background-color: rgba(0, 0, 0, .65)
  position: fixed
  top: -50px
  left: 0
  width: 100vw
  height: calc(100vh + 50px)
  display: flex
  justify-content: center
  align-items: center
  z-index: 100
  +animate-fade-up
  .content
    background-color: var(--background)
    border-radius: 15px
    margin: 0 10px

</style>
