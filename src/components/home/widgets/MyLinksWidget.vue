<template>
  <WidgetShell class="my-links" title="My Links" :icon="Bookmark" to="/links" :size="size">
    <template #action>
      <button class="add-btn" type="button" title="Add a link" aria-label="Add a link" @click.stop="formFor = 'new'">
        <Plus :size="13" :stroke-width="3" aria-hidden="true" />
      </button>
    </template>

    <!-- nothing added yet -->
    <div v-if="!apps.length" class="empty">
      <div class="empty-title">Your own personal links</div>
      <div v-if="size !== 'small'" class="empty-sub">Like the ILC room booking form or a club sign-in.</div>
      <button class="add-big" type="button" @click.stop="formFor = 'new'">
        <Plus :size="14" :stroke-width="2.8" aria-hidden="true" />
        Add a link
      </button>
    </div>

    <ul v-else class="links" :class="`is-${size}`">
      <li v-for="app in shown" :key="app.key" class="entry">
        <a class="link" :href="app.href" target="_blank" rel="noopener noreferrer" :title="`${app.name} (${app.host})`">
          <span class="tile" :class="{ themed: !app.color }" :style="app.color ? { background: app.color } : undefined">
            <component :is="app.icon" class="glyph" :stroke-width="2.2" aria-hidden="true" />
          </span>
          <span class="text">
            <span class="name">{{ app.name }}</span>
            <span v-if="size !== 'small'" class="host">{{ app.host }}</span>
          </span>
        </a>
        <button class="edit" type="button" :aria-label="`Edit ${app.name}`" :title="`Edit ${app.name}`" @click.stop="formFor = app.key.slice(5)">
          <Pencil :size="11" :stroke-width="2.6" aria-hidden="true" />
        </button>
      </li>
      <li v-if="hidden > 0" class="entry more">
        <router-link class="link" to="/links">+{{ hidden }} more</router-link>
      </li>
    </ul>

    <WidgetSettings
      v-if="formFor"
      kind="link"
      :config="formConfig"
      @close="formFor = null"
      @save="save"
      @remove="removeCurrent"
    />
  </WidgetShell>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Bookmark, Pencil, Plus } from 'lucide-vue-next';
import WidgetShell from '../WidgetShell.vue';
import WidgetSettings from '../WidgetSettings.vue';
import { appDef, type AppDef } from '../registry';
import { useLinkForm, useMyLinks } from '../myLinks';
import type { WidgetSize } from '../layout';

/*
  The student's own personal links (a Google Form for ILC room booking, a
  club sign-in...). Tinted, with a bookmark, so it isn't mistaken for the
  school's Links page, which keeps its own "School Links" shortcut.
*/

const { size = 'medium' } = defineProps<{ size?: WidgetSize }>();

const { links } = useMyLinks();
const { formFor, formConfig, save, removeCurrent } = useLinkForm();

const apps = computed(() => links.value
  .map((link) => appDef(`link:${link.id}`))
  .filter((app): app is AppDef => !!app));

// how many fit: one column in small, two columns in the bigger sizes
const capacity = computed(() => ({ small: 3, medium: 4, large: 10 } as Record<string, number>)[size] ?? 4);

const shown = computed(() => (apps.value.length > capacity.value
  ? apps.value.slice(0, capacity.value - 1)
  : apps.value));

const hidden = computed(() => apps.value.length - shown.value.length);
</script>

<style scoped>
/* a wash of the theme color, so it reads as the student's own box */
.my-links {
  background: linear-gradient(155deg, var(--w-tint) 0%, var(--secondaryBackground) 75%);
  border-color: var(--w-line-strong);
}

.add-btn {
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1.5px solid var(--accent);
  border-radius: 50%;
  background: var(--secondaryBackground);
  color: var(--accent);
  cursor: pointer;
}

.add-btn:hover {
  background: var(--accent);
  color: var(--w-on-accent);
}

/* ---- empty ---- */
.empty {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  text-align: center;
}

.empty-title {
  font-size: 14px;
  font-weight: 700;
}

.empty-sub {
  font-size: 12.5px;
  color: var(--w-muted);
}

.add-big {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  margin-top: 6px;
  padding: 0 14px;
  border: 1.5px dashed var(--accent);
  border-radius: 999px;
  background: var(--secondaryBackground);
  color: var(--accent);
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

/* ---- the links ---- */
.links {
  flex: 1;
  min-height: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-auto-rows: minmax(0, 1fr);
  gap: 6px;
}

/* fixed rows, so one or two links don't stretch to fill the whole box */
.links.is-medium {
  grid-template-rows: repeat(2, minmax(0, 1fr));
}

.links.is-small {
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: repeat(3, minmax(0, 1fr));
}

.links.is-large {
  grid-template-rows: repeat(5, minmax(0, 1fr));
}

.entry {
  position: relative;
  min-width: 0;
  min-height: 0;
}

.link {
  box-sizing: border-box;
  height: 100%;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 22px 4px 5px;
  border-radius: 12px;
  background: var(--secondaryBackground);
  box-shadow: inset 0 0 0 1px var(--w-line);
  color: var(--primary);
  text-decoration: none;
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}

.link:hover {
  box-shadow: inset 0 0 0 1.5px var(--accent);
}

.link:active {
  transform: scale(0.97);
}

.tile {
  flex: none;
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  color: #fff;
}

.tile.themed {
  background: var(--accent);
  color: var(--w-on-accent);
}

.glyph {
  width: 17px;
  height: 17px;
}

.is-small .tile {
  width: 24px;
  height: 24px;
  border-radius: 7px;
}

.is-small .glyph {
  width: 14px;
  height: 14px;
}

.text {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

/* names get two lines in the bigger sizes, one in small */
.name {
  font-size: 13px;
  font-weight: 700;
  line-height: 1.2;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.is-small .name {
  -webkit-line-clamp: 1;
  line-clamp: 1;
}

.host {
  font-size: 11px;
  color: var(--w-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.more .link {
  justify-content: center;
  padding: 4px;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--accent);
  box-shadow: inset 0 0 0 1px var(--w-line-strong);
}

.edit {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: var(--w-soft);
  color: var(--w-muted);
  cursor: pointer;
}

.edit:hover {
  color: var(--primary);
}

/* on a mouse, the pencil only shows on the link being pointed at */
@media (hover: hover) {
  .edit {
    opacity: 0;
    transition: opacity 0.15s ease;
  }

  .entry:hover .edit,
  .edit:focus-visible {
    opacity: 1;
  }
}

.add-btn:focus-visible,
.add-big:focus-visible,
.link:focus-visible,
.edit:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
</style>
