<template>
  <div class="popup" v-if="show" @click="$emit('close')">
    <div class="content" @click.stop="">
      <slot/>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: { type: Boolean, required: true },
  }
}
</script>

<style lang="sass" scoped>

.popup
  background-color: rgba(0, 0, 0, .65)
  position: fixed
  top: 0
  left: 0
  width: 100vw
  height: 100vh
  display: flex
  justify-content: center
  align-items: center
  z-index: 10

  .content
    background-color: white
    border-radius: 15px
    margin: 0 10px

</style>

