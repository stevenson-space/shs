<template>
  <div
    ref="root"
    class="home-widgets home-surface"
    :class="{ editing, 'is-dragging': !!dragId, 'is-resizing': !!resizing }"
    :style="{ '--w-zoom': zoom }"
    @click.capture="onClickCapture"
  >
    <!-- the wrapper only exists so the grid can size itself from the space it is given -->
    <div ref="wrap" class="grid-wrap">
      <!-- the empty cells, shown while editing, so there is somewhere to put things -->
      <div v-if="editing" class="slots" :style="gridStyle" aria-hidden="true">
        <span
          v-for="slot in freeSlots"
          :key="slot.key"
          class="slot"
          :style="{ gridColumn: slot.x + 1, gridRow: slot.y + 1 }"
        />
      </div>

      <TransitionGroup
        tag="div"
        class="grid"
        name="reflow"
        :style="gridStyle"
        @dragstart.prevent
        @contextmenu="onContextMenu"
      >
        <div
          v-for="entry in entries"
          :key="entry.item.id"
          class="cell"
          :class="[`s-${entry.size}`, { dragging: dragId === entry.item.id, resizing: resizing?.id === entry.item.id }]"
          :style="cellStyle(entry)"
          :data-id="entry.item.id"
          :tabindex="editing ? 0 : undefined"
          :role="editing ? 'group' : undefined"
          :aria-label="editing ? `${entry.label}, ${SIZE_LABEL[entry.size]}. Arrow keys move it, plus and minus resize it, Delete removes it.` : undefined"
          @pointerdown="onPointerDown($event, entry.item)"
          @touchstart.passive="onTouchStart($event, entry.item)"
          @keydown="onCellKeydown($event, entry)"
        >
          <div class="cell-inner">
            <AppIcon v-if="entry.app" :app="entry.app" :size="entry.size" @action="onAppAction" />
            <component
              :is="entry.widget.component"
              v-else-if="entry.widget"
              :size="entry.size"
              :config="entry.item.config"
            />
          </div>

          <template v-if="editing">
            <!-- covers the widget so taps move it instead of opening links -->
            <div class="shield" aria-hidden="true" />

            <button
              class="edit-btn remove"
              type="button"
              :aria-label="`Remove ${entry.label}`"
              :title="`Remove ${entry.label}`"
              @click.stop="removeItem(entry.item)"
            >
              <Minus :size="14" :stroke-width="3.2" aria-hidden="true" />
            </button>

            <button
              v-if="entry.widget?.settings || entry.app?.custom"
              class="edit-btn settings"
              type="button"
              :aria-label="`${entry.label} settings`"
              :title="`${entry.label} settings`"
              @click.stop="openSettings(entry)"
            >
              <Pencil :size="13" :stroke-width="2.6" aria-hidden="true" />
            </button>

            <!-- drag to resize (like Control Center), or tap to step through the sizes -->
            <button
              v-if="entry.sizes.length > 1"
              class="resize-handle"
              type="button"
              :aria-label="`Resize ${entry.label}, now ${SIZE_LABEL[entry.size]}`"
              :title="`Drag to resize · ${SIZE_LABEL[entry.size]}`"
              @pointerdown.stop="onResizeStart($event, entry)"
              @click.stop="onResizeTap(entry)"
            >
              <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M17 6.5 A 10.5 10.5 0 0 1 6.5 17" /></svg>
            </button>
          </template>
        </div>
      </TransitionGroup>
    </div>

    <p v-if="!entries.length" class="empty-home">
      Your home screen is empty. Add a widget to get started.
    </p>

    <div v-if="!editing" class="home-foot">
      <button class="edit-home" type="button" @click="startEditing">
        <LayoutGrid :size="15" :stroke-width="2.4" aria-hidden="true" />
        Edit home screen
      </button>
      <slot name="foot" />
    </div>

    <transition name="bar">
      <div v-if="editing" class="edit-bar" role="toolbar" aria-label="Edit home screen">
        <!-- where the countdown goes on a landscape iPad or laptop -->
        <div v-if="sideCapable" class="clock-switch" role="group" aria-label="Countdown position">
          <button
            class="clock-option"
            type="button"
            :class="{ on: userSettings.heroPosition === 'left' }"
            :aria-pressed="userSettings.heroPosition === 'left'"
            title="Countdown on the left"
            @click="userSettings.setHeroPosition('left')"
          >
            <PanelLeft :size="16" :stroke-width="2.4" aria-hidden="true" />
          </button>
          <button
            class="clock-option"
            type="button"
            :class="{ on: userSettings.heroPosition === 'top' }"
            :aria-pressed="userSettings.heroPosition === 'top'"
            title="Countdown on top"
            @click="userSettings.setHeroPosition('top')"
          >
            <PanelTop :size="16" :stroke-width="2.4" aria-hidden="true" />
          </button>
        </div>
        <button class="bar-btn" type="button" @click="galleryOpen = true">
          <Plus :size="16" :stroke-width="2.8" aria-hidden="true" />
          Add
        </button>
        <button
          v-if="layout.customized.value"
          class="bar-btn"
          type="button"
          :class="{ warn: confirmReset }"
          @click="onReset"
        >
          <RotateCcw :size="15" :stroke-width="2.6" aria-hidden="true" />
          {{ confirmReset ? 'Tap again to reset' : 'Reset' }}
        </button>
        <button class="bar-btn done" type="button" @click="stopEditing">
          <Check :size="16" :stroke-width="3" aria-hidden="true" />
          Done
        </button>
      </div>
    </transition>

    <WidgetGallery
      v-if="galleryOpen"
      :items="items"
      @close="galleryOpen = false"
      @add="onAdd"
    />

    <WidgetSettings
      v-if="settingsEntry?.widget?.settings"
      :kind="settingsEntry.widget.settings"
      :config="settingsEntry.item.config"
      @close="settingsFor = null"
      @save="onSaveSettings"
    />

    <!-- a link tile (from an older layout): its pencil edits the link -->
    <WidgetSettings
      v-if="linkFormFor"
      kind="link"
      :config="linkFormConfig"
      @close="linkFormFor = null"
      @save="saveLink"
      @remove="removeLink"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue';
import { Check, LayoutGrid, Minus, PanelLeft, PanelTop, Pencil, Plus, RotateCcw } from 'lucide-vue-next';
import useUserSettingsStore from '@/stores/user-settings';
import AppIcon from './AppIcon.vue';
import WidgetGallery from './WidgetGallery.vue';
import WidgetSettings from './WidgetSettings.vue';
import { APP_SIZES, appDef, widgetDef, type AppDef, type WidgetDef } from './registry';
import { isStandalone } from './standalone';
import { useLinkForm } from './myLinks';
import { SIZE_LABEL, SIZE_SPAN, useHomeLayout, type LayoutItem, type WidgetSize } from './layout';
import { arrange, placeAt, rowsUsed, type Box, type Placement, type Spot } from './placement';

/*
  The home screen grid, laid out like Control Center.

  Normal mode: widgets and shortcuts work as usual.
  Edit mode (press and hold any item, or use the button under the grid):
  items wiggle and the empty cells show. Drag an item anywhere, including
  into empty space; whatever it lands on is pushed to the nearest free spot.
  Drag the corner handle to resize (or tap it to step through the sizes),
  minus removes, Add opens the gallery. The arrangement is saved in the
  browser, separately for each screen width.
*/

const emit = defineEmits<{ 'open-themes': [] }>();

const layout = useHomeLayout();
const { items, editing } = layout;
const userSettings = useUserSettingsStore();

// The countdown can only sit beside the widgets on a landscape iPad or laptop
// (the same screens as side-hero in style.sass), so the switch only shows there.
const SIDE_QUERY = '(min-width: 1024px) and (orientation: landscape)';
const sideCapable = ref(false);
let sideQuery: MediaQueryList | null = null;
const onSideChange = () => { sideCapable.value = !!sideQuery?.matches; };

const root = useTemplateRef<HTMLDivElement>('root');
const wrap = useTemplateRef<HTMLDivElement>('wrap');

/*
  Widgets are drawn for a 70px cell. On a bigger screen the cells are bigger,
  so everything inside a widget (text, icons, spacing) is scaled up by the
  same amount. A widget on an iPad or a large monitor is then the same design,
  just larger, instead of small text floating in a big box.
*/
const DESIGN_CELL = 70;
const zoom = ref(1);
// measured from the grid as the browser lays it out (see measure)
const cols = ref(12);
const cellPx = ref(DESIGN_CELL);
const gapPx = ref(14);
// rows that fill the screen below the top of the grid, so edit mode shows space to fill
const screenRows = ref(6);
let resizeObserver: ResizeObserver | null = null;

const pitch = () => cellPx.value + gapPx.value;

function gridEl(): HTMLElement | null {
  return (wrap.value?.querySelector('.grid') as HTMLElement | null) ?? null;
}

function measure(): void {
  const grid = gridEl();
  if (!grid) return;

  // The column count comes from the CSS (--cols), not from counting the
  // columns: an item placed past the last column (laid out for a wider
  // screen a moment ago) makes the browser add columns, and counting those
  // would keep the wider layout (and squeeze the real ones), so the cell
  // size is worked out from the grid's width too.
  const style = getComputedStyle(grid);
  const count = parseInt(style.getPropertyValue('--cols'), 10);
  const gap = parseFloat(style.columnGap) || 0;
  const cell = (grid.clientWidth - (count - 1) * gap) / count;

  if (cell > 0 && count > 0) {
    cols.value = count;
    cellPx.value = cell;
    gapPx.value = gap;

    // The gap between cells does not grow with the cells, so compare the width
    // of a 4-cell widget (the widest there is) rather than one cell. Scaling by
    // the cell alone would leave wide widgets a little short on room and their
    // text would start getting cut off on big screens.
    const scale = (4 * cell + 3 * gap) / (4 * DESIGN_CELL + 3 * gap);
    zoom.value = Math.floor(Math.min(2.1, Math.max(0.9, scale)) * 100) / 100;

    // leave room at the bottom for the edit bar
    const top = grid.getBoundingClientRect().top + window.scrollY;
    screenRows.value = Math.max(2, Math.floor((window.innerHeight - top - 90 + gap) / (cell + gap)));
  }
}

type Entry = {
  item: LayoutItem;
  app?: AppDef;
  widget?: WidgetDef;
  label: string;
  size: WidgetSize;
  // the sizes it can be set to
  sizes: WidgetSize[];
};

// a size picked by dragging a resize handle, shown live before it is saved
const resizing = ref<{ id: string; size: WidgetSize } | null>(null);

// The saved list, minus anything this build can't draw.
const entries = computed((): Entry[] => {
  const result: Entry[] = [];

  items.value.forEach((item) => {
    const app = appDef(item.type);
    const widget = widgetDef(item.type);
    const override = resizing.value?.id === item.id ? resizing.value.size : null;

    if (app) {
      if (app.hideWhenInstalled && isStandalone.value) return;
      const size = override ?? (APP_SIZES.includes(item.size) ? item.size : 'icon');
      result.push({ item, app, label: app.name, size, sizes: APP_SIZES });
    } else if (widget) {
      // the "Show PWC Schedule" setting still decides whether the PWC widget appears
      if (widget.type === 'pwc' && !userSettings.showPWCSchedule) return;

      const size = override ?? (widget.sizes.includes(item.size) ? item.size : widget.defaultSize);
      result.push({ item, widget, label: widget.name, size, sizes: widget.sizes });
    }
  });

  return result;
});

const boxOf = (id: string, size: WidgetSize): Box => ({ id, w: SIZE_SPAN[size].cols, h: SIZE_SPAN[size].rows });

function boxesWith(id?: string, size?: WidgetSize): Box[] {
  return entries.value.map((entry) => boxOf(entry.item.id, entry.item.id === id && size ? size : entry.size));
}

const boxes = computed(() => boxesWith());

// Where everything sits, from what was saved for this many columns.
const savedPlacement = computed(() => arrange(cols.value, boxes.value, layout.positions.value[cols.value] as Placement | undefined));

// While something is being dragged or resized, the arrangement it would make.
const preview = ref<Placement | null>(null);
const placement = computed(() => preview.value ?? savedPlacement.value);

// While dragging, the grid keeps the rows it had when the item was picked up,
// so dropping near the bottom can't keep adding rows (and scrolling) forever.
const dragRows = ref(0);

const totalRows = computed(() => {
  const used = rowsUsed(boxes.value, placement.value);
  if (dragRows.value) return Math.max(dragRows.value, used);
  // editing: always a couple of empty rows below, and at least a screenful
  return Math.max(1, editing.value ? Math.max(used + 2, screenRows.value) : used);
});

const gridStyle = computed(() => ({ '--rows': totalRows.value }));

function cellStyle(entry: Entry): Record<string, string> {
  const spot = placement.value[entry.item.id] ?? { x: 0, y: 0 };
  const { cols: w, rows: h } = SIZE_SPAN[entry.size];
  return {
    gridColumn: `${spot.x + 1} / span ${Math.min(w, cols.value)}`,
    gridRow: `${spot.y + 1} / span ${h}`,
  };
}

const freeSlots = computed(() => {
  const taken = new Set<string>();
  boxes.value.forEach((box) => {
    const spot = placement.value[box.id];
    if (!spot) return;
    for (let y = spot.y; y < spot.y + box.h; y++) {
      for (let x = spot.x; x < spot.x + box.w; x++) taken.add(`${x},${y}`);
    }
  });

  const slots: { key: string; x: number; y: number }[] = [];
  for (let y = 0; y < totalRows.value; y++) {
    for (let x = 0; x < cols.value; x++) {
      if (!taken.has(`${x},${y}`)) slots.push({ key: `${x},${y}`, x, y });
    }
  }
  return slots;
});

// Saves the arrangement as it is now, so later changes leave it alone.
function commit(next: Placement = placement.value): void {
  layout.commit(cols.value, next);
}

/* ------------------------------------------------------------------ */
/* Edit mode                                                           */
/* ------------------------------------------------------------------ */

const galleryOpen = ref(false);
const settingsFor = ref<string | null>(null);
const confirmReset = ref(false);
let confirmTimer: ReturnType<typeof setTimeout> | null = null;

const settingsEntry = computed(() => entries.value.find((entry) => entry.item.id === settingsFor.value) ?? null);

/* ---- the student's own links ---- */

const {
  formFor: linkFormFor,
  formConfig: linkFormConfig,
  save: saveLink,
  removeCurrent: removeLink,
} = useLinkForm();

// the pencil on a widget opens its settings; on a link, the link form
function openSettings(entry: Entry): void {
  if (entry.app?.custom) {
    linkFormFor.value = entry.item.type.slice('link:'.length);
  } else {
    settingsFor.value = entry.item.id;
  }
}



function startEditing(): void {
  measure();
  editing.value = true;
}

function stopEditing(): void {
  editing.value = false;
  galleryOpen.value = false;
  settingsFor.value = null;
  confirmReset.value = false;
  layout.save();
}

function removeItem(item: LayoutItem): void {
  layout.remove(item.id);
}

function onAdd(type: string, size: WidgetSize): void {
  // adding the PWC widget also turns its setting back on, or it would stay hidden
  if (type === 'pwc' && !userSettings.showPWCSchedule) {
    userSettings.setShowPWCSchedule(true);
  }

  const added = layout.add(type, size);

  // it goes in the first free space; pin it there so later moves don't shuffle it
  nextTick(() => {
    commit(savedPlacement.value);

    // widgets are added one at a time; shortcuts are usually added in batches
    if (!type.startsWith('app:')) {
      galleryOpen.value = false;
      nextTick(() => cellFor(added.id)?.scrollIntoView({ block: 'center', behavior: 'smooth' }));
    }
  });
}

function onSaveSettings(config: Record<string, string>): void {
  if (settingsFor.value) layout.configure(settingsFor.value, config);
  settingsFor.value = null;
}

// Resetting throws away the student's arrangement, so it takes two taps.
function onReset(): void {
  if (confirmTimer) clearTimeout(confirmTimer);

  if (!confirmReset.value) {
    confirmReset.value = true;
    confirmTimer = setTimeout(() => { confirmReset.value = false; }, 3500);
    return;
  }

  confirmReset.value = false;
  layout.reset();
}

function onAppAction(name: string): void {
  if (name === 'themes') emit('open-themes');
}

function cellFor(id: string): HTMLElement | null {
  return root.value?.querySelector<HTMLElement>(`.grid > .cell[data-id="${id}"]`) ?? null;
}

/* ---- resizing ---- */

function stepSize(entry: Entry, step: 1 | -1): WidgetSize {
  const index = entry.sizes.indexOf(entry.size);
  return entry.sizes[(index + step + entry.sizes.length) % entry.sizes.length];
}

// Changes an item's size where it sits, pushing neighbours out of the way.
function applySize(id: string, size: WidgetSize): void {
  const next = placeAt(cols.value, boxesWith(id, size), savedPlacement.value, id, savedPlacement.value[id]);
  layout.resize(id, size);
  commit(next);
}

let resizeDrag: {
  id: string;
  left: number;
  top: number;
  startX: number;
  startY: number;
  moved: boolean;
  sizes: WidgetSize[];
  base: Placement;
} | null = null;
let ignoreHandleClick = false;

function onResizeStart(event: PointerEvent, entry: Entry): void {
  if (event.button !== 0 || dragId.value) return;

  const cell = cellFor(entry.item.id);
  if (!cell) return;

  const rect = cell.getBoundingClientRect();
  // a drag that ended off the handle never sent it a click to clear this
  ignoreHandleClick = false;
  resizeDrag = {
    id: entry.item.id,
    left: rect.left,
    top: rect.top,
    startX: event.clientX,
    startY: event.clientY,
    moved: false,
    sizes: entry.sizes,
    base: { ...savedPlacement.value },
  };

  window.addEventListener('pointermove', onResizeMove);
  window.addEventListener('pointerup', onResizeEnd);
  window.addEventListener('pointercancel', onResizeEnd);
}

// The allowed size closest to where the handle has been dragged.
function sizeAt(sizes: WidgetSize[], width: number, height: number): WidgetSize {
  return sizes.reduce((best, size) => {
    const span = SIZE_SPAN[size];
    const bestSpan = SIZE_SPAN[best];
    const distance = Math.hypot(span.cols - width, span.rows - height);
    const bestDistance = Math.hypot(bestSpan.cols - width, bestSpan.rows - height);
    return distance < bestDistance ? size : best;
  });
}

function onResizeMove(event: PointerEvent): void {
  if (!resizeDrag) return;

  if (!resizeDrag.moved) {
    if (Math.hypot(event.clientX - resizeDrag.startX, event.clientY - resizeDrag.startY) < 6) return;
    resizeDrag.moved = true;
  }

  event.preventDefault();

  // how many cells wide and tall the item would be with its corner at the pointer
  const width = (event.clientX - resizeDrag.left + gapPx.value) / pitch();
  const height = (event.clientY - resizeDrag.top + gapPx.value) / pitch();
  const size = sizeAt(resizeDrag.sizes, width, height);

  if (resizing.value?.size !== size) {
    const { id, base } = resizeDrag;
    preview.value = placeAt(cols.value, boxesWith(id, size), base, id, base[id]);
    resizing.value = { id, size };
  }
}

function onResizeEnd(): void {
  window.removeEventListener('pointermove', onResizeMove);
  window.removeEventListener('pointerup', onResizeEnd);
  window.removeEventListener('pointercancel', onResizeEnd);

  if (!resizeDrag) return;

  const { id, moved } = resizeDrag;
  const picked = resizing.value;
  const next = preview.value;
  resizeDrag = null;
  ignoreHandleClick = moved;

  if (moved && picked && next) {
    layout.resize(id, picked.size);
    commit(next);
  }

  preview.value = null;
  resizing.value = null;
}

// A tap (not a drag) on the handle steps to the next size.
function onResizeTap(entry: Entry): void {
  if (ignoreHandleClick) {
    ignoreHandleClick = false;
    return;
  }
  applySize(entry.item.id, stepSize(entry, 1));
}

/* ---- keyboard ---- */

// Keyboard version of dragging: arrows move the focused item one cell,
// plus and minus resize it, Delete removes it.
function onCellKeydown(event: KeyboardEvent, entry: Entry): void {
  if (!editing.value || event.target !== event.currentTarget) return;

  const { id } = entry.item;
  const spot = savedPlacement.value[id];
  const moves: Record<string, Spot> = {
    ArrowLeft: { x: spot.x - 1, y: spot.y },
    ArrowRight: { x: spot.x + 1, y: spot.y },
    ArrowUp: { x: spot.x, y: spot.y - 1 },
    ArrowDown: { x: spot.x, y: spot.y + 1 },
  };
  let handled = true;

  if (moves[event.key]) {
    commit(placeAt(cols.value, boxes.value, savedPlacement.value, id, moves[event.key]));
  } else if ((event.key === '+' || event.key === '=') && entry.sizes.length > 1) {
    applySize(id, stepSize(entry, 1));
  } else if (event.key === '-' && entry.sizes.length > 1) {
    applySize(id, stepSize(entry, -1));
  } else if (event.key === 'Delete' || event.key === 'Backspace') {
    layout.remove(id);
  } else {
    handled = false;
  }

  if (handled) {
    event.preventDefault();
    nextTick(() => cellFor(id)?.focus());
  }
}

function onWindowKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && editing.value && !galleryOpen.value && !settingsFor.value) {
    stopEditing();
  }
}

/* ------------------------------------------------------------------ */
/* Press-and-hold + dragging                                           */
/* ------------------------------------------------------------------ */

// How long a press must be held before it picks an item up.
const HOLD_MS = 480; // outside edit mode (also enters edit mode)
const HOLD_EDITING_MS = 170; // touch, already editing: short, but long enough to tell it from a scroll
const MOVE_TOLERANCE = 8; // px a press may wander and still count as a hold
const MOUSE_DRAG_START = 5; // px a mouse must move in edit mode to start a drag
const EDGE_SCROLL_ZONE = 84; // px from the top/bottom of the screen that auto-scrolls

type Press = {
  item: LayoutItem;
  x: number;
  y: number;
  touch: boolean;
  timer: ReturnType<typeof setTimeout> | null;
};

const dragId = ref<string | null>(null);
let press: Press | null = null;
let ghost: HTMLElement | null = null;
let ghostOrigin = { left: 0, top: 0 };
let grab = { x: 0, y: 0 };
let point = { x: 0, y: 0 };
let dragBase: Placement = {};
let dragTarget: Spot | null = null;
let frame = 0;
let suppressClick = false;
let suppressTimer: ReturnType<typeof setTimeout> | null = null;

function isEditControl(target: EventTarget | null): boolean {
  return target instanceof Element && !!target.closest('.edit-btn, .resize-handle');
}

function clearPress(): void {
  if (press?.timer) clearTimeout(press.timer);
  press = null;
}

// The click the browser fires right after a drag ends would otherwise open
// whatever link the item was dropped with.
function swallowNextClick(): void {
  suppressClick = true;
  if (suppressTimer) clearTimeout(suppressTimer);
  suppressTimer = setTimeout(() => { suppressClick = false; }, 350);
}

function onClickCapture(event: MouseEvent): void {
  if (!suppressClick) return;
  suppressClick = false;

  // a deliberate tap on an edit button is never the leftover click from a drag
  if (isEditControl(event.target)) return;

  event.preventDefault();
  event.stopPropagation();
}

// Long-pressing a link on a phone would otherwise open the browser's own menu.
function onContextMenu(event: MouseEvent): void {
  if (editing.value || press || dragId.value) event.preventDefault();
}

function beginDrag(item: LayoutItem, x: number, y: number): void {
  const cell = cellFor(item.id);
  if (!cell || !root.value) return;

  if (!editing.value) startEditing();

  const rect = cell.getBoundingClientRect();

  // a floating copy follows the pointer while the real item shows where it will land
  ghost = cell.cloneNode(true) as HTMLElement;
  ghost.removeAttribute('data-id');
  ghost.removeAttribute('tabindex');
  ghost.classList.add('ghost');
  ghost.style.left = `${rect.left}px`;
  ghost.style.top = `${rect.top}px`;
  ghost.style.width = `${rect.width}px`;
  ghost.style.height = `${rect.height}px`;
  root.value.appendChild(ghost);

  ghostOrigin = { left: rect.left, top: rect.top };
  grab = { x, y };
  point = { x, y };
  dragBase = { ...savedPlacement.value };
  dragTarget = dragBase[item.id] ?? null;
  dragRows.value = totalRows.value;
  dragId.value = item.id;

  if (navigator.vibrate) navigator.vibrate(8);

  moveGhost();
  frame = requestAnimationFrame(dragLoop);
}

function moveGhost(): void {
  if (ghost) {
    ghost.style.transform = `translate3d(${point.x - grab.x}px, ${point.y - grab.y}px, 0)`;
  }
}

// The cell the dragged item's top-left corner is over, and what the grid
// would look like with it dropped there.
function previewDrop(): void {
  const id = dragId.value;
  const grid = gridEl();
  if (!id || !grid) return;

  const rect = grid.getBoundingClientRect();
  const left = ghostOrigin.left + (point.x - grab.x) - rect.left;
  const top = ghostOrigin.top + (point.y - grab.y) - rect.top;
  const height = boxes.value.find((box) => box.id === id)?.h ?? 1;
  // no lower than the rows that were on screen when it was picked up
  const lowest = Math.max(dragBase[id]?.y ?? 0, dragRows.value - height);
  const target = { x: Math.round(left / pitch()), y: Math.min(Math.round(top / pitch()), lowest) };

  if (dragTarget && target.x === dragTarget.x && target.y === dragTarget.y) return;

  const next = placeAt(cols.value, boxes.value, dragBase, id, target);
  dragTarget = next[id];
  preview.value = next;
}

function updateDrag(x: number, y: number): void {
  point = { x, y };
  moveGhost();
}

// Runs once per frame while an item is held: scrolls the page when the item
// is near the top or bottom edge, then works out where it would land.
function dragLoop(): void {
  if (!dragId.value) return;

  let speed = 0;

  if (point.y < EDGE_SCROLL_ZONE) {
    speed = -(EDGE_SCROLL_ZONE - point.y) / 5;
  } else if (point.y > window.innerHeight - EDGE_SCROLL_ZONE) {
    speed = (point.y - (window.innerHeight - EDGE_SCROLL_ZONE)) / 5;
  }

  if (speed) window.scrollBy(0, speed);

  previewDrop();
  frame = requestAnimationFrame(dragLoop);
}

function endDrag(): void {
  const id = dragId.value;
  if (!id) return;

  cancelAnimationFrame(frame);
  swallowNextClick();

  if (preview.value) commit(preview.value);
  preview.value = null;
  dragRows.value = 0;

  const leaving = ghost;
  ghost = null;

  const finish = () => {
    leaving?.remove();
    if (dragId.value === id) dragId.value = null;
  };

  // glide the copy into the spot the item now occupies, then swap them
  nextTick(() => {
    const cell = cellFor(id);

    if (leaving && cell) {
      const rect = cell.getBoundingClientRect();
      leaving.classList.add('settling');
      leaving.style.transform = `translate3d(${rect.left - ghostOrigin.left}px, ${rect.top - ghostOrigin.top}px, 0)`;
      setTimeout(finish, 190);
    } else {
      finish();
    }
  });
}

/* ---- mouse / pen ---- */

function onPointerDown(event: PointerEvent, item: LayoutItem): void {
  // touch is handled by the touch events below so scrolling keeps working
  if (event.pointerType === 'touch' || event.button !== 0 || isEditControl(event.target) || dragId.value) return;

  clearPress();
  press = { item, x: event.clientX, y: event.clientY, touch: false, timer: null };

  if (!editing.value) {
    press.timer = setTimeout(() => {
      if (!press) return;
      const { item: held } = press;
      clearPress();
      beginDrag(held, point.x, point.y);
    }, HOLD_MS);
  }

  point = { x: event.clientX, y: event.clientY };
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);
}

function onPointerMove(event: PointerEvent): void {
  if (event.pointerType === 'touch') return;

  if (dragId.value) {
    updateDrag(event.clientX, event.clientY);
    return;
  }

  if (!press) return;

  point = { x: event.clientX, y: event.clientY };
  const distance = Math.hypot(event.clientX - press.x, event.clientY - press.y);

  if (editing.value && distance > MOUSE_DRAG_START) {
    const { item } = press;
    clearPress();
    beginDrag(item, event.clientX, event.clientY);
  } else if (!editing.value && distance > MOVE_TOLERANCE) {
    clearPress();
  }
}

function onPointerUp(event: PointerEvent): void {
  if (event.pointerType === 'touch') return;

  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', onPointerUp);
  window.removeEventListener('pointercancel', onPointerUp);
  clearPress();
  endDrag();
}

/* ---- touch ---- */

function onTouchStart(event: TouchEvent, item: LayoutItem): void {
  if (event.touches.length !== 1 || isEditControl(event.target) || dragId.value) {
    clearPress();
    return;
  }

  const touch = event.touches[0];

  clearPress();
  point = { x: touch.clientX, y: touch.clientY };
  press = {
    item,
    x: touch.clientX,
    y: touch.clientY,
    touch: true,
    timer: setTimeout(() => {
      if (!press) return;
      const { item: held } = press;
      clearPress();
      beginDrag(held, point.x, point.y);
    }, editing.value ? HOLD_EDITING_MS : HOLD_MS),
  };
}

// Registered by hand (not in the template) because it must be able to cancel scrolling.
function onTouchMove(event: TouchEvent): void {
  const touch = event.touches[0];
  if (!touch) return;

  if (dragId.value || resizeDrag) {
    event.preventDefault();
    if (dragId.value) updateDrag(touch.clientX, touch.clientY);
    return;
  }

  if (press?.touch) {
    point = { x: touch.clientX, y: touch.clientY };

    // the finger moved before the hold finished: it is a scroll, not a pick-up
    if (Math.hypot(touch.clientX - press.x, touch.clientY - press.y) > MOVE_TOLERANCE) {
      clearPress();
    }
  }
}

function onTouchEnd(): void {
  if (press?.touch) clearPress();
  endDrag();
}

/* ------------------------------------------------------------------ */

onMounted(() => {
  const el = root.value;

  if (el) {
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);
    el.addEventListener('touchcancel', onTouchEnd);
  }

  window.addEventListener('keydown', onWindowKeydown);
  window.addEventListener('resize', measure);

  sideQuery = window.matchMedia?.(SIDE_QUERY) ?? null;
  onSideChange();
  sideQuery?.addEventListener?.('change', onSideChange);

  measure();

  if (wrap.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(wrap.value);
  }
});

onBeforeUnmount(() => {
  const el = root.value;

  if (el) {
    el.removeEventListener('touchmove', onTouchMove);
    el.removeEventListener('touchend', onTouchEnd);
    el.removeEventListener('touchcancel', onTouchEnd);
  }

  resizeObserver?.disconnect();
  resizeObserver = null;

  window.removeEventListener('keydown', onWindowKeydown);
  window.removeEventListener('resize', measure);
  sideQuery?.removeEventListener?.('change', onSideChange);
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', onPointerUp);
  window.removeEventListener('pointercancel', onPointerUp);
  window.removeEventListener('pointermove', onResizeMove);
  window.removeEventListener('pointerup', onResizeEnd);
  window.removeEventListener('pointercancel', onResizeEnd);

  clearPress();
  cancelAnimationFrame(frame);
  if (confirmTimer) clearTimeout(confirmTimer);
  if (suppressTimer) clearTimeout(suppressTimer);
  ghost?.remove();
  ghost = null;
  dragId.value = null;
  dragRows.value = 0;
  preview.value = null;
  resizing.value = null;

  // never come back to the home page stuck in edit mode
  if (editing.value) {
    editing.value = false;
    layout.save();
  }
});
</script>

<style scoped>
.home-widgets {
  --pad: 14px;
  --max: 1320px;
  box-sizing: border-box;
  max-width: var(--max);
  margin: 0 auto;
  padding: 16px var(--pad) 40px;
}

.home-widgets.editing {
  padding-bottom: 120px;
}

@media (min-width: 648px) {
  .home-widgets {
    --pad: 20px;
  }
}

/*
  Laptops and landscape iPads (the countdown is docked on the left): the grid
  may grow up to 1900px, but on a short screen it stops growing once the six
  rows of the default layout would no longer fit without scrolling. 960px is
  the narrowest the 12-column layout can be.
*/
@media (min-width: 1024px) and (orientation: landscape) {
  .home-widgets {
    --max: clamp(960px, calc(200vh - 310px), 1900px);
  }
}

/*
  A grid of square cells. How many fit across depends on the room the grid
  has, not on the screen: 12 on a laptop, 10 beside the countdown panel on a
  landscape iPad, 8 on a portrait iPad, 4 on a phone.

  --cell is the width of one column, also used as the row height so cells
  stay square. Modern browsers measure the grid's own width (the @supports
  block); the first set of rules is the same math estimated from the screen
  width for browsers without container queries.
*/
.grid-wrap {
  position: relative;
}

.grid,
.slots {
  --cols: 4;
  --cell: calc(
    (min(100vw - var(--hero-width, 0px), var(--max)) - 2 * var(--pad) - (var(--cols) - 1) * var(--w-gap)) / var(--cols)
  );
  display: grid;
  grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
  /* every item says which cells it covers (see cellStyle); --rows keeps empty rows open while editing */
  grid-template-rows: repeat(var(--rows, 1), var(--cell));
  grid-auto-rows: var(--cell);
  gap: var(--w-gap);
}

/* the empty cells, drawn under the items while editing */
.slots {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.slot {
  border-radius: 28%;
  background: var(--w-soft);
  box-shadow: inset 0 0 0 1px var(--w-line);
  transform: scale(0.78);
  animation: slot-in 0.25s ease both;
}

@keyframes slot-in {
  from { opacity: 0; transform: scale(0.5); }
}

@media (min-width: 648px) {
  .grid,
  .slots {
    --cols: 8;
  }
}

@media (min-width: 1024px) {
  .grid,
  .slots {
    --cols: 12;
  }
}

@media (min-width: 1024px) and (max-width: 1249.9px) and (orientation: landscape) {
  .grid,
  .slots {
    --cols: 10;
  }
}

@supports (container-type: inline-size) {
  .grid-wrap {
    container: home-grid / inline-size;
  }

  .grid,
  .slots {
    --cols: 4;
    --cell: calc((100cqw - (var(--cols) - 1) * var(--w-gap)) / var(--cols));
  }

  @container home-grid (min-width: 600px) {
    .grid,
    .slots {
      --cols: 8;
    }
  }

  @container home-grid (min-width: 900px) {
    .grid,
    .slots {
      --cols: 12;
    }
  }

  /*
    Landscape iPads (1024 to 1250px wide): 8 columns beside the panel makes
    the default layout nine rows tall, so the shortcuts end up below the
    fold. 10 columns keeps the widgets close to the size they were drawn for
    and fits the whole home screen in seven rows, like a laptop.
  */
  @media (min-width: 1024px) and (orientation: landscape) {
    @container home-grid (min-width: 640px) and (max-width: 899.9px) {
      .grid,
      .slots {
        --cols: 10;
      }
    }
  }
}

.cell {
  position: relative;
  min-width: 0;
  min-height: 0;
  outline: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}

.cell-inner {
  width: 100%;
  height: 100%;
  /* scales the widget's contents with the size of the grid (see updateZoom) */
  zoom: var(--w-zoom, 1);
}

.cell :deep(a),
.cell :deep(img) {
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
}

/* items glide to their new spots when the order changes */
.reflow-move {
  transition: transform 0.26s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.reflow-enter-active {
  transition: opacity 0.22s ease, transform 0.26s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.reflow-enter-from {
  opacity: 0;
  transform: scale(0.82);
}

.reflow-leave-active {
  display: none;
}

/* ---------------------------------------------------------------------- */
/* Edit mode                                                               */
/* ---------------------------------------------------------------------- */

.editing .cell {
  cursor: grab;
}

.editing .cell:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 4px;
  border-radius: var(--w-radius);
}

.editing .cell-inner {
  animation: wiggle 0.34s ease-in-out infinite alternate;
}

.editing .cell.s-icon .cell-inner {
  animation-name: wiggle-icon;
  animation-duration: 0.28s;
}

/* stagger the wiggle so the items don't all move in step */
.editing .cell:nth-child(2n) .cell-inner {
  animation-delay: -0.17s;
}

.editing .cell:nth-child(3n) .cell-inner {
  animation-duration: 0.39s;
}

@keyframes wiggle {
  from { transform: rotate(-0.45deg); }
  to { transform: rotate(0.45deg); }
}

@keyframes wiggle-icon {
  from { transform: rotate(-2.2deg); }
  to { transform: rotate(2.2deg); }
}

.shield {
  position: absolute;
  inset: 0;
  z-index: 2;
  border-radius: var(--w-radius);
}

.edit-btn {
  position: absolute;
  z-index: 3;
  width: 26px;
  height: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid var(--w-line-strong);
  border-radius: 50%;
  background: var(--secondaryBackground);
  color: var(--primary);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.22);
  animation: pop 0.2s cubic-bezier(0.2, 0.9, 0.3, 1.4);
  -webkit-tap-highlight-color: transparent;
}

/* a larger invisible hit area so the small buttons are easy to tap */
.edit-btn::after {
  content: '';
  position: absolute;
  inset: -9px;
}

.edit-btn.remove {
  top: -8px;
  left: -8px;
}

.edit-btn.settings {
  top: -8px;
  right: -8px;
  border-color: transparent;
  background: var(--accent);
  color: var(--w-on-accent);
}

.edit-btn:focus-visible,
.bar-btn:focus-visible,
.edit-home:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* the corner handle: drag to resize, tap to step through the sizes */
.resize-handle {
  position: absolute;
  z-index: 3;
  right: -9px;
  bottom: -9px;
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid var(--w-line-strong);
  border-radius: 50%;
  background: var(--secondaryBackground);
  color: var(--accent);
  cursor: nwse-resize;
  touch-action: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.22);
  animation: pop 0.2s cubic-bezier(0.2, 0.9, 0.3, 1.4);
  -webkit-tap-highlight-color: transparent;
}

.resize-handle::after {
  content: '';
  position: absolute;
  inset: -9px;
}

.resize-handle svg {
  width: 17px;
  height: 17px;
  fill: none;
  stroke: currentColor;
  stroke-width: 3;
  stroke-linecap: round;
}

/* on a plain shortcut the handle sits on the icon's own corner, clear of its name */
.cell.s-icon .resize-handle {
  width: 22px;
  height: 22px;
  right: calc(9.5px * var(--w-zoom, 1) - 11px);
  bottom: calc(19px * var(--w-zoom, 1) - 11px);
}

.cell.s-icon .resize-handle svg {
  width: 13px;
  height: 13px;
}

.resize-handle:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* the item being resized, outlined so its new footprint is clear */
.cell.resizing::after {
  content: '';
  position: absolute;
  inset: -3px;
  z-index: 1;
  border: 2px dashed var(--accent);
  border-radius: calc(var(--w-radius) + 3px);
  pointer-events: none;
}

.is-resizing,
.is-resizing * {
  cursor: nwse-resize !important;
}

@keyframes pop {
  from { transform: scale(0); }
}

/* ---- dragging ---- */

/* the spot the dragged item will land in */
.cell.dragging > * {
  visibility: hidden;
}

.cell.dragging::before {
  content: '';
  position: absolute;
  inset: 0;
  border: 2px dashed var(--w-line-strong);
  border-radius: var(--w-radius);
  background: var(--w-soft);
}

.cell.s-icon.dragging::before {
  inset: 0 12% 22%;
  border-radius: 27%;
}

/* the copy that follows the pointer */
.cell.ghost {
  position: fixed;
  z-index: 300;
  margin: 0;
  pointer-events: none;
  cursor: grabbing;
  will-change: transform;
}

.cell.ghost.settling {
  transition: transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.cell.ghost .cell-inner {
  animation: none;
  transform: scale(1.05);
  filter: drop-shadow(0 18px 22px rgba(0, 0, 0, 0.3));
  transition: transform 0.15s ease;
}

.cell.ghost.settling .cell-inner {
  transform: scale(1);
}

.cell.ghost .edit-btn,
.cell.ghost .resize-handle {
  display: none;
}

.is-dragging,
.is-dragging .cell {
  cursor: grabbing;
}

/* ---------------------------------------------------------------------- */
/* Controls around the grid                                                */
/* ---------------------------------------------------------------------- */

.empty-home {
  margin: 40px 0 10px;
  text-align: center;
  font-size: 14px;
  color: var(--w-muted);
}

.home-foot {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 26px;
}

.edit-home {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 16px;
  border: 1px solid var(--w-line);
  border-radius: 999px;
  background: var(--secondaryBackground);
  color: var(--w-muted);
  font: inherit;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.15s ease, border-color 0.15s ease;
  -webkit-tap-highlight-color: transparent;
}

.edit-home:hover {
  color: var(--primary);
  border-color: var(--w-line-strong);
}

.edit-bar {
  position: fixed;
  /* centered over the widgets, which sit to the right of the countdown panel on wide screens */
  left: calc(50% + var(--hero-width, 0px) / 2);
  bottom: calc(18px + env(safe-area-inset-bottom));
  transform: translateX(-50%);
  z-index: 200;
  display: flex;
  gap: 6px;
  max-width: calc(100vw - var(--hero-width, 0px) - 20px);
  box-sizing: border-box;
  padding: 6px;
  border: 1px solid var(--w-line);
  border-radius: 999px;
  background: var(--secondaryBackground);
  box-shadow: 0 14px 40px -10px rgba(0, 0, 0, 0.5), 0 2px 6px rgba(0, 0, 0, 0.1);
}

.bar-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 40px;
  padding: 0 16px;
  border: none;
  border-radius: 999px;
  background: var(--w-soft);
  color: var(--primary);
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.bar-btn:hover {
  background: var(--w-line);
}

.bar-btn.warn {
  background: #d63031;
  color: #fff;
}

.clock-switch {
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  border-radius: 999px;
  background: var(--w-soft);
}

.clock-option {
  width: 36px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: var(--w-muted);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.clock-option.on {
  background: var(--secondaryBackground);
  color: var(--accent);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
}

.clock-option:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.bar-btn.done {
  background: var(--accent);
  color: var(--w-on-accent);
}

.bar-btn.done:hover {
  filter: brightness(1.08);
}

.bar-enter-active,
.bar-leave-active {
  transition: opacity 0.2s ease, transform 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.bar-enter-from,
.bar-leave-to {
  opacity: 0;
  transform: translate(-50%, 24px);
}

@media (prefers-reduced-motion: reduce) {
  .editing .cell-inner,
  .edit-btn,
  .resize-handle,
  .slot {
    animation: none;
  }

  .reflow-move,
  .reflow-enter-active,
  .cell.ghost.settling {
    transition: none;
  }
}
</style>
