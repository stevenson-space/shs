<template>
  <div ref="card" class="card" :class="{ shadow, border }" :style="style">
    <div class="card-controls" v-if="cardId">
      <div class="drag-handle" title="Drag to reorder">
        <font-awesome-icon :icon="faGripVertical" style="pointer-events: none" />
      </div>
      <div class="collapse-btn" @click.stop="toggleCollapse" title="Toggle collapse">
        <font-awesome-icon :icon="isCollapsed ? faChevronDown : faChevronUp" style="pointer-events: none" />
      </div>
    </div>
    <div class="collapsed-title" v-if="isCollapsed">
      {{ cardTitle || cardId || 'Card' }}
    </div>
    <div ref="wrapper" class="wrapper" :class="{ 'with-controls': cardId }" :style="wrapperStyle" v-show="!isCollapsed">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, useTemplateRef, watch } from 'vue';
import { faGripVertical, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import useUserSettings from '@/stores/user-settings';

const {
  shadow = true,
  border = false,
  wrapperStyle = {},
  ignoreStyleMutations = false,
  cardId,
  cardTitle,
} = defineProps<{
  shadow?: boolean
  border?: boolean
  wrapperStyle?: object
  ignoreStyleMutations?: boolean // whether to ignore content style mutations when deciding when to recalculate height
  cardId?: string
  cardTitle?: string
}>();

const emit = defineEmits<{ 'height-change': [] }>();

const wrapper = useTemplateRef<HTMLDivElement>('wrapper');
const userSettings = useUserSettings();

const height = ref(0);
const margin = 7;
const spanValue = ref(0);
let mutationObserver: MutationObserver | null = null;
let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

const isCollapsed = computed(() => cardId ? !!userSettings.collapsedCards[cardId] : false);

function toggleCollapse() {
  if (cardId) {
    userSettings.setCardCollapsed(cardId, !isCollapsed.value);
    setTimeout(setHeight, 0);
  }
}

watch(isCollapsed, () => {
  setTimeout(setHeight, 0);
});

const style = computed(() => ({
  height: `${height.value}px`,
  margin: `${margin}px`,
  gridRow: `span ${spanValue.value}`,
}));

// call setHeight() manually from parent component whenever the content (slot) height changes
// and the change is undetectable by MutationObserver
function setHeight(): void {
  if (isCollapsed.value) {
    height.value = 40; // Fixed height for collapsed state
  } else if (wrapper.value) {
    height.value = wrapper.value.offsetHeight;
  }
  
  if (height.value > 0 || isCollapsed.value) {
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
  clearTimeout(debounceTimeout ?? undefined);
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
    &.with-controls
      padding-top: 20px

  .card-controls
    position: absolute
    top: 8px
    right: 8px
    display: flex
    gap: 8px
    z-index: 10
    color: var(--primary)
    opacity: 0.5
    transition: opacity 0.2s
    
    &:hover
      opacity: 1

    .drag-handle, .collapse-btn
      cursor: pointer
      padding: 4px

    .drag-handle
      cursor: grab
      &:active
        cursor: grabbing

  .collapsed-title
    padding: 10px 15px
    font-weight: bold
    color: var(--primary)
    font-size: 16px
    height: 40px
    box-sizing: border-box
</style>
