import { defineStore } from 'pinia';
import lightTheme from '@/themes/base/light.json'
import { Theme, ThemeStyling } from '@/utils/types';

const DEFAULT_THEME: Theme = lightTheme as Theme;

interface State {
  _styling: ThemeStyling,
  resolvedAssets: Map<string, string>,
}

export default defineStore('themes', {
  state: (): State => ({
    _styling: DEFAULT_THEME.styling,
    resolvedAssets: new Map(),
  }),
  getters: {
    styling(state): ThemeStyling {
      return state._styling;
    },
    // TODO(theme)
    theme(state): Theme {
      return {
        metadata: DEFAULT_THEME.metadata,
        visibility: DEFAULT_THEME.visibility,
        styling: state._styling,
      };
    },
  },
  actions: {
    initializeTheme(): void {
      if (localStorage.themeStyling) {
        try {
          this._styling = JSON.parse(localStorage.themeStyling);
        } catch (error) {
          this._styling = DEFAULT_THEME.styling;
        }
      } else {
        this._styling = DEFAULT_THEME.styling;
      }
    },
    setColor(color:string): void {
      // TODO: remove uses of this
    },
    setStyling(styling: ThemeStyling | Theme): void {
      if ('styling' in styling) {
        this._styling = styling.styling;
      } else {
        this._styling = styling;
      }
      localStorage.themeStyling = JSON.stringify(this._styling);
    },
  },
});
