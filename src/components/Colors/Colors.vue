<template>
  <div>
    <home-link class="home-link"/>

    <color-selector
      :colors="colors"
      @color-selected="colorSelected"
      ref="color-selector"/>

    <div class="preview" :style=" { height: previewHeight }">
      <router-link to="/" class="wrapper">
        <home/>
      </router-link>
    </div>
  </div>
</template>

<script>
import colors from 'src/data/colors.json';
import { EventBus } from 'src/js/event-bus.js';
import ColorSelector from './ColorSelector.vue';
import Home from 'src/components/Home/Home.vue';
import HomeLink from 'src/components/common/HomeLink.vue';

export default {
  data() {
    return {
      colors,
      previewHeight: 0,
    }
  },
  methods: {
    colorSelected(color) {
      EventBus.$emit('set-color', color);
    },
    setPreviewHeight() {
      const colorSelector = this.$refs['color-selector'];
      this.previewHeight = `calc(100vh - ${colorSelector.$el.offsetHeight}px - 50px)`
    }
  },
  mounted() {
    this.setPreviewHeight();
  },
  components: { ColorSelector, Home, HomeLink },
}
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.home-link
  position: absolute
  top: 5px
  right: 10px
  z-index: 2
  
.preview
  width: 80%
  max-width: $content-width
  height: 500px
  overflow: auto
  margin: auto
  margin-top: 25px
  border-radius: 25px
  transition: box-shadow .2s
  min-width: 320px
  // cursor: pointer
  &:hover
    +shadow
  +mobile
    width: 90%
    +shadow
  
  .wrapper
    position: relative
    z-index: 0
    text-decoration: none
    display: block
    color: inherit
    border-radius: 25px
    overflow: hidden

    // This is placed over Home to prevent anything in Home from being clickable
    &::before
      position: absolute
      height: 100%
      width: 100%
      // background-color: blue
      top: 0
      left: 0
      content: ''
      z-index: 26

</style>

