<template>
  <div id="app" :style="{ '--color': color }" tabindex="-1">
    <router-view :color="color"/>
  </div>
</template>

<script>
import { EventBus } from 'src/js/event-bus.js';

export default {
  data() {
    return {
      color: '#00796b',
    };
  },
  created() {
    if (localStorage.color) {
      this.color = localStorage.color;
      this.$ga.query('set', 'dimension1', localStorage.color)
    } else {
      this.$ga.query('set', 'dimension1', 'unset')
    }

    EventBus.$on('set-color', color => {
      this.color = color;
      localStorage.color = color;
      this.$ga.query('set', 'dimension1', color);
    });
  }
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
