<template>
  <div ref="root" class="scroll-selector" :style="{ height: `${optionHeight * (2 * numOptionsAbove + 1)}px`, fontSize }">
    <!-- eslint-disable-next-line vue/require-v-for-key vue/no-unused-vars-->
    <div v-for="_ in Array(Math.max(0, Math.floor(numOptionsAbove)))" :style="{ height: `${optionHeight}px`}" />
    <div
      v-for="option in options"
      ref="option"
      :key="option"
      class="option"
      :class="{ selected: option === modelValue }"
      @click="$emit('update:modelValue', option)"
    >
      {{ option }}
    </div>

    <!-- eslint-disable-next-line vue/require-v-for-key vue/no-unused-vars-->
    <div v-for="_ in Array(Math.max(0, Math.floor(numOptionsAbove)))" :style="{ height: `${optionHeight}px`}" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick, useTemplateRef } from 'vue';

const { options, modelValue, numOptionsAbove = 1, fontSize = '1em' } = defineProps<{
  options: unknown[];
  modelValue: string;
  numOptionsAbove?: number;
  fontSize?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: unknown];
}>();

const optionHeight = ref(0);

const root = useTemplateRef<HTMLElement>('root');
const option = useTemplateRef<HTMLElement[]>('option');

let scrollHandler: (() => void) | null = null;

watch(() => modelValue, () => {
  scrollToSelected();
});

watch(() => fontSize, () => {
  nextTick(setOptionHeight);
});

watch(() => options, () => {
  nextTick(setOptionHeight);
});

onMounted(() => {
  setOptionHeight();
  setTimeout(setOptionHeight, 100); // just in case

  nextTick(scrollToSelected);

  let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
  scrollHandler = () => {
    // wait until user is finished scrolling before selecting a choice (debounce)
    if (!root.value) return;
    clearTimeout(scrollTimeout!);
    scrollTimeout = setTimeout(() => {
      if (!root.value || optionHeight.value <= 0 || options.length === 0) return;
      const selectedIndex = Math.min(
        Math.max(Math.round(root.value.scrollTop / optionHeight.value), 0),
        options.length - 1,
      );
      emit('update:modelValue', options[selectedIndex]);
      scrollToSelected();
    }, 100);
  };
  root.value?.addEventListener('scroll', scrollHandler);
});

onBeforeUnmount(() => {
  if (scrollHandler) root.value?.removeEventListener('scroll', scrollHandler);
});

function scrollToSelected(): void {
  nextTick(() => { // wait until this.value is updated if necessary
    if (!root.value) return;
    const index = (options as string[]).indexOf(modelValue);
    if (index > -1 && option.value?.[index]) {
      root.value.scroll({
        top: option.value[index].offsetTop - (optionHeight.value * numOptionsAbove),
        behavior: 'smooth',
      });
    }
  });
}

function setOptionHeight(): void {
  if (!option.value?.[0]) return;
  optionHeight.value = option.value[0].getBoundingClientRect().height;
}
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.scroll-selector
  height: 90px
  overflow: auto
  text-align: center
  position: relative
  +no-scrollbar
  -webkit-overflow-scrolling: touch

  .option
    color: #bbb
    cursor: pointer
    padding: 0 5px

    &.selected
      color: var(--primary)
      // font-weight: bold

</style>
