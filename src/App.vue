<template>
  <div id="app" :style="style" tabindex="-1">
    <router-view />
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import useThemeStore from '@/stores/themes';
import { fallbackTheme } from "@/utils/themes.ts";
import useScheduleStore from '@/stores/schedules';
import useClockStore from '@/stores/clock';
import useUserSettingsStore from '@/stores/user-settings';

export default {
  computed: {
    ...mapState(useThemeStore, ['theme', 'color']),
    style() {
      const fallback = fallbackTheme(this.theme).styling;
      const styling = this.theme.styling;

      return {
        '--accent': styling.accent || fallback.accent,
        '--background': styling.background || fallback.background,
        '--secondaryBackground': styling.secondaryBackground || fallback.secondaryBackground,
        '--headerBackground': styling.header?.background || fallback.header.background,
        '--headerScheduleBar': styling.header?.scheduleBar || fallback.header.scheduleBar,
        color: styling.text?.primary || fallback.text.primary,
        '--secondary': styling.text?.secondary || fallback.text.secondary,
        '--tertiary': styling.text?.tertiary || fallback.text.tertiary,
        '--iconCardsRegular': styling.iconCards?.regular || fallback.iconCards.regular,
        '--iconCardsInvert': styling.iconCards?.invert || fallback.iconCards.invert,
      };
    },
  },
  methods: {
    ...mapActions(useScheduleStore, ['initializeSchedule']),
    ...mapActions(useClockStore, ['pageLoaded']),
    ...mapActions(useThemeStore, ['initializeTheme']),
    ...mapActions(useUserSettingsStore, ['initializeGrade', 'initializeShowPWCSchedule']),
  },
  watch: {
    theme() {
      document.querySelector('body').style.background = this.theme.styling.background || fallbackTheme(this.theme).styling.background;
    },
    $route() {
      this.pageLoaded(this.$route);
    },
  },
  created() {
    if (import.meta.env.NODE_ENV === 'production') {
      console.log("welcome to stevenson.space \n\nFun Facts:\n1. The Apollo astronauts' footprints on the moon will probably stay there for at least 100 million years\n2. Our solar system is 4.5 billion years old\n3. The sun burns around 5 billion kg of hydrogen every second and will continue to burn for the next 4+ billion years\n4. Physics C is a cool class!\n\nhttps://github.com/stevenson-space/shs");
    }
    this.initializeSchedule(this.$route);
    this.initializeTheme();
    this.initializeGrade();
    this.initializeShowPWCSchedule();
    this.pageLoaded(this.$route);
    document.querySelector('body').style.background = this.theme.styling.background || fallbackTheme(this.theme).styling.background;
  },
};
</script>

<style lang="sass">
body
  margin: 0
  font-family: 'Open Sans', Helvetica, sans-serif

#app
  outline: none
</style>
