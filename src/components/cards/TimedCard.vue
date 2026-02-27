<template>
<!-- a template for making cards show up on custom time intervals -->
  <card v-show="showCard">
    <slot />
  </card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Card from '@/components/Card.vue';

const { startTime, endTime } = defineProps<{
  startTime: string
  endTime: string
}>()

const showCard = computed(() => {
  const [start, end] = [
    new Date(startTime).getTime(),
    new Date(endTime).getTime(),
  ];
  const today = new Date().getTime();
  return today > start && today < end;
});
</script>
