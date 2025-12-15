<template>
  <div id="app" tabindex="-1">
    <router-view />
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import useThemeStore from '@/stores/themes';
import { fallbackStyling } from '@/utils/themes.ts';
import useScheduleStore from '@/stores/schedules';
import useClockStore from '@/stores/clock';
import useUserSettingsStore from '@/stores/user-settings';

export default {
  computed: {
    ...mapState(useThemeStore, ['styling', 'color']),
  },
  methods: {
    ...mapActions(useScheduleStore, ['initializeSchedule']),
    ...mapActions(useClockStore, ['pageLoaded']),
    ...mapActions(useThemeStore, ['initializeTheme']),
    ...mapActions(useUserSettingsStore, ['initializeGrade', 'initializeShowPWCSchedule']),
    applyThemeVars(styling) {
      const fallback = fallbackStyling(styling);
      const s = styling || {};
      const set = (name, value) => document.documentElement.style.setProperty(name, value);

      set('--accent', s.accent || fallback.accent);
      set('--background', s.background || fallback.background);
      set('--secondaryBackground', s.secondaryBackground || fallback.secondaryBackground);
      set('--headerBackground', s.header?.background || fallback.header.background);
      set('--headerScheduleBar', s.header?.scheduleBar || fallback.header.scheduleBar);
      set('--primary', s.text?.primary || fallback.text.primary);
      set('--secondary', s.text?.secondary || fallback.text.secondary);
      set('--tertiary', s.text?.tertiary || fallback.text.tertiary);
      set('--iconCardsRegular', s.iconCards?.regular || fallback.iconCards.regular);
      set('--iconCardsInvert', s.iconCards?.invert || fallback.iconCards.invert);

      document.documentElement.style.color = s.text?.primary || fallback.text.primary;

      document.body.style.background = s.background || fallback.background;
    },
  },
  watch: {
    styling: {
      handler(newStyling) {
        this.applyThemeVars(newStyling);
      },
      deep: true,
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
    this.applyThemeVars(this.styling);
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
