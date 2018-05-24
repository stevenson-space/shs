<template>
  <div id="app">
    <sitebar logo="images/patriot.png"/>

    <tile-container>
      <tile v-for="num in Array(numTiles)"/>
    </tile-container>
  </div>
</template>

<script>
import Sitebar from './components/Sitebar.vue';
import TileContainer from './components/TileContainer.vue';
import Tile from './components/Tile.vue';

export default {
  data() {
    return {
      numTiles: 4,
    }
  },
  components: { Sitebar, TileContainer, Tile },
};
</script>

<style lang="sass" scoped>
#app
    display: flex
    flex-flow: column nowrap
    justify-content: center
    align-items: center

</style>
