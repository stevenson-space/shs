<template>
  <div class="card-container">
    <component
      :is="cardComponent(card.id)"
      v-for="(card, i) in visibleCards"
      :key="card.id"
      :position="i + 1"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import TestCard from './TestCard.vue'

export interface CardConfig {
  id: string
  visible: boolean
}

const { cards } = defineProps<{
  cards: CardConfig[]
}>()

const visibleCards = computed(() => cards.filter(c => c.visible))

function cardComponent(_id: string): Component {
  return TestCard
}
</script>

<style scoped>
@reference "tailwindcss";

.card-container {
  @apply grid items-start gap-2 mx-auto px-3.5 pt-[18px] pb-6;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  max-width: 960px;
}
</style>
