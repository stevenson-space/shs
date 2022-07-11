<template>
  <div class="checkbox-container" @click="$emit('update:modelValue', !modelValue)">
    <div class="checkbox" :class="{ checked: modelValue }">
      <font-awesome-icon class="check" :icon="faCheck" />
    </div>

    <div v-if="$slots.default" class="label" :style="{ fontSize: labelSize }">
      <slot />
    </div>
  </div>
</template>

<script>
import { faCheck } from '@fortawesome/free-solid-svg-icons';

export default {
  props: {
    modelValue: { type: Boolean, required: true },
    labelSize: { type: String, default: '.85em' },
  },
  data() {
    return {
      faCheck,
    };
  },
};
</script>

<style lang="sass" scoped>

.checkbox-container
  display: flex
  align-items: center
  margin-top: 15px
  cursor: pointer
  justify-content: center
  user-select: none
  -webkit-tap-highlight-color: transparent

  .checkbox
    color: var(--background)
    border: var(--color) 1.5px solid
    box-sizing: border-box
    width: 20px
    height: 20px
    display: flex
    justify-content: center
    align-items: center
    border-radius: 5px
    font-size: .8em
    transition: border-width .2s
    cursor: pointer
    min-width: 20px
    position: relative

    .check
      transform: scale(0)
      transition: transform .2s
      position: absolute

    &.checked
      border-width: 10px

      .check
        transform: scale(1)

  .label
    margin-left: 10px

</style>
