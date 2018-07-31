<template>
  <div class="event" :class="{ invert }">
    {{ text }}
  </div>
</template>

<script>
export default {
  props: {
    text: { type: String, required: true },
    invert: { type: Boolean, default: false },
  }
}
</script>

<style lang="sass" scoped>
@import '../styles/style.sass'

.event
  font-size: .8em
  text-align: center
  border-radius: 100px
  padding: 3px 5px
  margin: 0 5px
  border: $color 1px solid
  color: $color
  // +shadow

  &.invert
    background-color: $color
    color: white
    +shadow

</style>
