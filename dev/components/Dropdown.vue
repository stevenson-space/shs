<template>
  <div class="container" @blur="closeDropdown" tabindex="-1">
    <div class="dropdown" :class="{ selected: open }" @click="toggleDropdown">
      <span>{{ options[value] }}</span>
      <font-awesome-icon
        class="down-icon"
        :icon="faCaretDown"
        :style="{ transform: `rotate(${arrowRotateAmmount}deg)`}"/>
    </div>

    <div
      class="option"
      v-for="(option, i) in formattedOptions"
      :style="option.style"
      @click="selectOption(i)"
      ref="option">
      {{ option.name }}
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

const animationDuration = 200; // When modifying this, also modify .option transition duration in CSS

export default {
  props: {
    options: { type: Array, required: true },
    value: { type: Number, required: true },
    showSelectedAsOption: { type: Boolean, default: true },
    align: {
      validator: str => str === 'left' || str === 'right',
      default: 'right',
    },
    direction: {
      validator: str => str === 'up' || str === 'down',
      default: 'down',
    },
  },
  data() {
    return {
      faCaretDown,
      optionShifts: Array(this.options.length).fill(0),
      open: false,
      arrowRotateAmmount: this.direction === 'down' ? 0 : 180,
      optionHeight: 30,
      resizeListener: null,
      resizeDebounceTimeout: null,
    }
  },
  computed: {
    remainingOptions() {
      const remainingOptions = this.options.slice(0);
      remainingOptions.splice(this.value, 1);
      return remainingOptions;
    },
    formattedOptions() {
      const options = this.showSelectedAsOption ? this.options : this.remainingOptions;
      return this.options.map((option, i) => ({
        name: option,
        style: {
          transform: `translateY(${this.optionShifts[i]}px)`,
          zIndex: options.length - i, // later options should stack underneath prior ones
          opacity: Number(this.open),
          [this.align]: 0,
        }
      }));
    }
  },
  methods: {
    setOptionShifts(value, start = 0, end = this.optionShifts.length) {
      this.optionShifts =  this.optionShifts.map((n, i) => (i >= start && i < end) ? value : n );
    },
    toggleDropdown() {
      const isOpen = this.open;
      this.arrowRotateAmmount += 180;

      const shiftAmount = (this.direction === 'down' ? 1 : -1) * (this.optionHeight + 10);
      const staggerDuration = animationDuration / 4; // staggering animation for nicer effect
      this.options.forEach((_, i) => {
        setTimeout(() => {
          if (isOpen) {
            const j = this.options.length - i - 1; // iterating backwards;
            this.setOptionShifts(0 + j * shiftAmount, j);
          } else {
            this.setOptionShifts(shiftAmount + i * shiftAmount, i);
          }
        }, staggerDuration * i);
      });

      this.open = !isOpen;
    },
    openDropdown() {
      if (!this.open) {
        this.toggleDropdown();
      }
    },
    closeDropdown() {
      if (this.open) {
        this.toggleDropdown();
      }
    },
    selectOption(optionIndex) {
      if (this.open) {
        this.closeDropdown();

        // allow animation to start before emitting event (event may cause blocking calculations that slow down animation) 
        setTimeout(() => {
          this.$emit('input', optionIndex);
        }, 100);
      }
    },
    resetOptionHeight() {
      if (this.formattedOptions.length >= 1) {
        this.optionHeight = this.$refs.option[0].offsetHeight || 30;
      }
    }
  },
  mounted() {
    this.resetOptionHeight();

    this.resizeListener = () => {
      clearTimeout(this.resizeDebounceTimeout);
      this.resizeDebounceTimeout = setTimeout(this.resetOptionHeight, 250);
    }
    window.addEventListener('resize', this.resizeListener);
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeListener);
  },
  watch: {
    options() {
      this.optionShifts = Array(this.options.length).fill(0);
    },
    direction() {
      this.closeDropdown();
      this.arrowRotateAmmount = this.direction === 'down' ? 0 : 180;
      this.resetOptionHeight();
    }
  },
  components: { FontAwesomeIcon },
}
</script>

<style lang="sass" scoped>
@import '../styles/style.sass';

.container
  position: relative
  outline: none

.dropdown
  background-color: white
  position: relative
  // color: white
  // background-color: var(--color)
  border: var(--color) 1px solid
  display: flex
  justify-content: center
  align-items: center
  border-radius: 100px
  padding: 5px 12px
  cursor: pointer
  user-select: none
  transition: box-shadow .2s, border-color .2s // keep in sync with other durations in CSS and JS
  z-index: 25
  user-select: none
  &.selected
    +shadow
    border-color: white
    // margin-right: 1px

  .down-icon
    margin-left: 7px
    transition: transform .2s // keep in sync with other durations

.option
  position: absolute
  top: 0
  transition: transform .2s, opacity .2s linear // when modifying duration, also modify in JS above
  background-color: white
  border-radius: 100px
  +shadow
  padding: 5px 12px
  white-space: nowrap
  cursor: pointer
  user-select: none
  // border: var(--color) 1px solid
  // background-color: var(--color)
  // color: white
  &:hover
    background-color: #eee

</style>
