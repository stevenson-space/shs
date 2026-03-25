<template>
  <card v-if="activeThemes[currentIndex] != null && !isDismissed">
    <div class="card-content">
      <div class="row">
        <rounded-button
          class="button"
          text="Try"
          :circular="false"
          @click="toggleTheme()"
        />
        <div class="message">{{ activeThemes[currentIndex].recommended?.message?.replace('[Try]','') || '' }}</div>
        <button v-if="activeThemes.length === 1" class="close-btn fallback" @click.stop="dismiss">&times;</button>
      </div>
      <div v-if="activeThemes.length > 1" class="divider"></div>
      <div v-if="activeThemes.length > 1" class="theme-nav">
        <button class="nav-btn" @click.stop="switchTheme">
        <font-awesome-icon :icon="faArrowsRotate" />
        </button>
        <button class="nav-btn close-btn" @click.stop="dismiss">&times;</button>
        </div>
      </div>
  </card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import useClockStore from '@/stores/clock';
import useThemeStore from '@/stores/themes';
import RoundedButton from '@/components/RoundedButton.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons'
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

const activeThemes = computed(() => {
  const now = clockStore.date;
  return themes.value.filter(theme => {
    if (!theme.seasonalDates) return false;
    const [start, end] = parseDateRange(theme.seasonalDates, now);
    return isDateInRange(now, start, end);
  });
});

const currentIndex = ref(0);

function switchTheme(): void {
  if (activeThemes.value.length === 0) return;
  currentIndex.value = (currentIndex.value + 1) % activeThemes.value.length;
}

const currentTheme = computed(() => activeThemes.value[currentIndex.value] || null);

const isDismissed = computed(() => {
  if (!currentTheme.value) return false;
  const currentYear = clockStore.date.getFullYear();
  return dismissedThemesRef[currentTheme.value.metadata.name] === currentYear;
});

function toggleTheme(): void {
  if (!currentTheme.value) return;
  themeStore.setStyling(currentTheme.value.styling);
}

function dismiss(): void {
  isDismissed.value = true // dismisses the entire card if "x" pressed once
}

</script>

<style lang="sass" scoped>
.card-content
  display: flex
  flex-direction: column
  align-items: center
  gap: 10px
  padding: 0 8px
  padding-bottom: 5px
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

.divider
  height: 1px
  background-color: var(--accent)
  margin: 3px 0

.theme-nav
  display: flex
  justify-content: center
  align-items: center
  gap: 8px
  margin-top: 5px

.nav-btn
  background: transparent
  border: none
  color: var(--secondary)
  width: 30px
  height: 30px
  cursor: pointer
  display: flex
  justify-content: center
  align-items: center
  opacity: 0.6
  transition: opacity 0.2s
  flex-shrink: 0

  &:hover
    opacity: 1

.close-btn.fallback
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
</style>
