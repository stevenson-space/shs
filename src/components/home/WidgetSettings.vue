<template>
  <!-- Countdown: what to count down to -->
  <SheetModal v-if="kind === 'countdown'" title="Countdown" @close="emit('close')">
    <label class="field">
      <span class="field-label">Name</span>
      <input v-model="title" class="input" type="text" maxlength="28" placeholder="Prom, Finals, Graduation..." />
    </label>

    <div class="field-row">
      <label class="field">
        <span class="field-label">Date</span>
        <input v-model="date" class="input" type="date" />
      </label>
      <label class="field">
        <span class="field-label">Time (optional)</span>
        <input v-model="time" class="input" type="time" />
      </label>
    </div>

    <p class="hint">Leave the date empty to count down to the next day off automatically.</p>

    <template #footer>
      <button class="btn" type="button" @click="clearCountdown">Use next day off</button>
      <button class="btn primary" type="button" @click="saveCountdown">Save</button>
    </template>
  </SheetModal>

  <!-- One of the student's own links (a home screen shortcut, and listed on the Links page) -->
  <SheetModal v-else-if="kind === 'link'" :title="config?.id ? 'Edit link' : 'Add a link'" @close="emit('close')">
    <div v-if="!config?.id" class="suggestions" aria-label="Ideas">
      <button
        v-for="idea in LINK_IDEAS"
        :key="idea"
        class="suggestion"
        :class="{ on: title === idea }"
        type="button"
        @click="title = idea"
      >
        {{ idea }}
      </button>
    </div>

    <label class="field" :class="{ first: !!config?.id }">
      <span class="field-label">Name</span>
      <input v-model="title" class="input" type="text" :maxlength="MAX_NAME_LENGTH" placeholder="ILC room booking" />
    </label>

    <label class="field">
      <span class="field-label">Link</span>
      <input
        v-model="url"
        class="input"
        :class="{ bad: url.trim() && !safeUrl }"
        type="url"
        inputmode="url"
        autocomplete="off"
        spellcheck="false"
        placeholder="Paste it here, like forms.gle/..."
      />
    </label>
    <p v-if="url.trim() && !safeUrl" class="hint error">
      That isn't a web link. Copy the address from the top of the page in your browser (it starts with https://).
    </p>
    <p v-else-if="safeUrl" class="hint">Opens {{ hostOf(safeUrl) }} in a new tab.</p>

    <div class="field">
      <span class="field-label">Color</span>
      <div class="swatches" role="radiogroup" aria-label="Color">
        <button
          v-for="swatch in ['', ...LINK_COLORS]"
          :key="swatch || 'theme'"
          class="swatch"
          :class="{ on: color === swatch, theme: !swatch }"
          :style="swatch ? { background: swatch } : undefined"
          type="button"
          role="radio"
          :aria-checked="color === swatch"
          :aria-label="swatch ? swatch : 'Theme color'"
          :title="swatch ? undefined : 'Theme color'"
          @click="color = swatch"
        />
      </div>
    </div>

    <p class="hint">Only you see your links: they stay on this device.</p>

    <template #footer>
      <button v-if="config?.id" class="btn danger" type="button" @click="emit('remove')">Delete</button>
      <button class="btn primary" type="button" :disabled="!title.trim() || !safeUrl" @click="saveLink">Save</button>
    </template>
  </SheetModal>

  <!-- An important date of the student's own (Breaks & Dates widget) -->
  <SheetModal v-else-if="kind === 'date'" :title="config?.id ? 'Edit date' : 'Add a date'" @close="emit('close')">
    <label class="field first">
      <span class="field-label">What is it?</span>
      <input v-model="title" class="input" type="text" maxlength="40" placeholder="AP Bio exam, prom, project due..." />
    </label>

    <label class="field">
      <span class="field-label">Date</span>
      <input v-model="date" class="input" type="date" />
    </label>

    <p class="hint">It counts down with the school breaks. Dates stay on this device.</p>

    <template #footer>
      <button v-if="config?.id" class="btn danger" type="button" @click="emit('remove')">Delete</button>
      <button class="btn primary" type="button" :disabled="!title.trim() || !date" @click="saveDate">Save</button>
    </template>
  </SheetModal>

  <!-- Schedule: the student's own classes -->
  <SheetModal v-else title="My classes" @close="emit('close')">
    <p class="hint top">Add your classes and the schedule (and the countdown at the top) shows them instead of "Period 3". They stay on this device.</p>

    <div class="class-head" aria-hidden="true">
      <span class="class-badge-space" />
      <span class="field-label">Class</span>
      <span class="field-label room-label">Room</span>
    </div>

    <div v-for="period in PERIODS" :key="period" class="class-row">
      <span class="class-badge">{{ period }}</span>
      <input
        class="input"
        type="text"
        :maxlength="maxLength"
        :value="names[period] ?? ''"
        :placeholder="`Period ${period}`"
        :aria-label="`Class for period ${period}`"
        @input="setName(period, ($event.target as HTMLInputElement).value)"
      />
      <input
        class="input room"
        type="text"
        :maxlength="maxRoomLength"
        :value="rooms[period] ?? ''"
        placeholder="Room"
        :aria-label="`Room for period ${period}`"
        @input="setRoom(period, ($event.target as HTMLInputElement).value)"
      />
    </div>

    <template #footer>
      <button class="btn primary" type="button" @click="emit('close')">Done</button>
    </template>
  </SheetModal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import SheetModal from './SheetModal.vue';
import { usePeriodNames } from './periodNames';
import { LINK_COLORS, MAX_NAME_LENGTH } from './myLinks';
import { hostOf, normalizeUrl } from './linkCheck';

const { kind, config = undefined } = defineProps<{
  kind: 'countdown' | 'classes' | 'date' | 'link';
  config?: Record<string, string>;
}>();

const emit = defineEmits<{
  close: [];
  // countdown: an empty object means "go back to automatic". date: { title, date }. link: { title, url, color }
  save: [config: Record<string, string>];
  // date, link: delete it
  remove: [];
}>();

const PERIODS = ['1', '2', '3', '4', '5', '6', '7', '8'];

const { names, rooms, setName, setRoom, maxLength, maxRoomLength } = usePeriodNames();

// config.date is a local "YYYY-MM-DDTHH:mm" (the time part is optional)
const [savedDate = '', savedTime = ''] = (config?.date ?? '').split('T');
const title = ref(config?.title ?? '');
const date = ref(savedDate);
const time = ref(savedTime === '00:00' ? '' : savedTime);

function saveCountdown(): void {
  if (!date.value) {
    emit('save', {});
    return;
  }

  emit('save', {
    title: title.value.trim(),
    date: time.value ? `${date.value}T${time.value}` : date.value,
  });
}

function clearCountdown(): void {
  emit('save', {});
}

// ideas for a first link; tapping one fills in the name
const LINK_IDEAS = ['ILC room booking', 'Club sign-in', 'Google Classroom', "Teacher's site", 'Study group doc'];

const url = ref(config?.url ?? '');
const color = ref(config?.color ?? '');
const safeUrl = computed(() => normalizeUrl(url.value));

function saveLink(): void {
  if (!title.value.trim() || !safeUrl.value) return;
  emit('save', { title: title.value.trim(), url: safeUrl.value, color: color.value });
}

function saveDate(): void {
  if (!title.value.trim() || !date.value) return;
  emit('save', { title: title.value.trim(), date: date.value });
}
</script>

<style scoped>
.field {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 10px;
}

.field-row {
  display: flex;
  gap: 12px;
}

.field-label {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--w-muted);
}

.input {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  height: 42px;
  padding: 0 12px;
  border: 1.5px solid var(--w-line-strong);
  border-radius: 12px;
  background: var(--background);
  color: var(--primary);
  font: inherit;
  font-size: 15px;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--w-soft);
}

.input::placeholder {
  color: var(--w-muted);
  opacity: 0.7;
}

.hint {
  margin: 12px 0 0;
  font-size: 13px;
  line-height: 1.45;
  color: var(--w-muted);
}

.hint.top {
  margin: 0 0 12px;
}

.field.first {
  margin-top: 0;
}

.class-head,
.class-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
}

.class-head {
  margin-top: 0;
}

.class-badge-space {
  flex: none;
  width: 30px;
}

.class-head .field-label {
  flex: 1 1 auto;
}

.class-head .room-label,
.input.room {
  flex: none;
  width: 92px;
}

.class-badge {
  flex: none;
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--accent);
  color: var(--w-on-accent);
  font-size: 14px;
  font-weight: 800;
}

.btn {
  height: 40px;
  padding: 0 18px;
  border: 1.5px solid var(--w-line-strong);
  border-radius: 999px;
  background: transparent;
  color: var(--primary);
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.btn:hover {
  background: var(--w-soft);
}

.btn.primary {
  border-color: var(--accent);
  background: var(--accent);
  color: var(--w-on-accent);
}

.btn.primary:hover {
  filter: brightness(1.08);
}

.btn.primary:disabled {
  opacity: 0.45;
  cursor: default;
  filter: none;
}

.suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 4px;
}

.suggestion {
  height: 30px;
  padding: 0 12px;
  border: 1.5px solid var(--w-line-strong);
  border-radius: 999px;
  background: transparent;
  color: var(--primary);
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.suggestion:hover,
.suggestion.on {
  border-color: var(--accent);
  color: var(--accent);
}

.input.bad {
  border-color: #d63031;
}

.hint.error {
  color: #d63031;
}

.swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.swatch {
  width: 30px;
  height: 30px;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.12);
}

.swatch.theme {
  background: var(--accent);
}

.swatch.on {
  border-color: var(--secondaryBackground);
  box-shadow: 0 0 0 2px var(--primary);
}

.swatch:focus-visible,
.suggestion:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.btn.danger {
  margin-right: auto;
  border-color: #d63031;
  color: #d63031;
}

.btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
</style>
