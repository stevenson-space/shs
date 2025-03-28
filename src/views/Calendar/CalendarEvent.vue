<template>
  <div class="calendar-event" :class="{ invert }">
    <p class="text">{{ text }}</p>
  </div>
</template>

<script>
export default {
  props: {
    text: { type: String, required: true },
    invert: { type: Boolean, default: false },
  },
};
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.calendar-event
  font-size: .8em
  text-align: center
  border-radius: 20px
  width: calc(100% - 10px)
  margin: 0 auto
  border: var(--color) 1px solid
  color: var(--color)
  margin-bottom: 10px
  font-weight: bold
  max-width: 250px

  &.invert
    background-color: var(--color)
    color: var(--background)

  .text
    margin: 3px 5px
    min-width: 80px

</style>
