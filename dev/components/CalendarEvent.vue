<template>
  <div class="event" :class="{ invert }">
    <p class="text">{{ text }}</p>
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
  font-size: .75em
  text-align: center
  border-radius: 100px
  // padding: 3px 8px
  margin: 0 5px
  border: $color 1px solid
  color: $color
  margin-bottom: 10px
  // max-width: 160px
  // width: 80%
  // +shadow
  // text-overflow: ellipsis

  &.invert
    background-color: $color
    color: white
    +shadow

  .text
    // display: block
    margin: 3px 10px
    min-width: 80px

</style>
