<template>
  <div class="dropdown" tabindex="-1" :class="{ selected: open }" @blur="closeDropdown">
    <div class="select-option" :style="dropdownStyle" @click="toggleDropdown">
      <span>{{ options[modelValue] }}</span>
      <font-awesome-icon
        class="down-icon"
        :icon="faCaretDown"
        :style="iconStyle"
      />
    </div>
      <stagger-animation
        ref="staggerAnimation"
        :direction="direction"
        :number-of-slots="formattedOptions.length"
        :align="align"
      >
      <template v-if="open">
          <div
            v-for="(option, index) in formattedOptions"
            :key="option"
            ref="option"
            class="option"
            :style="option.style"
            :data-index="index"
            @click="selectOption(option.index)"
          >
            {{ option.name }}
        </div>
        </template>
      </stagger-animation>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import StaggerAnimation from '@/components/StaggerAnimation.vue';

const { options, modelValue, showSelectedAsOption = true, align = 'right', direction = 'down' } = defineProps<{
  options: string[];
  modelValue: number;
  showSelectedAsOption?: boolean;
  align?: 'left' | 'right' | 'center';
  direction?: 'up' | 'down';
}>();

const emit = defineEmits<{
  'update:modelValue': [value: number];
}>();

const open = ref(false); // open is true even when dropdown is partially open, false only when dropdown is completely closed
const arrowRotateAmount = ref(0);
let optionShifts: number[] = [];

// if the initial index is out of bounds, choose the first index by default
if (modelValue < 0 || modelValue >= options.length) {
  emit('update:modelValue', 0);
}

const remainingOptions = computed((): string[] => {
  const remaining = options.slice(0);
  remaining.splice(modelValue, 1);
  return remaining;
});

const formattedOptions = computed((): { name: string; style: any; index: number }[] => {
  const opts = (showSelectedAsOption ? options : remainingOptions.value) as string[];
  return opts.map((option) => {
    const style = {} as any;
    if (align === 'center') {
      style.left = '50%';
      style.transform = 'translateX(-50%)';
    } else {
      style[align] = 0;
    }

    return {
      name: option,
      style,
      index: options.indexOf(option), // if we're using remainingOptions, the original indexes are lost
    };
  });
});

const dropdownStyle = computed((): { transition: string; zIndex: number } => {
  return {
    transition: 'box-shadow .2s, border-color .2s',
    zIndex: options.length + 5,
  };
});

const iconStyle = computed((): { transition: string; transform: string } => {
  return {
    transition: 'transform .2s',
    transform: `rotate(${arrowRotateAmount.value}deg)`,
  };
});

watch(() => options, (): void => {
  optionShifts = Array(options.length).fill(0);
});

watch(() => direction, (): void => {
  closeDropdown();
  arrowRotateAmount.value = direction === 'down' ? 0 : 180;
});

function toggleDropdown(): void {
  arrowRotateAmount.value += (arrowRotateAmount.value >= 180) ? -180 : 180;
  open.value = !open.value;
}

function openDropdown(): void {
  if (!open.value) {
    toggleDropdown();
  }
}

function closeDropdown(): void {
  if (open.value) {
    toggleDropdown();
  }
}

function selectOption(optionIndex: number): void {
  if (open.value) {
    closeDropdown();
    // allow animation to start before emitting event (event may cause blocking calculations that slow down animation)
    setTimeout(() => {
      emit('update:modelValue', optionIndex);
    }, 100);
  }
}
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.dropdown
  position: relative
  outline: none
  white-space: nowrap // need everything to be on one line for proper animation
  font-weight: bold
  color: var(--tertiary)
  z-index: 1
  &.selected
    z-index: 60 // when this dropdown is selected, it should be placed above everything else (except Popup)
    .select-option
      +shadow
      border-color: var(--background)
  .select-option
    background-color: var(--background)
    position: relative
    border: var(--accent) 1px solid
    display: flex
    margin-left: 7px
    justify-content: center
    align-items: center
    border-radius: 100px
    padding: 5px 12px
    cursor: pointer
    user-select: none
    -webkit-tap-highlight-color: transparent
    .down-icon
      margin-left: 7px

  .option
    background-color: var(--background)
    border-radius: 100px
    +shadow
    padding: 5px 12px
    margin-left: 8px
    white-space: nowrap
    cursor: pointer
    user-select: none
    width: auto
    &:hover
      background-color: var(--secondaryBackground)
</style>
