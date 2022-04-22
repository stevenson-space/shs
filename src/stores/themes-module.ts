import { defineStore } from 'pinia';
import _themeIdeas from '@/data/themeIdeas.json';
import _themes from '@/data/themes.json';
import { set as GASet } from 'vue-gtag';
import { ThemeData, Theme } from '@/utils/types';

const themes: Theme[] = _themes;
const themeIdeas: Theme[] = _themeIdeas;

interface State {
  color: string,
  theme: object,
}

export default defineStore('themes', {
  state: (): State => ({
    color: process.env.VUE_APP_EDIT_COLORS === 'true' ? themeIdeas[themeIdeas.length - 1].suggestedColor : themes[0].suggestedColor,
    theme: process.env.VUE_APP_EDIT_COLORS === 'true' ? themeIdeas[themeIdeas.length - 1] : themes[0],
  }),
  actions: {
    initialize(): void {
      if (localStorage.color && process.env.VUE_APP_EDIT_COLORS !== 'true') {
        this.setColor(localStorage.color);
        GASet({ user_properties: {
          color: localStorage.color,
        } });
      } else {
        GASet({ user_properties: {
          color: 'unset',
        } });
      }
      if (localStorage.theme && process.env.VUE_APP_EDIT_COLORS !== 'true') {
        const data:ThemeData = { theme: JSON.parse(localStorage.theme), useThemeColor: false };
        this.setTheme(data);
      }
    },
    setColor(color:string): void {
      this.color = color;
      localStorage.color = color;
      GASet({ user_properties: {
        color,
      } });
    },
    setTheme(data: ThemeData): void {
      const { useThemeColor, theme } = data;
      const color = theme.suggestedColor;
      if (useThemeColor) {
        this.color = color;
        localStorage.color = color;
        GASet({ user_properties: {
          color,
        } });
      }
      this.theme = theme;
      localStorage.theme = JSON.stringify(theme);
    },
  },
});
