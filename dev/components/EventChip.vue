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
    date: { type: Date, default: null },
    name: { type: String, default: '' },
    direction: {
      type: String,
      validator: str => str === 'left' || str === 'right'
    }
  },
  computed: {
    month() {
      if (this.date) {
        return this.date.toLocaleDateString('en-US', { month: 'short' });
      }
      return '';
    },
    day() {
      if (this.date) {
        return this.date.getDate();
      }
      return '';
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
    border-radius: var(--circle-radius)
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
