<template>
  <div>
    <div class="header">
      <div class="custom-color-row">
        <RoundedButton
          class="reset-button"
          v-show="color != suggestedColor"
          @click="colorSelected(suggestedColor)"
          text="Reset"
        />
        <div
          ref="custom-color"
          class="custom-color"
          contenteditable="true"
          spellcheck="false"
          @keydown.enter="$event.target.blur()"
          @blur="colorSelected($event.target.innerText)"
        />
      </div>

      <home-link class="home-link" />
    </div>

    <theme-selector />
    <color-selector
      :colors="colors"
      :current-color="color"
      @color-selected="colorSelected"
    />

    <div ref="preview" class="preview" :style="{ height: previewHeight }">
      <div class="wrapper">
        <home />
      </div>
    </div>
  </div>
</template>

<script>
import colors from '@/data/colors.json';
import Home from '@/views/Home/Home.vue';
import HomeLink from '@/components/HomeLink.vue';
import RoundedButton from '@/components/RoundedButton.vue';
import { mapState, mapActions } from 'pinia';
import useThemeStore from '@/stores/themes-module';
import ThemeSelector from './ThemeSelector.vue';
import ColorSelector from './ColorSelector.vue';

const isValidColor = (color) => /^#([0-9a-f]{3}){1,2}$/i.test(color);

export default {
  components: {
    ColorSelector,
    Home,
    HomeLink,
    RoundedButton,
    ThemeSelector,
  },
  data() {
    return {
      colors,
      previewHeight: 0,
    };
  },
  computed: {
    ...mapState(useThemeStore, ['theme', 'color']),
    suggestedColor() {
      return this.theme.suggestedColor;
    },
  },
  watch: {
    color() {
      this.setCustomColorText();
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.setPreviewHeight();
    });
    this.setCustomColorText();
  },
  methods: {
    ...mapActions(useThemeStore, ['setColor']),
    colorSelected(color) {
      if (color !== this.color && isValidColor(color)) {
        this.setColor(color);
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
};
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
    border-radius: 10px
    +shadow-light
    &:focus
      outline-color: var(--color)
      outline-style: solid
      outline-width: 1px

.custom-color-row
  display: flex
  .reset-button
    margin-left: 10px

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
