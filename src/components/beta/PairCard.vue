<template>
  <div class="pair-card">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useSlots, onMounted } from 'vue'

const slots = useSlots()

onMounted(() => {
  const children = slots.default?.()
  if (!children) return

  const vnodes = children.filter(c => typeof c.type !== 'symbol')

  if (vnodes.length !== 2) {
    console.warn(`[PairCard] Expected exactly 2 children, got ${vnodes.length}.`)
  }

  if (vnodes.length === 2 && vnodes[0].type !== vnodes[1].type) {
    console.warn('[PairCard] Children should be the same component type.')
  }
})
</script>

<style scoped>
.pair-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
</style>
