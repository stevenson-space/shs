<template>
  <div class="dropdown" tabindex="-1" :class="{ selected: open }" @blur="closeDropdown">
    <div class="select-option" :style="dropdownStyle" @click="toggleDropdown">
      <span>{{ options[modelValue] }}</span>
      <font-awesome-icon
        class="down-icon"
        :icon="faCaretDown"
        :style="iconStyle"
      />
    </div>
      <stagger-animation
        ref="staggerAnimation"
        :duration="animationDuration"
        :direction="direction"
        :shift-amount="optionHeight + 10"
        :number-of-slots="formattedOptions.length"
      >
      <template v-if="open">
          <div
            v-for="option in formattedOptions"
            :key="option"
            ref="option"
            class="option"
            :style="option.style"
            @click="selectOption(option.index)"
          >
            {{ option.name }}
        </div>
        </template>
      </stagger-animation>
    </div>
</template>

<script>
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import StaggerAnimation from './StaggerAnimation.vue';

export default {
  components: { StaggerAnimation },
  props: {
    options: { type: Array, required: true },
    modelValue: { type: Number, required: true },
    showSelectedAsOption: { type: Boolean, default: true },
    align: {
      validator: (str) => str === 'left' || str === 'right' || str === 'center',
      default: 'right',
    },
    direction: {
      validator: (str) => str === 'up' || str === 'down',
      default: 'down',
    },
  },
  data() {
    return {
      faCaretDown,
      open: false, // open is true even when dropdown is partially open, false only when dropdown is completely closed
      arrowRotateAmmount: this.direction === 'down' ? 0 : 180,
      optionHeight: 30,
      animationDuration: 50,
    };
  },
  computed: {
    remainingOptions() {
      const remainingOptions = this.options.slice(0);
      remainingOptions.splice(this.modelValue, 1);
      return remainingOptions;
    },
    formattedOptions() {
      const options = this.showSelectedAsOption ? this.options : this.remainingOptions;
      return options.map((option) => {
        const style = {};
        if (this.align === 'center') {
          style.left = '50%';
          style.transform = 'translateX(-50%)';
        } else {
          style[this.align] = 0;
        }

        return {
          name: option,
          style,
          index: this.options.indexOf(option), // if we're using this.remainingOptions, the original indexes are lost
        };
      });
    },
    dropdownStyle() {
      const duration = this.animationDuration / 1000;
      return {
        transition: `box-shadow ${duration}s, border-color ${duration}s`,
        zIndex: this.options.length + 5,
      };
    },
    iconStyle() {
      const duration = this.animationDuration / 1000;
      return {
        transition: `transform ${duration}s`,
        transform: `rotate(${this.arrowRotateAmmount}deg)`,
      };
    },
  },
  watch: {
    options() {
      this.optionShifts = Array(this.options.length).fill(0);
    },
    direction() {
      this.closeDropdown();
      this.arrowRotateAmmount = this.direction === 'down' ? 0 : 180;
    },
  },
  created() {
    // if the initial index is out of bounds, choose the first index by default
    if (this.modelValue < 0 || this.modelValue >= this.options.length) {
      this.$emit('update:modelValue', 0);
    }
  },
  methods: {
    setOptionShifts(value, start = 0, end = this.optionShifts.length) {
      this.optionShifts = this.optionShifts.map((n, i) => ((i >= start && i < end) ? value : n));
    },
    toggleDropdown() {
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
          this.$emit('update:modelValue', optionIndex);
        }, 100);
      }
    },
  },
};
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.dropdown
  position: relative
  outline: none
  white-space: nowrap // need everything to be on one line for proper animation
  font-weight: bold
  color: var(--tertiary)
  z-index: 1
  &.selected
    z-index: 60 // when this dropdown is selected, it should be placed above everything else (except Popup)
    .select-option
      +shadow
      border-color: var(--background)
  .select-option
    background-color: var(--background)
    position: relative
    border: var(--color) 1px solid
    display: flex
    margin-left: 7px
    justify-content: center
    align-items: center
    border-radius: 100px
    padding: 5px 12px
    cursor: pointer
    user-select: none
    -webkit-tap-highlight-color: transparent
    .down-icon
      margin-left: 7px

  .option
    background-color: white
    background-color: var(--background)
    border-radius: 100px
    +shadow
    padding: 5px 12px
    margin-left: -30px
    white-space: nowrap
    cursor: pointer
    user-select: none
    &:hover
      background-color: #eee
      background-color: var(--secondaryBackground)
</style>
