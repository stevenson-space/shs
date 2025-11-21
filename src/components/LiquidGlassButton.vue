<template>
  <button type="button" class="liquid-glass-btn" @click="$emit('click')">
    <slot />
  </button>
</template>

<script>
export default {
  emits: ['click'],
};
</script>

<style lang="sass" scoped>
.liquid-glass-btn
  padding: 10px 24px
  margin: 0 auto 12px
  border: 1px solid rgba(128, 128, 128, 0.3)
  border-radius: 50px
  background: rgba(255, 255, 255, 0.2)
  backdrop-filter: blur(10px)
  -webkit-backdrop-filter: blur(10px)
  color: var(--secondary)
  font-size: 11px
  font-weight: 600
  text-transform: uppercase
  letter-spacing: 0.5px
  cursor: pointer
  display: inline-flex
  align-items: center
  justify-content: center
  transition: all 0.2s ease
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
  width: auto

  &:hover
    background: rgba(255, 255, 255, 0.3)
    transform: translateY(-1px)
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15)

  &:active
    transform: translateY(0)
</style>
