<template>
  <div class="event">
    <div class="name" :class="direction" :style="{ backgroundColor: color }">
      <span>{{ name }}</span>
    </div>
    <div class="date" :style="{ borderColor: color }">
      <span>{{ month }}</span>
      <span>{{ day }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    color: { type: String, required: true },
    date: { type: Date, required: true },
    name: { type: String, required: true },
    direction: {
      type: String,
      validator: str => str === 'left' || str === 'right'
    }
  },
  computed: {
    month() {
      return this.date.toLocaleDateString('en-US', { month: 'short' });
    },
    day() {
      return this.date.getDate();
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../styles/style.sass';

.event
  --circle-diameter: 35px
  --circle-radius: calc(var(--circle-diameter) / 2)
  width: 90%
  position: relative
  margin: auto

  .name
    width: calc(50% + var(--circle-radius))
    height: var(--circle-diameter)
    line-height: var(--circle-diameter)
    border-radius: calc(var(--circle-radius))
    position: absolute
    text-align: center
    color: white
    font-size: .9em
    +shadow

    &.right
      right: 0
      span
        margin-left: var(--circle-radius)
    
    &.left
      span
        margin-right: var(--circle-radius)

  .date
    --border-width: 2px
    font-size: .7em
    font-weight: bold
    line-height: 1.2em
    width: calc(var(--circle-diameter) - var(--border-width) * 2)
    height: calc(var(--circle-diameter) - var(--border-width) * 2)
    background-color: white
    border-radius: var(--circle-radius)
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    border: var(--border-width) solid
    margin: auto
    position: relative
    // color: #333
</style>
