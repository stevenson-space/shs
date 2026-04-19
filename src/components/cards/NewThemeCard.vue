<template>
  <card v-if="newTheme != null && !isDismissed">
    <div class="card-content">
      <div class="row">
        <rounded-button
          class="button"
          text="Try"
          :circular="false"
          @click="toggleTheme()"
        />
        <div class="message">{{ newTheme.recommended?.message?.replace('[Try]', '') || '' }}</div>
      </div>
      <info-tooltip v-if="newTheme.metadata?.description" @click.stop>
        {{ newTheme.metadata.description }}
      </info-tooltip>
      <button type="button" class="close-btn" @click="dismiss">&times;</button>
    </div>
  </card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import useClockStore from '@/stores/clock';
import useThemeStore from '@/stores/themes';
import RoundedButton from '@/components/RoundedButton.vue';
import Card from '@/components/Card.vue';
import InfoTooltip from '@/components/InfoTooltip.vue';
import { parseDateRange, isDateInRange, loadAllThemes } from '@/utils/themes';

const themeStore = useThemeStore();
const clockStore = useClockStore();

const themes = ref<any[]>([]);
function parseDismissed(): Record<string, number> {
  try {
    const parsed = JSON.parse(localStorage.getItem('dismissedThemeCards') || '{}');
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {};
    if (Object.values(parsed).some((v) => typeof v !== 'number')) return {};
    return parsed as Record<string, number>;
  } catch {
    return {};
  }
}
const dismissedThemesRef = reactive<Record<string, number>>(parseDismissed());

const newTheme = computed(() => {
  // finds a seasonal theme that is within the current date range
  const now = clockStore.date;

  for (const theme of themes.value) {
    if (!theme.seasonalDates) continue;

    const [start, end] = parseDateRange(theme.seasonalDates, now);
    if (isDateInRange(now, start, end)) {
      return theme;
    }
  }
  return null;
});

const isDismissed = computed(() => {
  if (!newTheme.value) return false;
  const currentYear = clockStore.date.getFullYear();
  return dismissedThemesRef[newTheme.value.metadata.name] === currentYear;
});

function toggleTheme(): void {
  if (!newTheme.value) return;
  themeStore.setStyling(newTheme.value.styling);
}

function dismiss(): void {
  if (!newTheme.value) return;
  const currentYear = clockStore.date.getFullYear();
  dismissedThemesRef[newTheme.value.metadata.name] = currentYear;
  localStorage.setItem('dismissedThemeCards', JSON.stringify(dismissedThemesRef));
}

onMounted(async () => {
  themes.value = await loadAllThemes();
});
</script>

<style lang="sass" scoped>
.card-content
  display: flex
  align-items: center
  gap: 10px
  padding: 15px
  position: relative

.row
  display: flex
  justify-content: center
  align-items: center
  gap: 10px
  flex: 1

.message
  font-size: .9em
  text-align: center

.description
  text-align: center
  font-size: .9em
  flex: 1

.button
  width: 40px
  height: 10px

.close-btn
  background: transparent
  border: none
  font-size: 24px
  color: var(--secondary)
  cursor: pointer
  padding: 0
  width: 30px
  height: 30px
  display: flex
  align-items: center
  justify-content: center
  line-height: 1
  opacity: 0.6
  transition: opacity 0.2s
  flex-shrink: 0

  &:hover
    opacity: 1
</style>
