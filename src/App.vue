<template>
  <div id="app" :style="style" tabindex="-1">
    <router-view />
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import useThemeStore from '@/stores/themes';
import useScheduleStore from '@/stores/schedules';
import useUserSettingsStore from '@/stores/user-settings';

export default {
  computed: {
    ...mapState(useThemeStore, ['theme', 'color']),
    style() {
      return {
        '--color': this.color,
        '--background': this.theme.background,
        '--secondaryBackground': this.theme.secondaryBackground,
        '--headerBackgroundColor': this.theme.headerBackgroundColor,
        '--headerScheduleBackgroundColor': this.theme.headerScheduleBackgroundColor,
        color: this.theme.primary,
        '--secondary': this.theme.secondary,
        '--tertiary': this.theme.tertiary,
        '--iconTextCardColor': this.theme.iconTextCardColor,
        '--iconTextCardInvertColor': this.theme.iconTextCardInvertColor,
      };
    },
  },
  methods: {
    ...mapActions(useScheduleStore, ['initializeSchedule', 'pageLoaded']),
    ...mapActions(useThemeStore, ['initializeTheme']),
    ...mapActions(useUserSettingsStore, ['initializeGrade']),
  },
  watch: {
    theme() {
      document.querySelector('body').style.background = this.theme.background;
    },
    $route() {
      this.pageLoaded(this.$route);
    },
  },
  created() {
    if (process.env.NODE_ENV === 'production') {
      console.log("welcome to stevenson.space \n\nFun Facts:\n1. The Apollo astronauts' footprints on the moon will probably stay there for at least 100 million years\n2. Our solar system is 4.5 billion years old\n3. The sun burns around 5 billion kg of hydrogen every second and will continue to burn for the next 4+ billion years\n4. Physics C is a cool class!\n\nhttps://github.com/stevenson-space/shs");
    }
    this.initializeSchedule(this.$route);
    this.initializeTheme();
    this.initializeGrade();
    this.pageLoaded(this.$route);
    document.querySelector('body').style.background = this.theme.background;
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
