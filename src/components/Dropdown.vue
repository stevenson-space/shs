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
        :direction="direction"
        :number-of-slots="formattedOptions.length"
        :align="align"
      >
      <template v-if="open">
          <div
            v-for="(option, index) in formattedOptions"
            :key="option"
            ref="option"
            class="option"
            :style="option.style"
            :data-index="index"
            @click="selectOption(option.index)"
          >
            {{ option.name }}
        </div>
        </template>
      </stagger-animation>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import StaggerAnimation from './StaggerAnimation.vue';

export default defineComponent({
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
      arrowRotateAmount: 0,
    };
  },
  computed: {
    remainingOptions(): string[] {
      const remainingOptions = this.options.slice(0);
      remainingOptions.splice(this.modelValue, 1);
      return remainingOptions;
    },
    formattedOptions(): { name: string, style: any, index: number}[] {
      const options = (this.showSelectedAsOption ? this.options : this.remainingOptions) as string[];
      return options.map((option) => {
        const style = {} as any;
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
    dropdownStyle(): { transition: string, zIndex: number} {
      return {
        transition: 'box-shadow .2s, border-color .2s',
        zIndex: this.options.length + 5,
      };
    },
    iconStyle(): { transition: string, transform: string} {
      return {
        transition: 'transform .2s',
        transform: `rotate(${this.arrowRotateAmount}deg)`,
      };
    },
  },
  watch: {
    options(): void {
      this.optionShifts = Array(this.options.length).fill(0);
    },
    direction(): void {
      this.closeDropdown();
      this.arrowRotateAmount = this.direction === 'down' ? 0 : 180;
    },
  },
  created(): void {
    // if the initial index is out of bounds, choose the first index by default
    if (this.modelValue < 0 || this.modelValue >= this.options.length) {
      this.$emit('update:modelValue', 0);
    }
  },
  methods: {
    toggleDropdown(): void {
      this.arrowRotateAmount += (this.arrowRotateAmount >= 180) ? -180 : 180;
      this.open = !this.open;
    },
    openDropdown(): void {
      if (!this.open) {
        this.toggleDropdown();
      }
    },
    closeDropdown(): void {
      if (this.open) {
        this.toggleDropdown();
      }
    },
    selectOption(optionIndex: number): void {
      if (this.open) {
        this.closeDropdown();
        // allow animation to start before emitting event (event may cause blocking calculations that slow down animation)
        setTimeout(() => {
          this.$emit('update:modelValue', optionIndex);
        }, 100);
      }
    },
  },
});
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

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
    background-color: var(--background)
    border-radius: 100px
    +shadow
    padding: 5px 12px
    margin-left: 8px
    white-space: nowrap
    cursor: pointer
    user-select: none
    width: auto
    &:hover
      background-color: var(--secondaryBackground)
</style>
