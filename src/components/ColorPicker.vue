<template>
  <div class="color-picker">
    <div class="color-swatch-wrapper">
      <input
        type="color"
        :value="colorValue"
        @input="handleColorInput"
        class="color-input"
        :disabled="isInheriting"
      />
      <div class="color-swatch" :style="{ background: colorValue }"></div>
    </div>

    <div class="input-column">
      <label v-if="label" class="color-label">{{ label }}</label>
      <div class="input-group">
        <input
          v-if="!isInheriting"
          type="text"
          :value="modelValue"
          @input="handleTextInput"
          @blur="validateColor"
          class="color-text"
          :placeholder="placeholder"
        />
        <div v-else class="select-wrapper">
          <select
            v-model="inheritMode"
            @change="handleInheritChange"
            class="inherit-select"
          >
            <option value="base">Inherit {{ themeStore.styling.base || 'light' }} mode</option>
            <option value="accent">Inherit accent</option>
            <option value="background">Inherit background</option>
            <option value="secondaryBackground">Inherit secondaryBackground</option>
            <option value="headerBackground">Inherit headerBackground</option>
            <option value="headerScheduleBar">Inherit headerScheduleBar</option>
            <option value="primary">Inherit primary</option>
            <option value="secondary">Inherit secondary</option>
            <option value="tertiary">Inherit tertiary</option>
            <option value="iconCardsRegular">Inherit iconCardsRegular</option>
            <option value="iconCardsInvert">Inherit iconCardsInvert</option>
          </select>
          <svg class="dropdown-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>

        <button
          v-if="allowInherit && !disableInlineButton"
          @click="toggleInherit"
          class="inherit-btn"
          :class="{ active: isInheriting }"
          :title="isInheriting ? 'Use custom color' : 'Use inheritance'"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { fallbackStyling } from '@/utils/themes';
import useThemeStore from '@/stores/themes';

const { modelValue = '', allowInherit = true, disableInlineButton = false, placeholder = 'Color value', propertyPath, label = '' } = defineProps<{
  modelValue?: string;
  allowInherit?: boolean;
  disableInlineButton?: boolean;
  placeholder?: string;
  propertyPath?: string;
  label?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const themeStore = useThemeStore();

const inheritMode = ref('base');

const isInheriting = computed(() => {
  return !modelValue || modelValue === 'inherit' || modelValue.startsWith('var(--');
});

const inheritedValue = computed(() => {
  if (modelValue && modelValue.startsWith('var(--')) {
    // Extract property name from var(--propertyName)
    const match = modelValue.match(/var\(--([^)]+)\)/);
    if (match) {
      const varName = match[1];
      return getValueFromVarName(varName);
    }
  }

  // Default to base inheritance
  if (!propertyPath) {
    return '#000000';
  }

  const fallback = fallbackStyling(themeStore.styling);
  const parts = propertyPath.split('.');
  let value: any = fallback;
  for (const part of parts) {
    value = value?.[part];
  }

  return value || '#000000';
});

const colorValue = computed(() => {
  const valueToConvert = isInheriting.value ? inheritedValue.value : modelValue;

  // Convert CSS color names, var(), or other formats to hex for color input
  if (!valueToConvert || valueToConvert.startsWith('var(')) {
    return '#000000';
  }

  // If it's already a hex color, return it
  if (/^#[0-9A-Fa-f]{6}$/.test(valueToConvert)) {
    return valueToConvert;
  }

  // Try to convert CSS color name to hex
  const hex = cssColorToHex(valueToConvert);
  return hex || '#000000';
});

watch(() => modelValue, (value) => {
  if (value && value.startsWith('var(--')) {
    // Parse the var reference to set inheritMode
    const match = value.match(/var\(--([^)]+)\)/);
    if (match) {
      inheritMode.value = match[1];
    }
  } else if (!value || value === 'inherit') {
    inheritMode.value = 'base';
  }
}, { immediate: true });

function handleColorInput(event: Event): void {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
}

function handleTextInput(event: Event): void {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
}

function handleInheritChange(): void {
  if (inheritMode.value === 'base') {
    emit('update:modelValue', '');
  } else {
    emit('update:modelValue', `var(--${inheritMode.value})`);
  }
}

function validateColor(): void {
  const value = modelValue?.trim();
  if (!value || value === 'inherit' || isValidColor(value)) {
    return;
  }
  // If invalid, revert to empty (inherit)
  emit('update:modelValue', '');
}

function isValidColor(value: string): boolean {
  // Check hex colors
  if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value)) {
    return true;
  }
  // Check rgb/rgba
  if (/^rgba?\(/.test(value)) {
    return true;
  }
  // Check var()
  if (/^var\(--[\w-]+\)$/.test(value)) {
    return true;
  }
  // Check CSS color names
  return cssColorToHex(value) !== null;
}

function cssColorToHex(color: string): string | null {
  // Create a temporary element to use browser's color parsing
  const el = document.createElement('div');
  el.style.color = color;
  // If the browser rejected the value, style.color stays empty
  if (!el.style.color) return null;
  document.body.appendChild(el);
  const computedColor = getComputedStyle(el).color;
  document.body.removeChild(el);

  // Convert rgb/rgba to hex
  const match = computedColor.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)$/);
  if (match) {
    const r = parseInt(match[1]).toString(16).padStart(2, '0');
    const g = parseInt(match[2]).toString(16).padStart(2, '0');
    const b = parseInt(match[3]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }
  return null;
}

function toggleInherit(): void {
  const currentValue = modelValue;

  // Check if currently inheriting
  const isCurrentlyInheriting = !currentValue || currentValue === 'inherit' || currentValue.startsWith('var(--');

  if (isCurrentlyInheriting) {
    // Turn OFF inheritance: set to the actual resolved color value
    emit('update:modelValue', inheritedValue.value);
  } else {
    // Turn ON inheritance: always default to inherit from base (empty string)
    emit('update:modelValue', '');
  }
}

function getValueFromVarName(varName: string): string {
  // Map CSS variable names to styling paths (matching App.vue)
  const varMap: Record<string, string> = {
    'accent': 'accent',
    'background': 'background',
    'secondaryBackground': 'secondaryBackground',
    'headerBackground': 'header.background',
    'headerScheduleBar': 'header.scheduleBar',
    'primary': 'text.primary',
    'secondary': 'text.secondary',
    'tertiary': 'text.tertiary',
    'iconCardsRegular': 'iconCards.regular',
    'iconCardsInvert': 'iconCards.invert',
  };

  const path = varMap[varName];
  if (!path) return '#000000';

  const parts = path.split('.');
  let value: any = themeStore.styling;
  for (const part of parts) {
    value = value?.[part];
    if (!value) break;
  }

  // If not found in current styling, check fallback
  if (!value) {
    const fallback = fallbackStyling(themeStore.styling);
    value = fallback;
    for (const part of parts) {
      value = value?.[part];
      if (!value) break;
    }
  }

  return value || '#000000';
}
</script>

<style lang="sass" scoped>
.color-picker
  display: flex
  gap: 12px
  align-items: flex-end

.input-column
  flex: 1
  min-width: 0
  display: flex
  flex-direction: column
  gap: 8px
  min-height: 56px
  justify-content: flex-end

.color-label
  font-size: 13px
  font-weight: 500
  color: var(--secondary)
  text-transform: uppercase
  letter-spacing: 0.5px
  flex-shrink: 0

.color-swatch-wrapper
  position: relative
  width: 48px
  height: 48px
  flex-shrink: 0

.color-input
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  opacity: 0
  cursor: pointer

  &:disabled
    cursor: not-allowed

.color-swatch
  width: 100%
  height: 100%
  border-radius: 12px
  box-shadow: 0 0 0 2px white, 0 0 0 4px rgba(128, 128, 128, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
  position: relative
  pointer-events: none

  &::before
    content: ''
    position: absolute
    inset: -3px
    border-radius: 14px
    background: linear-gradient(135deg, var(--accent), transparent)
    opacity: 0
    transition: opacity 0.3s
    z-index: -1

  .color-input:disabled ~ &
    opacity: 0.5
    filter: grayscale(0.5)

.input-group
  width: 100%
  display: flex
  gap: 8px
  align-items: center
  background: linear-gradient(135deg, rgba(128, 128, 128, 0.04), rgba(128, 128, 128, 0.08))
  border: 1px solid rgba(128, 128, 128, 0.12)
  border-radius: 10px
  padding: 4px
  transition: all 0.3s
  height: 36px
  box-sizing: border-box

  &:hover
    border-color: rgba(128, 128, 128, 0.2)

  &:focus-within
    border-color: var(--accent)
    box-shadow: 0 0 0 3px rgba(128, 128, 128, 0.1)

.color-text
  flex: 1
  min-width: 0
  padding: 4px 12px
  border: none
  border-radius: 6px
  background: transparent
  color: var(--primary)
  font-size: 13px
  box-sizing: border-box
  outline: none
  transition: background 0.2s
  height: 28px
  line-height: 20px

  &:hover
    background: rgba(128, 128, 128, 0.06)

  &:focus
    background: rgba(128, 128, 128, 0.08)

.select-wrapper
  flex: 1
  position: relative
  display: block

.inherit-select
  width: 100%
  padding: 4px 24px 4px 12px
  border: none
  border-radius: 6px
  background: transparent
  color: var(--primary)
  font-size: 13px
  box-sizing: border-box
  outline: none
  transition: background 0.2s
  height: 28px
  line-height: 20px
  cursor: pointer
  appearance: none
  -webkit-appearance: none
  -moz-appearance: none

  &:hover
    background: rgba(128, 128, 128, 0.06)

  &:focus
    background: rgba(128, 128, 128, 0.08)

  option
    background: var(--background)
    color: var(--primary)

.dropdown-icon
  position: absolute
  right: 8px
  pointer-events: none
  color: var(--secondary)
  opacity: 0.7

.inherit-btn
  width: 28px
  height: 28px
  border: none
  border-radius: 6px
  background: transparent
  color: var(--secondary)
  cursor: pointer
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
  flex-shrink: 0
  display: flex
  align-items: center
  justify-content: center

  svg
    transition: all 0.3s

  &:hover
    background: rgba(128, 128, 128, 0.1)
    color: var(--accent)
    transform: scale(1.05)

  &:active
    transform: scale(0.95)

  &.active
    background: var(--accent)
    color: white

    &:hover
      background: var(--accent)
      opacity: 0.9
      transform: scale(1.05)
</style>
