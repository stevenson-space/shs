import { ref, readonly, type DeepReadonly, type Ref } from 'vue';
import type { Placement } from './placement';

/*
  The home screen works like Control Center: a grid of square cells where
  every item keeps the spot it was put in, empty space and all.

    icon   = 1 x 1  (a shortcut)
    wide   = 2 x 1  (a shortcut with its name beside it)
    small  = 2 x 2
    medium = 4 x 2
    large  = 4 x 4

  Phones show 4 cells per row, tablets 8 (10 in landscape), desktops 12, so
  a "medium" widget is always one phone-width wide. What is saved: the list
  of items (with their size and settings) and, for each number of columns
  the student has arranged, where each item sits. A width that has never
  been arranged is laid out from the list order.
*/

export type WidgetSize = 'icon' | 'wide' | 'small' | 'medium' | 'large';

export type LayoutItem = {
  // unique per placed item (a widget type can be placed more than once)
  id: string;
  // a widget type from registry.ts, or `app:<key>` for a shortcut
  type: string;
  size: WidgetSize;
  // per-item settings (e.g. a countdown's title and date)
  config?: Record<string, string>;
};

export const SIZE_SPAN: Record<WidgetSize, { cols: number; rows: number }> = {
  icon: { cols: 1, rows: 1 },
  wide: { cols: 2, rows: 1 },
  small: { cols: 2, rows: 2 },
  medium: { cols: 4, rows: 2 },
  large: { cols: 4, rows: 4 },
};

export const SIZE_LABEL: Record<WidgetSize, string> = {
  icon: 'Icon',
  wide: 'Wide',
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
};

const STORAGE_KEY = 'homeLayout';
// 1: just the list. 2: the list plus a spot for each item, per column count.
const LAYOUT_VERSION = 2;

const SIZES = Object.keys(SIZE_SPAN) as WidgetSize[];

let idCounter = 0;

export function createId(): string {
  idCounter += 1;
  return `${Date.now().toString(36)}${idCounter.toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

function widget(type: string, size: WidgetSize): LayoutItem {
  return { id: createId(), type, size };
}

function app(key: string): LayoutItem {
  return { id: createId(), type: `app:${key}`, size: 'icon' };
}

// What a first-time visitor sees, in the same order as the old home page.
// On a desktop this fills three columns: schedule | lunch | weather over
// events, then breaks & dates, my links, PWC and the shortcuts underneath.
export function defaultLayout(): LayoutItem[] {
  return [
    widget('schedule', 'large'),
    widget('lunch', 'large'),
    widget('weather', 'medium'),
    widget('events', 'medium'),
    widget('dates', 'medium'),
    widget('mylinks', 'medium'),
    widget('pwc', 'small'),
    app('bell'),
    app('links'),
    app('calendar'),
    app('qr'),
    app('gpa'),
    app('themes'),
    app('install'),
    app('timer'),
    app('jukebox'),
    app('settings'),
  ];
}

type Saved = { items: LayoutItem[]; positions: Record<string, Placement> };

function parseItems(list: unknown[]): LayoutItem[] {
  const seen = new Set<string>();
  const result: LayoutItem[] = [];

  list.forEach((entry) => {
    if (!entry || typeof entry !== 'object') return;

    const { id, type, size, config } = entry as Record<string, unknown>;

    if (typeof type !== 'string' || !SIZES.includes(size as WidgetSize)) return;

    const safeId = typeof id === 'string' && id && !seen.has(id) ? id : createId();
    seen.add(safeId);

    const item: LayoutItem = { id: safeId, type, size: size as WidgetSize };

    if (config && typeof config === 'object') {
      item.config = {};
      Object.entries(config as Record<string, unknown>).forEach(([key, value]) => {
        if (typeof value === 'string') item.config![key] = value;
      });
    }

    result.push(item);
  });

  return result;
}

function parsePositions(raw: unknown, ids: Set<string>): Record<string, Placement> {
  const result: Record<string, Placement> = {};
  if (!raw || typeof raw !== 'object') return result;

  Object.entries(raw as Record<string, unknown>).forEach(([cols, placement]) => {
    if (!/^\d+$/.test(cols) || !placement || typeof placement !== 'object') return;

    const clean: Placement = {};
    Object.entries(placement as Record<string, unknown>).forEach(([id, spot]) => {
      const { x, y } = (spot ?? {}) as Record<string, unknown>;
      if (ids.has(id) && Number.isInteger(x) && Number.isInteger(y) && (x as number) >= 0 && (y as number) >= 0) {
        clean[id] = { x: x as number, y: y as number };
      }
    });
    result[cols] = clean;
  });

  return result;
}

function parseSaved(raw: string | null): Saved | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);

    // version 1 layouts (just the list) carry over and get laid out from their order
    if (!parsed || (parsed.version !== 1 && parsed.version !== 2) || !Array.isArray(parsed.items)) {
      return null;
    }

    const parsedItems = parseItems(parsed.items);
    const ids = new Set(parsedItems.map((item) => item.id));
    return { items: parsedItems, positions: parsed.version === 2 ? parsePositions(parsed.positions, ids) : {} };
  } catch {
    return null;
  }
}

// Shared by every component on the home page.
const items = ref<LayoutItem[]>([]);
// column count -> where each item sits at that width
const positions = ref<Record<string, Placement>>({});
const editing = ref(false);
const customized = ref(false);
let loaded = false;

function save(): void {
  customized.value = true;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      version: LAYOUT_VERSION,
      items: items.value,
      positions: positions.value,
    }));
  } catch (error) {
    console.error('Failed to save the home layout:', error);
  }
}

function load(): void {
  if (loaded) return;
  loaded = true;

  let saved: Saved | null = null;

  try {
    saved = parseSaved(localStorage.getItem(STORAGE_KEY));
  } catch {
    saved = null;
  }

  customized.value = !!saved;
  items.value = saved?.items ?? defaultLayout();
  positions.value = saved?.positions ?? {};
}

function add(type: string, size: WidgetSize, config?: Record<string, string>): LayoutItem {
  const item: LayoutItem = { id: createId(), type, size };
  if (config) item.config = config;
  items.value.push(item);
  save();
  return item;
}

function remove(id: string): void {
  items.value = items.value.filter((item) => item.id !== id);
  Object.values(positions.value).forEach((placement) => { delete placement[id]; });
  save();
}

function resize(id: string, size: WidgetSize): void {
  const item = items.value.find((entry) => entry.id === id);
  if (!item || item.size === size) return;
  item.size = size;
}

/*
  Saves where everything sits at this column count. The list is also put in
  reading order, so a width that has never been arranged (a phone, say) gets
  laid out in roughly the same order.
*/
function commit(cols: number, placement: Placement): void {
  positions.value = { ...positions.value, [cols]: { ...placement } };

  const rank = (item: LayoutItem) => {
    const spot = placement[item.id];
    return spot ? spot.y * 1000 + spot.x : Infinity;
  };
  items.value = items.value
    .map((item, index) => ({ item, index }))
    .sort((a, b) => rank(a.item) - rank(b.item) || a.index - b.index)
    .map(({ item }) => item);

  save();
}

function configure(id: string, config: Record<string, string>): void {
  const item = items.value.find((entry) => entry.id === id);
  if (!item) return;
  item.config = { ...config };
  save();
}

function reset(): void {
  items.value = defaultLayout();
  positions.value = {};
  customized.value = false;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // nothing to clean up
  }
}

export type HomeLayout = {
  items: Ref<LayoutItem[]>;
  positions: DeepReadonly<Ref<Record<string, Placement>>>;
  editing: Ref<boolean>;
  // true once the student has changed anything from the default
  customized: DeepReadonly<Ref<boolean>>;
  add: (type: string, size: WidgetSize, config?: Record<string, string>) => LayoutItem;
  remove: (id: string) => void;
  resize: (id: string, size: WidgetSize) => void;
  commit: (cols: number, placement: Placement) => void;
  configure: (id: string, config: Record<string, string>) => void;
  reset: () => void;
  save: () => void;
};

export function useHomeLayout(): HomeLayout {
  load();

  return {
    items,
    positions: readonly(positions),
    editing,
    customized: readonly(customized),
    add,
    remove,
    resize,
    commit,
    configure,
    reset,
    save,
  };
}
