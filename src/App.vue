<template>
<!-- vue 2 -->
  <div id="app" :style="style" tabindex="-1">
    <router-view />
  </div>
</template>

<script>
import initializeStore from '@/store/initializeStore';
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['color', 'theme']),
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

  watch: {
    theme() {
      document.querySelector('body').style.background = this.theme.background;
    },
    $route() {
      this.$store.dispatch('pageLoaded', this.$route);
    },
  },
  created() {
    initializeStore(this.$store);
    this.$store.dispatch('pageLoaded', this.$route);
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
