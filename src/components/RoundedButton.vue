<template>
  <div class="rounded-button" :class="{ invert, circular, showColor }" @click="$emit('click')">
    <font-awesome-icon v-if="icon" class="icon" :icon="icon" />
    {{ text }}
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';

export default {
  components: { FontAwesomeIcon },
  props: {
    text: { type: String, default: 'Button' },
    icon: { type: Object, default: null },
    invert: { type: Boolean, default: false },
    circular: { type: Boolean, default: true },
    showColor: { type: Boolean, default: true },
  },
};
</script>

<style lang="sass" scoped>

.rounded-button
  $border-width: 1.5px
  border-radius: 7px
  padding: 5px 15px
  cursor: pointer
  font-weight: bold
  user-select: none
  display: flex
  align-items: center
  justify-content: center
  border: var(--secondary) $border-width solid
  background-color: var(--background)
  color: var(--secondary)
  &.showColor
    border: var(--color) $border-width solid
    background-color: var(--background)
    color: var(--color)
  &.invert
    background-color: var(--color)
    color: var(--background)
    border: none
    padding: (5px + $border-width) (15px + $border-width)
  &.circular
    border-radius: 100px
    padding: 5px 10px

  .icon
    font-size: .85em
    margin-right: 7px

</style>
