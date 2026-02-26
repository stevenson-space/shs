<template>
  <div class="rounded-button" :class="{ invert, circular, showColor }">
    <font-awesome-icon v-if="icon" class="icon" :icon="icon" />
    {{ text }}
  </div>
</template>

<script setup lang="ts">
const { text = 'Button', icon = null, invert = false, circular = true, showColor = true } = defineProps<{
  text?: string
  icon?: object | null
  invert?: boolean
  circular?: boolean
  showColor?: boolean
}>();
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
    border: var(--accent) $border-width solid
    background-color: var(--background)
    color: var(--accent)
  &.invert
    background-color: var(--accent)
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
