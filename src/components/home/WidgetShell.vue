<template>
  <section class="widget" :class="[`size-${size}`, { flush }]" :aria-label="title || undefined">
    <header v-if="title" class="w-head">
      <component
        :is="to ? 'router-link' : 'div'"
        class="w-title"
        :class="{ link: !!to }"
        v-bind="to ? { to } : {}"
      >
        <component :is="icon" v-if="icon" class="w-icon" :size="14" :stroke-width="2.4" aria-hidden="true" />
        <span class="w-title-text">{{ title }}</span>
        <!-- a small widget needs the room for its name; the title still links -->
        <ChevronRight v-if="to && size !== 'small'" class="w-chevron" :size="13" :stroke-width="2.6" aria-hidden="true" />
      </component>
      <div v-if="$slots.action" class="w-action">
        <slot name="action" />
      </div>
    </header>
    <div class="w-body">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import { ChevronRight } from 'lucide-vue-next';
import type { WidgetSize } from './layout';

const { title = '', icon = undefined, to = '', size = 'medium', flush = false } = defineProps<{
  title?: string;
  icon?: Component;
  // makes the title a link to the full page for this widget
  to?: string;
  size?: WidgetSize;
  // removes the body's side padding (for lists that run edge to edge)
  flush?: boolean;
}>();
</script>

<style scoped>
.widget {
  box-sizing: border-box;
  height: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 13px 14px 12px;
  background: var(--secondaryBackground);
  color: var(--primary);
  border: 1px solid var(--w-line);
  border-radius: var(--w-radius);
  box-shadow: var(--w-shadow);
}

.widget.size-small {
  padding: 12px 13px 11px;
}

.w-head {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 20px;
  margin-bottom: 8px;
}

.w-title {
  min-width: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--w-muted);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.07em;
  line-height: 1;
  text-transform: uppercase;
  text-decoration: none;
}

.w-title-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.w-icon {
  flex: none;
  color: var(--accent);
}

.w-chevron {
  flex: none;
  margin-left: -3px;
  opacity: 0.45;
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.w-title.link {
  border-radius: 6px;
}

.w-title.link:hover .w-chevron {
  opacity: 1;
  transform: translateX(2px);
}

.w-title.link:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

.w-action {
  flex: none;
  display: flex;
  align-items: center;
  gap: 4px;
}

.w-body {
  flex: 1 1 auto;
  min-height: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.widget.flush {
  padding-left: 0;
  padding-right: 0;
}

.widget.flush .w-head {
  padding: 0 14px;
}
</style>
