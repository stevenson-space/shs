<template>
  <button class="icon-btn" @click="$emit('click')">
    <slot />
  </button>
</template>

<script>
export default {
  emits: ['click'],
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
      transform: scale(1.1)
      color: var(--accent)

  &:active
    transform: translateY(0)
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05)
</style>
