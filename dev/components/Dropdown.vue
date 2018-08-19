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
      @click="selectOption(i)">
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
    direction: {
      validator: str => str === 'left' || str === 'right',
      default: 'right',
    },
  },
  data() {
    return {
      faCaretDown,
      optionShifts: Array(this.options.length).fill(0),
      open: false,
      arrowRotateAmmount: 0,
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
          [this.direction]: 0,
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

      const staggerDuration = animationDuration / 4; // staggering animation for nicer effect
      this.options.forEach((_, i) => {
        setTimeout(() => {
          if (isOpen) {
            const j = this.options.length - i - 1; // iterating backwards;
            this.setOptionShifts(0 + j * 40, j);
          } else {
            this.setOptionShifts(40 + i * 40, i);
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
    }
  },
  watch: {
    options() {
      this.optionShifts = Array(this.options.length).fill(0);
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
  // background-color: $color
  border: $color 1px solid
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
  // border: $color 1px solid
  // background-color: $color
  // color: white
  &:hover
    background-color: #eee

</style>
