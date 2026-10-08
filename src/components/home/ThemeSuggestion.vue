<template>
  <div v-if="suggestion && !dismissed" class="suggestion">
    <Sparkles class="spark" :size="16" :stroke-width="2.2" aria-hidden="true" />
    <span class="message">{{ message }}</span>
    <info-tooltip v-if="suggestion.metadata?.description" class="info" @click.stop>
      {{ suggestion.metadata.description }}
    </info-tooltip>
    <button class="try" type="button" @click="tryTheme">Try it</button>
    <button class="dismiss" type="button" aria-label="Dismiss" @click="dismiss">
      <X :size="15" :stroke-width="2.6" aria-hidden="true" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { Sparkles, X } from 'lucide-vue-next';
import useClockStore from '@/stores/clock';
import useThemeStore from '@/stores/themes';
import InfoTooltip from '@/components/InfoTooltip.vue';
import { parseDateRange, isDateInRange, loadAllThemes } from '@/utils/themes';

/*
  A one-line banner offering the seasonal theme while it is in season.
  Dismissing it hides it for the rest of that year (same storage key the
  old "new theme" card used, so earlier dismissals still count).
*/

const themeStore = useThemeStore();
const clockStore = useClockStore();

const STORAGE_KEY = 'dismissedThemeCards';

const themes = ref<any[]>([]);

function readDismissed(): Record<string, number> {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {};
    if (Object.values(parsed).some((value) => typeof value !== 'number')) return {};
    return parsed as Record<string, number>;
  } catch {
    return {};
  }
}

const dismissedYears = reactive<Record<string, number>>(readDismissed());

// the seasonal theme whose date range includes today, if any
const suggestion = computed(() => {
  const now = clockStore.date;

  return themes.value.find((theme) => {
    if (!theme.seasonalDates) return false;
    const [start, end] = parseDateRange(theme.seasonalDates, now);
    return isDateInRange(now, start, end);
  }) ?? null;
});

const dismissed = computed(() => !!suggestion.value
  && dismissedYears[suggestion.value.metadata.name] === clockStore.date.getFullYear());

// theme files write the message as "[Try] The Fall Theme"; the button replaces the tag
const message = computed(() => (suggestion.value?.recommended?.message ?? `The ${suggestion.value?.metadata?.name} theme`)
  .replace('[Try]', '')
  .trim());

function tryTheme(): void {
  if (suggestion.value) themeStore.setStyling(suggestion.value.styling);
}

function dismiss(): void {
  if (!suggestion.value) return;
  dismissedYears[suggestion.value.metadata.name] = clockStore.date.getFullYear();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dismissedYears));
}

onMounted(async () => {
  themes.value = await loadAllThemes();
});
</script>

<style scoped>
.suggestion {
  box-sizing: border-box;
  max-width: 100%;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  min-height: 42px;
  padding: 5px 6px 5px 14px;
  border: 1px solid var(--w-line);
  border-radius: 999px;
  background: var(--secondaryBackground);
  color: var(--primary);
  box-shadow: var(--w-shadow);
}

.spark {
  flex: none;
  color: var(--accent);
}

.message {
  min-width: 0;
  font-size: 14px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.info {
  flex: none;
}

.try {
  flex: none;
  height: 30px;
  padding: 0 14px;
  border: none;
  border-radius: 999px;
  background: var(--accent);
  color: var(--w-on-accent);
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.try:hover {
  filter: brightness(1.08);
}

.dismiss {
  flex: none;
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--w-muted);
  cursor: pointer;
}

.dismiss:hover {
  background: var(--w-soft);
  color: var(--primary);
}

.try:focus-visible,
.dismiss:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
</style>
