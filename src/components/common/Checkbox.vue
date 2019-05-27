<template>
  <div class="checkbox-container" @click="$emit('input', !value)">
    <div class="checkbox" :class="{ checked: value }">
      <font-awesome-icon class="check" :icon="faCheck"/>
    </div>

    <div class="label" v-if="$slots.default">
      <slot/>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
import { faCheck } from '@fortawesome/free-solid-svg-icons';

export default {
  props: {
    value: { type: Boolean, required: true },
  },
  data() {
    return {
      faCheck,
    }
  },
  components: { FontAwesomeIcon },
}
</script>

<style lang="sass" scoped>

.checkbox-container
  display: flex
  align-items: center
  margin-top: 15px
  cursor: pointer
  justify-content: center
  user-select: none

  .checkbox
    color: white
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
    font-size: .85em

</style>
