<template>
  <component
    :is="tag"
    class="app"
    :class="`size-${size}`"
    v-bind="linkProps"
    :aria-label="app.name"
    :title="app.name"
    @click="onClick"
  >
    <span class="tile" :class="tone" :style="app.color ? { background: app.color } : undefined">
      <component :is="app.icon" class="glyph" :stroke-width="2" aria-hidden="true" />
      <ArrowUpRight v-if="app.href" class="external" :size="11" :stroke-width="3" aria-hidden="true" />
      <!-- the bigger sizes carry their name inside the tile -->
      <span v-if="size === 'wide'" class="tile-label">{{ app.label }}</span>
      <span v-else-if="size === 'small'" class="tile-text">
        <span class="tile-label">{{ app.name }}</span>
        <!-- the student's own links say where they go -->
        <span v-if="app.host" class="tile-host">{{ app.host }}</span>
      </span>
    </span>
    <span v-if="size === 'icon'" class="label" :class="{ long: app.label.length > 9 }">{{ app.label }}</span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ArrowUpRight } from 'lucide-vue-next';
import type { AppDef } from './registry';
import type { WidgetSize } from './layout';

/*
  A shortcut on the home screen, in one of three sizes:
    icon  (1 x 1) a rounded square with the name underneath
    wide  (2 x 1) a pill with the icon and the name side by side
    small (2 x 2) a big tile with the icon on top and the full name below
*/
const { app, size = 'icon' } = defineProps<{ app: AppDef; size?: WidgetSize }>();

const emit = defineEmits<{ action: [name: string] }>();

const tone = computed(() => (app.color ? 'custom' : app.tone ?? 'solid'));

const tag = computed(() => {
  if (app.to) return 'router-link';
  if (app.href) return 'a';
  return 'button';
});

const linkProps = computed(() => {
  if (app.to) return { to: app.to };
  if (app.href) return { href: app.href, target: '_blank', rel: 'noopener noreferrer' };
  return { type: 'button' };
});

function onClick(): void {
  if (app.action) emit('action', app.action);
}
</script>

<style scoped>
.app {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  color: var(--primary);
  font: inherit;
  text-decoration: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

/* a square that fills whatever height the label leaves */
.tile {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 27%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1), 0 8px 14px -10px rgba(0, 0, 0, 0.45);
  transition: transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.18s ease;
}

.tile.solid {
  background: var(--accent);
  color: var(--w-on-accent);
}

.tile.soft {
  background: var(--w-tint);
  color: var(--iconCardsInvert);
  box-shadow: inset 0 0 0 1px var(--w-line), 0 8px 14px -12px rgba(0, 0, 0, 0.4);
}

.tile.custom {
  color: #fff;
}

.glyph {
  flex: none;
  width: 50%;
  height: 50%;
}

.external {
  position: absolute;
  top: 9%;
  right: 9%;
  opacity: 0.85;
}

.label {
  flex: none;
  max-width: 100%;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.25;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* a longer name ("School Links") gets slightly smaller type so it fits under the icon */
.label.long {
  font-size: 10.5px;
  letter-spacing: -0.01em;
}

.tile-label {
  min-width: 0;
  font-weight: 700;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ---- wide: a pill with the icon and name side by side ---- */

.size-wide .tile {
  width: 100%;
  height: 100%;
  aspect-ratio: auto;
  justify-content: flex-start;
  gap: 10px;
  padding: 0 16px 0 14px;
  box-sizing: border-box;
  border-radius: 999px;
}

.size-wide .glyph {
  width: 26px;
  height: 26px;
}

.size-wide .tile-label {
  font-size: 14.5px;
  white-space: nowrap;
}

.size-wide .external {
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
}

/* ---- small: a big tile, icon on top, full name at the bottom ---- */

.size-small .tile {
  width: 100%;
  height: 100%;
  aspect-ratio: auto;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px;
  box-sizing: border-box;
  border-radius: var(--w-radius, 22px);
}

.size-small .glyph {
  width: 38px;
  height: 38px;
}

.size-small .tile-label {
  font-size: 15.5px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.tile-text {
  min-width: 0;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tile-host {
  font-size: 12px;
  font-weight: 600;
  opacity: 0.8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.size-small .external {
  top: 14px;
  right: 14px;
}

@media (hover: hover) {
  .app:hover .tile {
    transform: translateY(-2px) scale(1.04);
  }

  .app.size-wide:hover .tile,
  .app.size-small:hover .tile {
    transform: translateY(-2px) scale(1.015);
  }
}

.app:active .tile {
  transform: scale(0.93);
  filter: brightness(0.92);
}

.app.size-wide:active .tile,
.app.size-small:active .tile {
  transform: scale(0.97);
}

.app:focus-visible {
  outline: none;
}

.app:focus-visible .tile {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}
</style>
