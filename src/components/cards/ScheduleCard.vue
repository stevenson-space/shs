<template>
  <card
    v-if="schedule || clockStore.bell?.isSchoolDay"
    class="card"
    :ignoreStyleMutations="true"
    @height-change="onHeightChange"
  >
    <div v-if="title" class="title">{{ title }}</div>
    <ScrollablePeriodList
      ref="periodList"
      :schedule="schedule"
      :maxHeight="maxHeight"
    />
    <slot />
  </card>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue';
import useClockStore from '@/stores/clock';
import ScrollablePeriodList from '@/components/ScrollablePeriodList.vue';
import Card from '@/components/Card.vue';

const { schedule = null, title = 'Schedule', maxHeight = null } = defineProps<{
  schedule?: Record<string, any> | null;
  title?: string;
  maxHeight?: string | null;
}>();

const clockStore = useClockStore();

const periodList = useTemplateRef<{ scrollToCurrentPeriod: () => void }>('periodList');

function onHeightChange(): void {
  periodList.value?.scrollToCurrentPeriod();
}
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.card
  padding: 0 8px 6px

  .title
    text-align: center
    font-size: 1.5em
    margin: 15px 0
</style>
