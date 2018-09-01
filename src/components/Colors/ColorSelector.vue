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

    <div class="shades" :style="{ left: `${shadesLeft}px`, top: `${shadesTop}px` }" >
      <stagger-animation
        :duration="animationDuration"
        direction="down"
        :shiftAmount="shadeHeight + 5"
        :number-of-slots="currentShades.length"
        ref="staggerAnimation">
        <div
          class="shade"
          v-for="(shade, i) in currentShades"
          :style="{ backgroundColor: shade, height: `${shadeHeight}px` }"
          @click="shadeClicked(shade)"
          :key="shade"
          ref="shades"/>
      </stagger-animation>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import StaggerAnimation from 'src/components/common/StaggerAnimation.vue';

export default {
  props: {
    colors: { type: Array, required: true },
  },
  data() {
    return {
      icons: {
        faChevronLeft,
        faChevronRight,
      },
      currentShades: [],
      shadesLeft: 0,
      shadesTop: 0,
      shadeHeight: 25,
      isOpen: false,
      animationDuration: 200
    }
  },
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
      const show = () => {
        // Get position to show at (under the color that was clicked)
        const $colors = this.$refs.colors;
        this.shadesLeft = $color.offsetLeft - $colors.scrollLeft;
        this.shadesTop = $color.offsetTop + $color.offsetHeight - this.shadeHeight;
        
        this.currentShades = shades;

        // wait until StaggerAnimation renders the shades before opening them
        this.$nextTick(() => {
          this.isOpen = true;
          this.$refs.staggerAnimation.open();
        });
      }
        
      if (this.isOpen) {
        this.currentShades = []; // hides instantly (without animation)

        // wait until StaggerAnimation actually removes the shades before showing them again
        this.$nextTick(show);
      } else {
        show();
      }
    },
    hideShades() {
      this.$refs.staggerAnimation.close();

      setTimeout(() => {
        this.currentShades = [];
        this.isOpen = false;
      }, this.animationDuration);
    },
    shadeClicked(shade) {
      this.$emit('color-selected', shade);
      this.hideShades();
    },
    arrEquals(arr1, arr2) {
      if (!arr1 || !arr2 || arr1.length === 0 || arr2.length === 0) return false;
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
    StaggerAnimation,
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
        z-index: 25
        position: relative

  .shades
    position: absolute

    .shade
      width: var(--color-diameter)
      border-radius: 100px
      +shadow
      margin-top: 5px
      cursor: pointer
      // z-index: 25

</style>

