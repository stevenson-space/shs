<template>
  <div id="app" :style="{ '--color': color }">
    <router-view/>
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
  mounted() {
    if (localStorage.color) {
      this.color = localStorage.color;
    }

    EventBus.$on('set-color', color => {
      this.color = color;
      localStorage.color = color;
    });
  }
};

</script>

<style lang="sass">
body
  background-color: white
  margin: 0
  font-family: 'Open Sans', Helvetica, sans-serif

</style>
