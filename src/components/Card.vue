<template>
  <div ref="card" class="card" :class="{ shadow, border }" :style="style">
    <div ref="wrapper" class="wrapper" :style="wrapperStyle">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, useTemplateRef } from 'vue';

const { shadow = true, border = false, wrapperStyle = {}, ignoreStyleMutations = false } = defineProps<{
  shadow?: boolean
  border?: boolean
  wrapperStyle?: object
  ignoreStyleMutations?: boolean // whether to ignore content style mutations when deciding when to recalculate height
}>();

const emit = defineEmits<{ 'height-change': [] }>();

const wrapper = useTemplateRef<HTMLDivElement>('wrapper');

const height = ref(0);
const margin = 7;
const spanValue = ref(0);
let mutationObserver: MutationObserver | null = null;
let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

const style = computed(() => ({
  height: `${height.value}px`,
  margin: `${margin}px`,
  gridRow: `span ${spanValue.value}`,
}));

// call setHeight() manually from parent component whenever the content (slot) height changes
// and the change is undetectable by MutationObserver
function setHeight(): void {
  if (wrapper.value) {
    height.value = wrapper.value.offsetHeight;
    // Adjust the number of rows the card spans (necessary for the masonry layout to work)
    spanValue.value = Math.ceil((height.value + margin * 2) / 5); // 5 is row height
    emit('height-change');
  }
}

function debounceSetHeight(): void {
  clearTimeout(debounceTimeout ?? undefined);
  debounceTimeout = setTimeout(() => setHeight(), 250);
}

onMounted(() => {
  setHeight();
  // for some reason, card doesn't open to full height on first load
  setTimeout(setHeight, 250);
  window.addEventListener('resize', debounceSetHeight);
  // The MutationObserver will detect when any children or descendants are added
  // and when any CSS is changed
  mutationObserver = new MutationObserver(setHeight);
  mutationObserver.observe(wrapper.value!, {
    attributes: true,
    childList: true,
    subtree: true,
    attributeFilter: ignoreStyleMutations ? [] : ['style'],
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', debounceSetHeight);
  mutationObserver?.disconnect();
});

defineExpose({ setHeight });
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'
.card
  background-color: var(--secondaryBackground) !important
  border-radius: 15px
  position: relative
  transition: height .3s
  overflow: hidden
  &.shadow
    +shadow-light
  &.border
    border: #999 1px solid

  .wrapper
    overflow: hidden
</style>
