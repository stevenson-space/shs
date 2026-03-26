<template>
  <div class="collapsible-group" :class="{ expanded: isExpanded }">
    <div class="collapsible-header" :class="headerClass">
      <div
        class="header-content"
        @click="handleHeaderClick"
        :class="{ disabled: disabled }"
      >
        <span class="group-title">{{ title }}</span>
        <font-awesome-icon
          v-if="showChevron"
          :icon="icons.faChevronRight"
          class="chevron"
        />
      </div>
      <div v-if="slots.action" class="header-action" @click.stop>
        <slot name="action" />
      </div>
    </div>
    <transition
      name="expand"
      @before-enter="beforeEnter"
      @enter="enter"
      @after-enter="afterEnter"
      @before-leave="beforeLeave"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div v-show="isExpanded && !disabled" class="collapsible-content">
        <slot />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

const modelValue = defineModel<boolean>({ default: false });

const { title, disabled = false, headerClass = '', lockOpen = false } = defineProps<{
  title: string
  disabled?: boolean
  headerClass?: string
  lockOpen?: boolean
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>();

const slots = useSlots();

const icons = { faChevronRight };

const isExpanded = computed(() => lockOpen ? true : modelValue.value);
const showChevron = computed(() => !disabled && !lockOpen);

function handleHeaderClick() {
  if (!disabled && !lockOpen) {
    modelValue.value = !modelValue.value;
  }
}

function beforeEnter(el: Element): void {
  const content = el as HTMLElement;
  content.style.maxHeight = '0px';
  content.style.opacity = '0';
}

function enter(el: Element): void {
  const content = el as HTMLElement;
  content.style.maxHeight = `${content.scrollHeight}px`;
  content.style.opacity = '1';
}

function afterEnter(el: Element): void {
  const content = el as HTMLElement;
  content.style.maxHeight = 'none';
}

function beforeLeave(el: Element): void {
  const content = el as HTMLElement;
  content.style.maxHeight = `${content.scrollHeight}px`;
  content.style.opacity = '1';
}

function leave(el: Element): void {
  const content = el as HTMLElement;
  void content.offsetHeight;
  content.style.maxHeight = '0px';
  content.style.opacity = '0';
}

function afterLeave(el: Element): void {
  const content = el as HTMLElement;
  content.style.maxHeight = '';
  content.style.opacity = '';
}
</script>

<style lang="sass" scoped>
.collapsible-group
  background: transparent
  border-radius: 8px
  margin-bottom: 8px
  overflow: hidden
  border: 1px solid rgba(128, 128, 128, 0.08)
  transition: all 0.2s ease

  &:hover
    border-color: rgba(128, 128, 128, 0.15)

  &.expanded
    .chevron
      transform: rotate(90deg)

.collapsible-header
  width: 100%
  display: flex
  justify-content: space-between
  align-items: center
  background: transparent
  border: none
  transition: background 0.15s ease

.header-content
  flex: 1
  display: flex
  justify-content: space-between
  align-items: center
  padding: 12px 18px
  cursor: pointer
  transition: background 0.15s ease

  &:hover:not(.disabled)
    background: rgba(128, 128, 128, 0.05)

  &.disabled
    cursor: default

  .group-title
    color: var(--primary)
    font-size: 13px
    font-weight: 500
    text-align: left
    letter-spacing: 0.02em
    opacity: 0.8

  .chevron
    color: var(--secondary)
    font-size: 12px
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)
    font-weight: normal
    opacity: 0.4

.header-action
  display: flex
  align-items: center
  justify-content: center
  padding: 0 16px

  :deep(.checkbox-container)
    margin: 0

.collapsible-content
  padding: 12px 18px
  background: transparent
  max-height: none

.expand-enter-active,
.expand-leave-active
  transition: max-height 0.3s ease, opacity 0.3s ease
  overflow: hidden

.expand-enter-from,
.expand-leave-to
  opacity: 0

.expand-enter-to,
.expand-leave-from
  opacity: 1
</style>
