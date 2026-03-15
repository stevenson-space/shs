<template>
  <BaseCard :label="`Card ${id}`">
    <p class="title">Test Card {{ id }}</p>
    <p class="desc">Placeholder — replace with a real widget.</p>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from './BaseCard.vue'
const { id } = defineProps<{ id: number }>()
</script>

<style scoped>
@reference "tailwindcss";

.title {
  @apply m-0 text-[13px] font-semibold tracking-[-0.02em] text-primary;
}

.desc {
  @apply m-0 mt-1.5 text-[10px] leading-[1.45] text-secondary;
}
</style>
