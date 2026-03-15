<template>
  <BaseCard :label="`Card ${position}`">
    <h3 class="title">Test Card {{ position }}</h3>
    <p class="desc">Placeholder — replace with a real widget.</p>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from './BaseCard.vue'
const { position } = defineProps<{ position: number }>()
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
