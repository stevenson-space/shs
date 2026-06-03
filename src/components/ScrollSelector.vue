<template>
  <div
    ref="root"
    class="scroll-selector"
    :style="{ height: `${optionHeight * (2 * numOptionsAbove + 1)}px`, fontSize }"
  >
    <!-- eslint-disable-next-line vue/require-v-for-key vue/no-unused-vars-->
    <div
      v-for="_ in Array(Math.max(0, Math.floor(numOptionsAbove)))"
      :style="{ height: `${optionHeight}px` }"
    />
    <div
      v-for="(opt, i) in repeatedOptions"
      ref="option"
      :key="`${String(opt)}-${i}`"
      class="option"
      :class="{ selected: opt === modelValue }"
      @click="$emit('update:modelValue', opt)"
    >
      {{ opt }}
    </div>

    <!-- eslint-disable-next-line vue/require-v-for-key vue/no-unused-vars-->
    <div
      v-for="_ in Array(Math.max(0, Math.floor(numOptionsAbove)))"
      :style="{ height: `${optionHeight}px` }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick, useTemplateRef, computed } from "vue";

//numOptionsAbove is how many options are visible above and below the selected option (default 1, so 3 options total)
const {
  options,
  modelValue,
  numOptionsAbove = 1,
  fontSize = "1em",
  infinite = false,
} = defineProps<{
  options: unknown[];
  modelValue: string;
  numOptionsAbove?: number;
  fontSize?: string;
  infinite?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: unknown];
}>();

const optionHeight = ref(0);

const repeatedOptions = computed(() => {
  if (!infinite) return options as unknown[];
  return ([] as unknown[]).concat(options as unknown[], options as unknown[], options as unknown[]);
});

const root = useTemplateRef<HTMLElement>("root");
const option = useTemplateRef<HTMLElement[]>("option");

let scrollHandler: (() => void) | null = null;

watch(
  () => modelValue,
  () => {
    scrollToSelected();
  },
);

watch(
  () => fontSize,
  () => {
    nextTick(setOptionHeight);
  },
);

watch(
  () => options,
  () => {
    nextTick(setOptionHeight);
  },
);

onMounted(() => {
  setOptionHeight();
  setTimeout(setOptionHeight, 100); // just in case

  // after height is measured, jump to middle copy in infinite mode to avoid blank edges
  nextTick(() => {
    // give DOM a moment to render options
    setTimeout(() => {
      if (infinite && root.value && optionHeight.value > 0 && options.length > 0) {
        // position to the start of the middle copy
        root.value.scrollTop = options.length * optionHeight.value;
      }
      scrollToSelected(false);
    }, 0);
  });

  let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
  scrollHandler = () => {
    // wait until user is finished scrolling before selecting a choice (debounce)
    if (!root.value) return;
    clearTimeout(scrollTimeout!);
    scrollTimeout = setTimeout(() => {
      if (!root.value || optionHeight.value <= 0 || options.length === 0) return;
      const rawIndex = Math.round(root.value.scrollTop / optionHeight.value);
      if (infinite) {
        const baseIndex = ((rawIndex % options.length) + options.length) % options.length;
        emit("update:modelValue", options[baseIndex]);

        // rebalance scroll position to the middle copy when nearing ends
        const half = Math.floor(options.length / 2);
        if (rawIndex < half) {
          root.value.scrollTop = root.value.scrollTop + options.length * optionHeight.value;
        } else if (rawIndex >= options.length * 2 + half) {
          root.value.scrollTop = root.value.scrollTop - options.length * optionHeight.value;
        }
      } else {
        const selectedIndex = Math.min(Math.max(rawIndex, 0), options.length - 1);
        emit("update:modelValue", options[selectedIndex]);
      }

      scrollToSelected();
    }, 100);
  };
  root.value?.addEventListener("scroll", scrollHandler);
});

onBeforeUnmount(() => {
  if (scrollHandler) root.value?.removeEventListener("scroll", scrollHandler);
});

function scrollToSelected(smooth = true): void {
  nextTick(() => {
    if (!root.value) return;
    const index = (options as string[]).indexOf(modelValue);
    if (index > -1) {
      let targetIndex = index;
      if (infinite && options.length > 0) targetIndex = index + options.length; // use middle copy
      if (option.value?.[targetIndex]) {
        const top = option.value[targetIndex].offsetTop - optionHeight.value * numOptionsAbove;
        if (smooth) {
          root.value.scroll({ top, behavior: "smooth" });
        } else {
          root.value.scrollTop = top;
        }
      }
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
