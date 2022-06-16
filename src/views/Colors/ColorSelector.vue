<template>
  <div class="color-selector" tabindex="-1" @blur="hideShades">
    <div class="container" @click.self="hideShades">
      <font-awesome-icon class="icon" :icon="icons.faChevronLeft" @click="scroll('left')" />

      <div ref="colors" class="colors">
        <div
          v-for="(shades, i) in colors"
          :key="shades.join(',')"
          ref="color"
          class="color"
          :style="{ backgroundColor: shades[backgroundShade], transition: `box-shadow ${animationDuration / 1000}s` }"
          :class="{ selected: arrEquals(currentShades, shades) && isOpen}"
          @click="arrEquals(currentShades, shades) ? hideShades() : showShades(shades, $refs.color[i])"
        >
          <font-awesome-icon
            v-show="shades.indexOf(currentColor) > -1"
            class="checkmark center-align"
            :icon="icons.faCheck"
          />
        </div>
      </div>

      <font-awesome-icon class="icon" :icon="icons.faChevronRight" @click="scroll('right')" />
    </div>

    <div class="shades" :style="{ left: `${shadesLeft}px`, top: `${shadesTop}px` }">
      <stagger-animation
        ref="staggerAnimation"
        :duration="animationDuration"
        direction="down"
        align="left"
        :number-of-slots="currentShades.length"
        :isColorSelector="true"
      >
        <div
          v-for="(shade, i) in currentShades"
          :key="shade"
          :data-index="i"
          class="shade"
          :style="{ backgroundColor: shade }"
          @click="shadeClicked(shade)"
        >
          <font-awesome-icon
            v-show="shade === currentColor"
            class="checkmark"
            :icon="icons.faCheck"
          />
        </div>
      </stagger-animation>
    </div>
  </div>
</template>

<script lang="ts">
import { faChevronLeft, faChevronRight, faCheck } from '@fortawesome/free-solid-svg-icons';
import StaggerAnimation from '@/components/StaggerAnimation.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    StaggerAnimation,
  },
  props: {
    colors: { type: Array, required: true },
    currentColor: { type: String, default: '' },
    backgroundShade: { type: Number, default: 4 },
  },
  data() {
    return {
      icons: {
        faChevronLeft,
        faChevronRight,
        faCheck,
      },
      currentShades: [] as string[],
      shadesLeft: 0,
      shadesTop: 0,
      shadeHeight: 35,
      isOpen: false,
      animationDuration: 150,
    };
  },
  methods: {
    scroll(direction = 'right') {
      const $colors: any = this.$refs.colors;
      const multiplier = direction === 'right' ? 1 : -1;

      $colors.scrollBy({
        left: multiplier * $colors.offsetWidth * (3 / 4),
        behavior: 'smooth',
      });
    },
    showShades(shades: string[], $color: any) {
      const show = () => {
        // Get position to show at (under the color that was clicked)
        const $colors: any = this.$refs.colors;
        this.shadesLeft = $color.offsetLeft - $colors.scrollLeft;
        this.shadesTop = $color.offsetTop + $color.offsetHeight - this.shadeHeight + 30;
        this.currentShades = shades;

        // wait until StaggerAnimation renders the shades before opening them
        this.$nextTick(() => {
          this.isOpen = true;
        });
      };

      if (this.isOpen) {
        this.currentShades = []; // hides instantly (without animation)
        // wait until StaggerAnimation actually removes the shades before showing them again
        this.$nextTick(show);
      } else {
        show();
      }
    },
    hideShades() {
      this.isOpen = false;

      setTimeout(() => {
        this.currentShades = [];
      }, this.animationDuration);
    },
    shadeClicked(shade: string) {
      this.$emit('color-selected', shade);
      this.hideShades();
    },
    arrEquals(arr1: string[], arr2: string[]) {
      if (!arr1 || !arr2 || arr1.length === 0 || arr2.length === 0) return false;
      for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
          return false;
        }
      }
      return true;
    },
  },
});
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.center-align
  position: absolute
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)

.color-selector
  --color-diameter: 70px
  outline: none
  position: relative
  justify-content: center
  display: flex
  z-index: 1
  margin: 0 25px
  +tablet-small
    --color-diameter: 70px
  +mobile-small
    --color-diameter: 55px
    margin: 0

  .container
    display: flex
    height: calc(var(--color-diameter) + 10px)
    overflow: hidden

    .icon
      font-size: 3em
      margin: auto 15px
      color: #556
      cursor: pointer
      +mobile
        font-size: 2em

    .colors
      overflow-x: scroll
      -webkit-overflow-scrolling: touch
      white-space: nowrap
      +no-scrollbar(true)

      .color
        width: var(--color-diameter)
        height: var(--color-diameter)
        border-radius: 100px
        display: inline-block
        cursor: pointer
        margin: 0 4px
        z-index: 25
        position: relative
        &.selected
          +shadow

        .checkmark
          color: var(--background)
          font-size: 2.5em
          +mobile
            font-size: 2em

  .shades
    position: absolute
    .shade
      height: 30px
      width: var(--color-diameter)
      border-radius: 100px
      +shadow
      margin-top: 5px
      cursor: pointer

      .checkmark
        color: var(--background)
        padding-left: 29px
        padding-top: 7px
        +mobile
          padding-left: 20px
</style>
