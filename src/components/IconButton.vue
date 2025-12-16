<template>
  <button class="icon-btn" type="button" :disabled="disabled" @click="onClick">
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click'],
  methods: {
    onClick(event) {
      this.$emit('click', event);
    },
  },
};
</script>

<style lang="sass" scoped>
.icon-btn
  display: flex
  align-items: center
  justify-content: center
  width: 32px
  height: 32px
  background: linear-gradient(135deg, rgba(128, 128, 128, 0.06), rgba(128, 128, 128, 0.1))
  border: 1px solid rgba(128, 128, 128, 0.12)
  border-radius: 8px
  color: var(--primary)
  cursor: pointer
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1)
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05)

  svg
    transition: all 0.3s ease
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))

  &:hover
    background: linear-gradient(135deg, rgba(128, 128, 128, 0.12), rgba(128, 128, 128, 0.16))
    border-color: var(--accent)
    transform: translateY(-2px)
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1)

    svg
      transform: scale(1.05)
      color: var(--accent)

  &:active
    transform: translateY(0)
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05)

  &:disabled
    opacity: 0.3
    cursor: not-allowed
    pointer-events: none

    &:hover
      background: linear-gradient(135deg, rgba(128, 128, 128, 0.06), rgba(128, 128, 128, 0.1))
      border-color: rgba(128, 128, 128, 0.12)
      transform: none
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05)

      svg
        transform: none
        color: var(--primary)
</style>
