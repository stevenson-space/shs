<template>
  <div id="app">
    <!-- <sitebar logo="images/patriot.png"/>

    <tile-container>
      <tile v-for="num in Array(numTiles)"/>
    </tile-container> -->
    <router-view/>
  </div>
</template>

<script>
// import Sitebar from './components/Sitebar.vue';
// import TileContainer from './components/TileContainer.vue';
// import Tile from './components/Tile.vue';

export default {
  data() {
    return {
      // numTiles: 4,
    }
  },
  // components: { Sitebar, TileContainer, Tile },
};
</script>

<style lang="sass">
// #app
//     display: flex
//     flex-flow: column nowrap
//     justify-content: center
//     align-items: center

@import url('https://fonts.googleapis.com/css?family=Open+Sans:400,600')

body
  background-color: white
  margin: 0
  font-family: 'Open Sans', Helvetica, sans-serif

</style>
