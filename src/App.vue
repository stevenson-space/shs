<template>
  <div id="app" :style="{ '--color': color }" tabindex="-1">
    <router-view />
  </div>
</template>

<script>
import initializeStore from '@/store/initializeStore';
import { mapState } from 'vuex';

export default {
  computed: mapState([
    'color',
  ]),
  watch: {
    $route() {
      this.$store.dispatch('pageLoaded', this.$route);
    },
  },
  created() {
    initializeStore(this.$store);
    this.$store.dispatch('pageLoaded', this.$route);
  },
};

</script>

<style lang="sass">
body
  background-color: white
  margin: 0
  font-family: 'Open Sans', Helvetica, sans-serif

#app
  outline: none

</style>
