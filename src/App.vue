<template>
<!-- vue 2 -->
  <div id="app" :style="style" tabindex="-1">
    <router-view />
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import useThemeStore from '@/stores/themes-module';
import useScheduleStore from '@/stores/schedules-module';
import useGradeStore from '@/stores/grade-module';

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
    ...mapActions(useGradeStore, ['initializeGrade']),
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
    // initializeStore(this.$store);
    this.initializeSchedule(this.$route);
    this.initializeTheme();
    this.initializeGrade();
    this.pageLoaded(this.$route);
    // this.$store.dispatch('pageLoaded', this.$route);
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
