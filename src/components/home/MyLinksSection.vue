<template>
  <section class="my-links home-surface" aria-labelledby="my-links-title">
    <div class="head">
      <h2 id="my-links-title" class="title">
        <Bookmark :size="18" :stroke-width="2.4" aria-hidden="true" />
        My links
      </h2>
      <span class="note">Your own personal links. Only you see them, on this device.</span>
    </div>

    <ul class="list">
      <li v-for="app in linkApps" :key="app.key" class="entry">
        <a class="link" :href="app.href" target="_blank" rel="noopener noreferrer">
          <span class="tile" :class="{ themed: !app.color }" :style="app.color ? { background: app.color } : undefined">
            <component :is="app.icon" :size="20" :stroke-width="2.2" aria-hidden="true" />
          </span>
          <span class="text">
            <span class="name">{{ app.name }}</span>
            <span class="host">{{ app.host }}</span>
          </span>
        </a>
        <button class="edit" type="button" :aria-label="`Edit ${app.name}`" :title="`Edit ${app.name}`" @click="formFor = app.key.slice(5)">
          <Pencil :size="14" :stroke-width="2.4" aria-hidden="true" />
        </button>
      </li>

      <li class="entry">
        <button class="link add" type="button" @click="formFor = 'new'">
          <span class="tile add-tile">
            <Plus :size="20" :stroke-width="2.6" aria-hidden="true" />
          </span>
          <span class="text">
            <span class="name">Add a link</span>
            <span class="host">ILC room booking, a club form...</span>
          </span>
        </button>
      </li>
    </ul>

    <WidgetSettings
      v-if="formFor"
      kind="link"
      :config="formConfig"
      @close="formFor = null"
      @save="onSave"
      @remove="onRemove"
    />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Bookmark, Pencil, Plus } from 'lucide-vue-next';
import '@/styles/home.css';
import WidgetSettings from './WidgetSettings.vue';
import { appDef, type AppDef } from './registry';
import { ensureMyLinksWidget, useLinkForm, useMyLinks } from './myLinks';

/*
  "My links" on the Links page: the student's own links, the same ones as
  the My Links widget on the home screen. It is tinted, with a bookmark, so
  it stands apart from the school links underneath.
*/

const myLinks = useMyLinks();
// a new link shows up in the My Links widget, so make sure it is on the home screen
const { formFor, formConfig, save: onSave, removeCurrent: onRemove } = useLinkForm({ onAdded: ensureMyLinksWidget });

const linkApps = computed(() => myLinks.links.value
  .map((link) => appDef(`link:${link.id}`))
  .filter((app): app is AppDef => !!app));


</script>

<style scoped>
/* a tinted panel, so the student's own links don't blend in with the school's */
.my-links {
  box-sizing: border-box;
  max-width: 986px;
  margin: 18px auto 10px;
  padding: 14px 14px 16px;
  border: 1px solid var(--w-line-strong);
  border-radius: 20px;
  background: linear-gradient(155deg, var(--w-tint) 0%, var(--background) 80%);
  color: var(--primary);
}



.head {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px 12px;
  margin-bottom: 10px;
}

.title {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--accent);
}

.note {
  font-size: 13px;
  color: var(--w-muted);
}

.list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 10px;
}

.entry {
  position: relative;
}

.link {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 44px 10px 10px;
  border: 1px solid var(--w-line);
  border-radius: 16px;
  background: var(--secondaryBackground);
  color: inherit;
  font: inherit;
  text-align: left;
  text-decoration: none;
  box-shadow: var(--w-shadow);
  cursor: pointer;
  transition: transform 0.15s ease, border-color 0.15s ease;
}

.link:hover {
  transform: translateY(-1px);
  border-color: var(--w-line-strong);
}

.link.add {
  padding-right: 10px;
  border-style: dashed;
  border-width: 1.5px;
  border-color: var(--w-line-strong);
  box-shadow: none;
}

.tile {
  flex: none;
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: #fff;
}

.tile.themed {
  background: var(--accent);
  color: var(--w-on-accent);
}

.add-tile {
  background: var(--w-soft);
  color: var(--accent);
}

.text {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.name {
  font-size: 15px;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.host {
  font-size: 12.5px;
  color: var(--w-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.edit {
  position: absolute;
  top: 50%;
  right: 8px;
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: var(--w-soft);
  color: var(--primary);
  cursor: pointer;
  transform: translateY(-50%);
}

.edit:hover {
  background: var(--w-line);
}

.link:focus-visible,
.edit:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
</style>
