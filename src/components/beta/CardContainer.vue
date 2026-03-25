<template>
  <div ref="container" class="card-container">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useMasonry } from '@/composables/useMasonry'

const container = useTemplateRef<HTMLDivElement>('container')
useMasonry(container)
</script>

<style scoped>
@reference "@/styles/tailwind.css";

.card-container {
  @apply grid items-start mx-auto px-3.5 pt-[18px] pb-6;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  grid-auto-rows: 5px;
  column-gap: 8px;
  max-width: 960px;
}
</style>
