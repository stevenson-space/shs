<template>
  <div
    ref="periods"
    class="periods"
    :class="{ 'tv-space': props.tvSpace }"
    :style="{ maxHeight: props.maxHeight || undefined }"
  >
    <template v-for="p in periodsComputed">
      <div v-if="p.isUpNextIndicator" :key="p.name" class="up-next-indicator">
        <div class="line">
          <span class="title">Up Next</span>
        </div>
      </div>
      <period
        v-else
        :key="p.name"
        ref="period"
        :class="p.name === 'Passing' ? 'passing' : 'period'"
        :start="p.start"
        :end="p.end"
        :period="p.name"
        :invert="!p.isCurrent"
        :force-mobile-layout="true"
        :tv-space="props.tvSpace"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, watch, useTemplateRef, withDefaults, ComponentPublicInstance } from 'vue';
import { isBellOnSchoolDay } from '@/utils/bell';
import useClockStore from '@/stores/clock';
import Period from '@/components/Period.vue';

const props = withDefaults(defineProps<{
  schedule?: Record<string, any> | null;
  maxHeight?: string | null;
  tvSpace?: boolean;
}>(), {
  schedule: null,
  maxHeight: null,
  tvSpace: false,
});

const clockStore = useClockStore();

const periods = useTemplateRef<HTMLDivElement>('periods');
const period = useTemplateRef<ComponentPublicInstance[]>('period');

const periodsComputed = computed(() => {
  const convertPeriods = ({ start, end, periods }: any, currentPeriodName: string | null) => periods.map((p: string, i: number) => ({
    name: p,
    start: start[i],
    end: end[i],
    isCurrent: currentPeriodName === p,
  }));

  // first we check if the `schedule` prop is specified and use that if so
  if (props.schedule) {
    return convertPeriods(props.schedule, null);
  }

  // otherwise we check if we can default to using today's schedule (i.e if it's a school day)
  if (isBellOnSchoolDay(clockStore.bell)) {
    const results = convertPeriods(clockStore.bell.schedule, clockStore.bell.period.name);

    // if we're displaying today's schedule and we're in a passing period,
    // we want to display an "Up Next" indicator between the two periods (so we manually add it in)
    if (clockStore.bell.period.name === '!Passing') {
      for (let i = 0; i < results.length; i++) {
        // find the period that ends right before the current passing period
        if (results[i].end === clockStore.bell.period.start) {
          // insert an object corresponding to the "Up Next" indicator right after it
          results.splice(i + 1, 0, { isUpNextIndicator: true });
        }
      }
    }
    return results;
  }

  return [];
});

watch(() => clockStore.bell, () => {
  // wait until periods rerender before scrolling
  nextTick(() => {
    scrollToCurrentPeriod();
  });
});

onMounted(() => {
  scrollToCurrentPeriod();
});

function scrollToCurrentPeriod(): void {
  // Get the html element for the current period if there is one
  // Use a separate counter for period refs since Up Next indicators don't occupy a ref slot
  let $period: ComponentPublicInstance | null = null;
  let periodRefIndex = 0;
  periodsComputed.value.forEach((p: any) => {
    if (p.isUpNextIndicator) return;
    if (p.isCurrent) {
      $period = period.value?.[periodRefIndex] ?? null;
    }
    periodRefIndex++;
  });

  if ($period) {
    const $container = periods.value;
    if (!$container) return;
    const containerHeight = $container.offsetHeight;
    const { offsetTop, offsetHeight } = ($period as any).$el;
    // Set the scroll so that the current period is centered
    $container.scrollTop = offsetTop - containerHeight / 2 + offsetHeight / 2;
  }
}

defineExpose({ scrollToCurrentPeriod });
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.periods
  padding: 8px
  display: flex
  flex-direction: column
  gap: 8px
  overflow-y: auto
  scrollbar-width: none
  -webkit-overflow-scrolling: touch
  position: relative

  &.tv-space
    padding: 2px
    gap: 6px

    .up-next-indicator
      .title
        background-color: var(--background)
        position: relative
        top: -10px
        padding: 0px 3px

      .line
        height: 6px
        margin: 4px auto 6px auto

  .up-next-indicator
    padding: 0px 13px

    .line
      width: 100%
      height: 13px
      margin: 10px auto 20px auto
      border-bottom: 1px solid grey
      text-align: center

    .title
      font-size: 15px
      background-color: var(--secondaryBackground)
      color: grey
      padding: 3px
</style>
