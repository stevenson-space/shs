<template>
  <div class="event">
    <div class="name" :class="direction">
      <div class="text">{{ name }}</div>
    </div>
    <div class="date">
      <span>{{ month }}</span>
      <span>{{ day }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    date: { type: Date, default: null },
    name: { type: String, default: '' },
    direction: {
      type: String,
      validator: (str) => str === 'left' || str === 'right',
      default: 'left',
    },
  },
  computed: {
    month(): string {
      if (this.date) {
        return this.date.toLocaleDateString('en-US', { month: 'short' });
      }
      return '';
    },
    day(): string {
      if (this.date) {
        return this.date.getDate();
      }
      return '';
    },
  },
});
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'
.event
  --circle-diameter: 36px
  --circle-radius: calc(var(--circle-diameter) / 2)
  width: 90%
  position: relative
  margin: auto
  display: flex
  align-items: center
  .name
    +shadow
    background-color: var(--color)
    width: calc(50% + var(--circle-radius))
    height: var(--circle-diameter)
    line-height: var(--circle-diameter)
    border-radius: var(--circle-radius)
    position: absolute
    text-align: center
    color: var(--background)
    font-size: .9em
    .text
      color: white
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
    &.right
      right: 0
      .text
        margin-left: calc(2*var(--circle-radius))
        margin-right: calc(var(--circle-radius)/3)
    &.left
      .text
        margin-right: calc(2*var(--circle-radius))
        margin-left: calc(var(--circle-radius)/3)
  .date
    +shadow
    --border-width: 2px
    font-size: .83em
    font-weight: bold
    line-height: 1.2em
    height: 45px
    width: 45px
    width: calc(var(--circle-diameter)*1.13)
    height: calc(var(--circle-diameter)*1.13)
    background-color: var(--background)
    border-radius: 50px
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    margin: auto
    position: relative
</style>
