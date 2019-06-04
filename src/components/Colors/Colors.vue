<template>
  <div>
    <div class="header">
      <div
        class="custom-color"
        contenteditable="true"
        spellcheck="false"
        @keydown.enter="$event.target.blur()"
        @blur="colorSelected($event.target.innerText)"
        ref="custom-color"/>

      <home-link class="home-link"/>
    </div>

    <color-selector
      :colors="colors"
      :current-color="color"
      @color-selected="colorSelected"/>

    <div class="preview" :style=" { height: previewHeight }" ref="preview">
      <div class="wrapper">
        <home/>
      </div>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import { faPencilAlt, faEdit } from '@fortawesome/free-solid-svg-icons'
import colors from 'src/data/colors.json';
import ColorSelector from './ColorSelector.vue';
import Home from 'src/components/Home/Home.vue';
import HomeLink from 'src/components/common/HomeLink.vue';

import { mapState } from "vuex";

const isValidColor = color => {
  return /^#([0-9a-f]{3}){1,2}$/i.test(color);
}

export default {
  data() {
    return {
      faPencilAlt,
      colors,
      previewHeight: 0,
    }
  },
  computed: mapState([
    'color',
  ]),
  methods: {
    colorSelected(color) {
      if (color !== this.color && isValidColor(color)) {
        this.$store.commit('setColor', color);
      }
    },
    setPreviewHeight() {
      const { offsetTop } = this.$refs.preview;
      const marginBottom = 20;
      this.previewHeight = `calc(100vh - ${offsetTop}px - ${marginBottom}px)`;
    },
    setCustomColorText() {
      this.$nextTick(() => {
        this.$refs['custom-color'].innerHTML = this.color;
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.setPreviewHeight();
    });
    this.setCustomColorText();
  },
  watch: {
    color() {
      this.setCustomColorText();
    }
  },
  components: {
    FontAwesomeIcon,
    ColorSelector,
    Home,
    HomeLink
  },
}
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.header
  width: 80%
  max-width: $content-width
  display: flex
  justify-content: space-between
  align-items: center
  margin: 10px auto
  +mobile
    width: 90%

  .custom-color
    color: var(--color)
    font-weight: bold
    font-size: 1.2em
    margin-left: 5px
    padding: 5px 10px

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

