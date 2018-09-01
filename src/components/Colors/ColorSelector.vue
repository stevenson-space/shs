<template>
  <div class="color-selector" @blur="hideShades" tabindex="-1">
    <div class="text" @mousedown="hideShades">
      Choose a <span class="colored">color</span>
    </div>

    <div class="container" @click.self="hideShades">
      <font-awesome-icon class="icon" :icon="icons.faChevronLeft" @click="scroll('left')"/>

      <div class="colors" ref="colors">
        <div
          class="color"
          v-for="shades in colors"
          :style="{ backgroundColor: shades[4] }"
          @click="arrEquals(currentShades, shades) ? hideShades() : showShades(shades, $event.target)"
          :key="shades.join(',')"/>
      </div>

      <font-awesome-icon class="icon" :icon="icons.faChevronRight" @click="scroll('right')"/>
    </div>

    <div class="shades" :style="{ left: `${shadesLeft}px`, top: `${shadesTop}px` }" v-show="currentShades">
      <div class="shade"
        v-for="shade in currentShades"
        :style="{ backgroundColor: shade }"
        @click="shadeClicked(shade)"
        :key="shade"/>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

export default {
  props: {
    colors: { type: Array, required: true },
  },
  data() {
    return {
      // carouselStart: 0,
      // numDisplayedColors: 10,
      icons: {
        faChevronLeft,
        faChevronRight,
      },
      currentShades: null,
      shadesLeft: 0,
      shadesTop: 0,
    }
  },
  // computed: {
  //   displayedColors() {
  //     const { colors, carouselStart, numDisplayedColors } = this;

  //     const putInBounds = (index, arr) => {
  //       while (index < 0) {
  //         index += arr.length;
  //       }
  //       index %= arr.length;
  //       return index;
  //     };

  //     const displayedColors = Array(numDisplayedColors)
  //       .fill(0)
  //       .map((_, i) => colors[putInBounds(i + carouselStart, colors)]);
      
  //     return displayedColors;
  //   },
  // },
  methods: {
    scroll(direction = 'right') {
      const $colors = this.$refs.colors;
      const multiplier = direction === 'right' ? 1 : -1;

      $colors.scrollBy({
        left: multiplier * $colors.offsetWidth * (3 / 4),
        behavior: 'smooth',
      });
    },
    showShades(shades, $color) {
      const $colors = this.$refs.colors;
      this.shadesLeft = $color.offsetLeft - $colors.scrollLeft;
      this.shadesTop = $color.offsetTop + $color.offsetHeight;
      this.currentShades = shades;
    },
    hideShades() {
      this.currentShades = null;
    },
    shadeClicked(shade) {
      this.$emit('color-selected', shade);
      this.hideShades();
    },
    arrEquals(arr1, arr2) {
      if (!arr1 || !arr2) return false;
      for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
          return false;
        }
      }
      return true;
    },
  },
  components: {
    FontAwesomeIcon,
  }
}
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.color-selector
  --color-diameter: 85px
  outline: none
  position: relative
  z-index: 1
  +mobile
    --color-diameter: 55px

  .text
    font-size: 3em
    margin-left: 25px
    margin-bottom: 25px
    font-weight: bold
    +mobile
      font-size: 2.4em
      margin-left: 0
      margin-top: 35px
      text-align: center

    .colored
      color: var(--color)

  .container
    display: flex
    height: calc(var(--color-diameter) + 10px)
    overflow: hidden
    margin-top: 5px

    .icon
      font-size: 3em
      margin: auto 15px
      color: #556
      cursor: pointer
      +mobile
        font-size: 2em

    .colors
      // width: 100%
      // display: flex
      // align-items: center
      // +shadow
      overflow: auto
      white-space: nowrap
      // height: calc(100% + 17px)
      +no-scrollbar(true)

      .color
        height: var(--color-diameter)
        width: var(--color-diameter)
        // flex-grow: 1
        +shadow
        border-radius: 100px
        display: inline-block
        cursor: pointer
        margin: 0 5px

  .shades
    position: absolute

    .shade
      height: 25px
      width: var(--color-diameter)
      border-radius: 100px
      +shadow
      margin-top: 5px
      cursor: pointer
      // z-index: 25

</style>

