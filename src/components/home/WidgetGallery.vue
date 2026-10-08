<template>
  <SheetModal title="Add to home screen" @close="emit('close')">
    <h3 class="section">Widgets</h3>
    <ul class="widgets">
      <li v-for="def in WIDGETS" :key="def.type" class="widget-row">
        <span class="widget-icon">
          <component :is="def.icon" :size="20" :stroke-width="2" aria-hidden="true" />
        </span>
        <span class="widget-text">
          <span class="widget-name">{{ def.name }}</span>
          <span class="widget-desc">{{ def.description }}</span>
        </span>
        <span v-if="!def.multiple && placedTypes.has(def.type)" class="placed">
          <Check :size="14" :stroke-width="3" aria-hidden="true" />
          Added
        </span>
        <span v-else class="sizes">
          <button
            v-for="size in def.sizes"
            :key="size"
            class="size-btn"
            type="button"
            :aria-label="`Add ${def.name}, ${SIZE_LABEL[size]}`"
            @click="emit('add', def.type, size)"
          >
            <Plus :size="12" :stroke-width="3" aria-hidden="true" />
            {{ SIZE_LABEL[size] }}
          </button>
        </span>
      </li>
    </ul>

    <h3 class="section">Shortcuts</h3>
    <p v-if="!availableApps.length" class="none">Every shortcut is already on your home screen.</p>
    <ul v-else class="apps">
      <li v-for="app in availableApps" :key="app.key">
        <button class="app-btn" type="button" :aria-label="`Add ${app.name}`" @click="emit('add', `app:${app.key}`, 'icon')">
          <span class="app-tile" :class="app.color ? 'custom' : app.tone ?? 'solid'" :style="app.color ? { background: app.color } : undefined">
            <component :is="app.icon" :size="22" :stroke-width="2" aria-hidden="true" />
          </span>
          <span class="app-name">{{ app.name }}</span>
        </button>
      </li>
    </ul>
  </SheetModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Check, Plus } from 'lucide-vue-next';
import SheetModal from './SheetModal.vue';
import { APPS, WIDGETS } from './registry';
import { isStandalone } from './standalone';
import { SIZE_LABEL, type LayoutItem, type WidgetSize } from './layout';

const { items } = defineProps<{ items: LayoutItem[] }>();

const emit = defineEmits<{
  close: [];
  add: [type: string, size: WidgetSize];
}>();

const placedTypes = computed(() => new Set(items.map((item) => item.type)));
const availableApps = computed(() => APPS.filter((app) => !placedTypes.value.has(`app:${app.key}`)
  && !(app.hideWhenInstalled && isStandalone.value)));
</script>

<style scoped>
.section {
  margin: 14px 0 8px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--w-muted);
}

.section:first-child {
  margin-top: 4px;
}

.widgets,
.apps {
  margin: 0;
  padding: 0;
  list-style: none;
}

.widget-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
}

.widget-row + .widget-row {
  border-top: 1px solid var(--w-line);
}

.widget-icon {
  flex: none;
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: var(--accent);
  color: var(--w-on-accent);
}

.widget-text {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.widget-name {
  font-size: 15px;
  font-weight: 700;
}

.widget-desc {
  font-size: 12.5px;
  line-height: 1.35;
  color: var(--w-muted);
}

.sizes {
  flex: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 6px;
  max-width: 46%;
}

.size-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 30px;
  padding: 0 11px 0 9px;
  border: 1.5px solid var(--accent);
  border-radius: 999px;
  background: transparent;
  color: var(--accent);
  font: inherit;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.size-btn:hover {
  background: var(--accent);
  color: var(--w-on-accent);
}

.size-btn:focus-visible,
.app-btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.placed {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--w-muted);
}

.none {
  margin: 0;
  font-size: 13.5px;
  color: var(--w-muted);
}

.apps {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 8px;
}

.app-btn {
  box-sizing: border-box;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 10px 7px 7px;
  border: 1px solid var(--w-line);
  border-radius: 14px;
  background: transparent;
  color: var(--primary);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.app-btn:hover {
  background: var(--w-soft);
  border-color: var(--w-line-strong);
}

.app-tile {
  flex: none;
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 27%;
}

.app-tile.solid {
  background: var(--accent);
  color: var(--w-on-accent);
}

.app-tile.soft {
  background: var(--w-tint);
  color: var(--iconCardsInvert);
  box-shadow: inset 0 0 0 1px var(--w-line);
}

.app-tile.custom {
  color: #fff;
}

.app-name {
  min-width: 0;
  font-size: 13.5px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
