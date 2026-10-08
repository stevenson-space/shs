import { computed, ref } from 'vue';
import { createId, useHomeLayout } from './layout';
import { normalizeUrl } from './linkCheck';

/*
  The student's own links (a Google Form to sign in to an ILC room, a
  teacher's site...), kept in this browser only. They live in the My Links
  widget on the home screen and under "My links" on the Links page, kept
  apart from the school's own links so the two aren't mixed up.
*/

export type MyLink = {
  id: string;
  name: string;
  url: string;
  // a tile color, or '' to use the theme's
  color: string;
};

const STORAGE_KEY = 'myLinks';
export const MAX_NAME_LENGTH = 24;

// Colors a link can have, besides the theme's own.
export const LINK_COLORS = ['#2563eb', '#7c3aed', '#db2777', '#dc2626', '#ea580c', '#0d9488', '#475569'];

const links = ref<MyLink[]>([]);
let loaded = false;

function save(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links.value));
  } catch (error) {
    console.error('Failed to save your links:', error);
  }
}

function load(): void {
  if (loaded) return;
  loaded = true;

  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(parsed)) return;

    links.value = parsed
      .map((entry): MyLink | null => {
        // saved links are checked again, so nothing unsafe can come back in from storage
        const url = entry && typeof entry.url === 'string' ? normalizeUrl(entry.url) : null;
        if (!url || typeof entry.name !== 'string' || !entry.name.trim()) return null;
        return {
          id: typeof entry.id === 'string' && entry.id ? entry.id : createId(),
          name: entry.name.trim().slice(0, MAX_NAME_LENGTH),
          url,
          color: LINK_COLORS.includes(entry.color) ? entry.color : '',
        };
      })
      .filter((entry): entry is MyLink => entry !== null);
  } catch {
    links.value = [];
  }
}

function find(id: string): MyLink | undefined {
  return links.value.find((link) => link.id === id);
}

// Returns the new link, or null when the address isn't a usable web link.
function add(name: string, url: string, color = ''): MyLink | null {
  const safe = normalizeUrl(url);
  if (!safe || !name.trim()) return null;

  const link: MyLink = { id: createId(), name: name.trim().slice(0, MAX_NAME_LENGTH), url: safe, color: LINK_COLORS.includes(color) ? color : '' };
  links.value = [...links.value, link];
  save();
  return link;
}

function update(id: string, name: string, url: string, color = ''): boolean {
  const safe = normalizeUrl(url);
  if (!safe || !name.trim()) return false;

  links.value = links.value.map((link) => (link.id === id
    ? { ...link, name: name.trim().slice(0, MAX_NAME_LENGTH), url: safe, color: LINK_COLORS.includes(color) ? color : '' }
    : link));
  save();
  return true;
}

function remove(id: string): void {
  links.value = links.value.filter((link) => link.id !== id);
  save();
}

export function useMyLinks() {
  load();
  return { links, find, add, update, remove };
}

/*
  The add / edit / delete flow for a link, shared by the My Links widget,
  the Links page and (for older layouts) link tiles on the home screen.
  formFor is 'new' while adding, or the id of the link being edited.
*/
export function useLinkForm(options: { onAdded?: (link: MyLink) => void } = {}) {
  const store = useMyLinks();
  const layout = useHomeLayout();
  const formFor = ref<string | null>(null);

  const formConfig = computed((): Record<string, string> => {
    if (!formFor.value || formFor.value === 'new') return {};
    const link = store.find(formFor.value);
    return link ? { id: link.id, title: link.name, url: link.url, color: link.color } : {};
  });

  function save(config: Record<string, string>): void {
    const id = formFor.value;
    formFor.value = null;

    if (id && id !== 'new') {
      store.update(id, config.title, config.url, config.color);
      return;
    }

    const link = store.add(config.title, config.url, config.color);
    if (link) options.onAdded?.(link);
  }

  // deleting a link also takes any tile of it off the home screen
  function removeCurrent(): void {
    const id = formFor.value;
    formFor.value = null;
    if (!id || id === 'new') return;

    store.remove(id);
    layout.items.value
      .filter((item) => item.type === `link:${id}`)
      .forEach((item) => layout.remove(item.id));
  }

  return { formFor, formConfig, save, removeCurrent };
}

// Puts the My Links widget on the home screen if it isn't there yet.
export function ensureMyLinksWidget(): void {
  const layout = useHomeLayout();
  if (!layout.items.value.some((item) => item.type === 'mylinks')) {
    layout.add('mylinks', 'medium');
  }
}
