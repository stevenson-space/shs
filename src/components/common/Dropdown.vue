<template>
  <div class="container" @blur="closeDropdown" tabindex="-1">
    <div class="dropdown" :class="{ selected: open }" @click="toggleDropdown" :style="dropdownStyle">
      <span>{{ options[value] }}</span>
      <font-awesome-icon
        class="down-icon"
        :icon="faCaretDown"
        :style="iconStyle"/>
    </div>

    <stagger-animation
      :duration="animationDuration"
      :direction="direction"
      :shift-amount="optionHeight + 10"
      :number-of-slots="formattedOptions.length"
      ref="staggerAnimation">
      <div
        class="option"
        v-for="(option, i) in formattedOptions"
        :style="option.style"
        @click="selectOption(i)"
        ref="option">
        {{ option.name }}
      </div>
    </stagger-animation>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import StaggerAnimation from './StaggerAnimation.vue';

export default {
  props: {
    options: { type: Array, required: true },
    value: { type: Number, required: true },
    showSelectedAsOption: { type: Boolean, default: true },
    align: {
      validator: str => str === 'left' || str === 'right' || str === 'center',
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
      open: false,
      arrowRotateAmmount: this.direction === 'down' ? 0 : 180,
      optionHeight: 30,
      resizeListener: null,
      resizeDebounceTimeout: null,
      animationDuration: 200,
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
      return this.options.map((option, i) => {
        const style = {};
        if (this.align === 'center') {
          style.left = '50%';
          style.transform = "translateX(-50%)";
        } else {
          style[this.align] = 0;
        }

        return {
          name: option,
          style
        };
      });
    },
    dropdownStyle() {
      const duration = this.animationDuration / 1000;
      return {
        transition: `box-shadow ${duration}s, border-color ${duration}s`,
        zIndex: this.options.length + 5,
      }
    },
    iconStyle() {
      const duration = this.animationDuration / 1000;
      return {
        transition: `transform ${duration}s`,
        transform: `rotate(${this.arrowRotateAmmount}deg)`,
      }
    }
  },
  methods: {
    setOptionShifts(value, start = 0, end = this.optionShifts.length) {
      this.optionShifts =  this.optionShifts.map((n, i) => (i >= start && i < end) ? value : n );
    },
    toggleDropdown() {
      this.arrowRotateAmmount += 180;

      if (this.open) {
        this.$refs.staggerAnimation.close();
      } else {
        this.$refs.staggerAnimation.open();
      }
  
      this.open = !this.open;
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
  components: { FontAwesomeIcon, StaggerAnimation },
}
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass';

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
  &.selected
    +shadow
    border-color: white
    // margin-right: 1px

  .down-icon
    margin-left: 7px

.option
  // position: absolute
  // top: 0
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
