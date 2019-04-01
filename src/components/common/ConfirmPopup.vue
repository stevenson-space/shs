<template>
  <popup :show="show" @close="$emit('cancel')">
    <slot/>
    <div class="buttons">
      <div class="button" @click="$emit('cancel')">{{ cancelText }}</div>
      <div class="button inverse" @click="$emit('ok')">{{ okText }}</div>
    </div>
  </popup>
</template>

<script>
import Popup from 'common/Popup.vue';

export default {
  props: {
    show: { type: Boolean, required: true },
    okText: { type: String, default: 'OK' },
    cancelText: { type: String, default: 'Cancel' },
  },
  components: {
    Popup,
  }
}
</script>

<style lang="sass" scoped>

.buttons
  display: flex
  justify-content: flex-end
  margin: 0 10px
  margin-bottom: 10px

  .button
    border: var(--color) 1.5px solid
    border-radius: 7px
    padding: 5px 15px
    margin: 0 10px
    // background-color: var(--color)
    // color: white
    // font-size: 1.1em
    font-weight: bold
    cursor: pointer
    color: var(--color)

    &.inverse
      // border: none
      background-color: var(--color)
      color: white

</style>

