<template>
  <div>
    <home-link class="home-link"/>

    <color-selector
      :colors="colors"
      :current-color="color"
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
  props: {
    color: { type: String, default: '' },
  },
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
      this.previewHeight = `calc(100vh - ${colorSelector.$el.offsetHeight}px - 20px)`
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setPreviewHeight();
    });
  },
  components: { ColorSelector, Home, HomeLink },
}
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.home-link
  position: absolute
  top: 10px
  right: 25px
  z-index: 2
  +mobile
    right: 5px
  
.preview
  width: 80%
  max-width: $content-width
  height: 500px
  overflow: auto
  margin: auto
  margin-top: 10px
  border-radius: 25px
  transition: box-shadow .2s
  min-width: 320px
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

    // This is placed over the Home preview to prevent anything in the preview from being clickable
    &::before
      position: absolute
      height: 100%
      width: 100%
      top: 0
      left: 0
      content: ''
      z-index: 26

</style>

