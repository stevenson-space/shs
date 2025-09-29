import { defineStore } from 'pinia';
import _themeIdeas from '@/data/themeIdeas.json';
import _themes from '@/data/themes.json';
import { set as GASet } from 'vue-gtag';
import lightTheme from '@/themes/base/light.json'
import darkTheme from '@/themes/base/dark.json'
import { Theme } from '@/utils/types';

const DEFAULT_THEME: Theme = lightTheme as Theme;

interface State {
  theme: Theme,
  resolvedAssets: Map<string, string>,
}

export default defineStore('themes', {
  state: (): State => ({
    theme: DEFAULT_THEME,
    resolvedAssets: new Map(),
  }),
  actions: {
    initializeTheme(): void {
      // if (localStorage.color && import.meta.env.VITE_EDIT_COLORS !== 'true') {
      //   this.setColor(localStorage.color);
      //   GASet({ user_properties: {
      //     color: localStorage.color,
      //   } });
      // } else {
      //   GASet({ user_properties: {
      //     color: 'unset',
      //   } });
      // }
      if (localStorage.theme && import.meta.env.VITE_EDIT_COLORS !== 'true') {
        this.setTheme(JSON.parse(localStorage.theme));
      } else {
        this.setTheme(lightTheme as Theme);
      }
    },
    setColor(color:string): void {
    //   this.color = color;
    //   localStorage.color = color;
    //   GASet({ user_properties: {
    //     color,
    //   } });
    },
    setTheme(theme: Theme): void {
      // const color = theme.suggestedColor;
      // if (useThemeColor) {
      //   this.color = color;
      //   localStorage.color = color;
      //   GASet({ user_properties: {
      //     color,
      //   } });
      // }
      this.theme = theme;
      localStorage.theme = JSON.stringify(theme);
    },
  },
});
