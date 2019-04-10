<template>
  <div class="rounded-button" :class="{ inverse }" @click="$emit('click')">
    <font-awesome-icon v-if="icon" class="icon" :icon="icon"/>
    {{ text }}
  </div>
</template>

<script>
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";

export default {
  props: {
    text: { type: String, default: 'Button' },
    icon: { type: Object, default: null },
    inverse: { type: Boolean, default: false },
  },
  components: { FontAwesomeIcon },
}
</script>

<style lang="sass" scoped>

.rounded-button
  background-color: var(--color)
  color: white
  border-radius: 100px
  padding: 5px 10px
  cursor: pointer
  font-weight: bold
  user-select: none
  display: flex
  align-items: center
  &.inverse
    border: var(--color) 1.5px solid
    background-color: white
    color: var(--color)

  .icon
    font-size: .85em
    margin-right: 7px

</style>
