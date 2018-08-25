<template>
  <div id="app" :style="{ '--color': color }">
    <router-view/>
  </div>
</template>

<script>

export default {
  data() {
    return {
      color: '#064789',
    };
  }
};

</script>

<style lang="sass">
body
  background-color: white
  margin: 0
  font-family: 'Open Sans', Helvetica, sans-serif

</style>
