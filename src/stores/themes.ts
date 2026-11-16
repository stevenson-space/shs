import {defineStore} from 'pinia';
import {computed, readonly, ref} from 'vue';
import lightTheme from '@/themes/light.json'
import {Theme, ThemeStyling} from '@/utils/types';

const DEFAULT_THEME: Theme = lightTheme as Theme;

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

export default defineStore('themes', () => {
  const _styling = ref<ThemeStyling>(DEFAULT_THEME.styling);
  const resolvedAssets = ref(new Map<string, string>());
  const dismissedThemeCards = ref(parseDismissed());

  function dismissThemeRecommendation(name: string, year: number): void {
    dismissedThemeCards.value[name] = year;
    localStorage.setItem('dismissedThemeCards', JSON.stringify(dismissedThemeCards.value));
  }

  // TODO(theme)
  const theme = computed((): Theme => ({
    metadata: DEFAULT_THEME.metadata,
    visibility: DEFAULT_THEME.visibility,
    styling: _styling.value,
  }));

  function initializeTheme(): void {
    if (localStorage.themeStyling) {
      try {
        _styling.value = JSON.parse(localStorage.themeStyling);
      } catch {
        _styling.value = DEFAULT_THEME.styling;
      }
    } else {
      _styling.value = DEFAULT_THEME.styling;
    }
  }

  function setColor(color: string): void {
    // TODO: remove uses of this
  }

  function setStyling(value: ThemeStyling | Theme): void {
    _styling.value = 'styling' in value ? value.styling : value;
    localStorage.themeStyling = JSON.stringify(_styling.value);
  }

  return {
    styling: readonly(_styling),
    resolvedAssets,
    theme,
    initializeTheme,
    setColor,
    setStyling,
    dismissedThemeCards: readonly(dismissedThemeCards),
    dismissThemeRecommendation,
  };
});
