<template>
  <draggable
    v-if="modelValue"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @end="$emit('end', $event)"
    item-key="id"
    class="card-container"
    handle=".drag-handle"
  >
    <template #item="{ element }">
      <slot name="item" :element="element" />
    </template>
  </draggable>
  <div v-else class="card-container">
    <slot />
  </div>
</template>

<script setup lang="ts">
import draggable from "vuedraggable";

defineProps<{
  modelValue?: any[];
}>();

defineEmits(['update:modelValue', 'end']);
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.card-container
  max-width: $content-width
  margin: 8px auto

  // the following creates lots of rows, each with 5px of height
  // the card will then decide how many rows to span based on its height
  // this allows for arbitrarily tall cards while still filling all the space (masonry layout)
  display: grid
  padding: 0 5px
  grid-auto-rows: 5px

  :deep(.sortable-ghost)
    opacity: 1.0

  :deep(.sortable-drag)
    opacity: 0.7

  grid-template-columns: 1fr
  +tablet-small
    grid-template-columns: 1fr 1fr
  +desktop
    grid-template-columns: 1fr 1fr 1fr

</style>
