<template>
  <div class="slider-input-container">
    <div class="slider-row">
      <label v-if="label" class="slider-label" :id="`${$.uid}-label`">{{ label }}</label>
      <div class="slider-controls">
        <input
          :value="modelValue"
          @input="handleSliderInput"
          type="range"
          :min="min"
          :max="max"
          :step="step"
          class="slider"
          :aria-labelledby="label ? `${$.uid}-label` : undefined"
        />
        <input
          :value="modelValue"
          @input="handleNumberInput"
          @blur="$emit('blur')"
          type="number"
          :min="min"
          :max="max"
          :step="step"
          class="number-input"
          :aria-labelledby="label ? `${$.uid}-label` : undefined"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
      default: '',
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    step: {
      type: Number,
      default: 1,
    },
  },
  methods: {
    clampValue(val) {
      const num = Number(val);
      if (Number.isNaN(num)) return this.min;
      return Math.min(this.max, Math.max(this.min, num));
    },
    handleSliderInput(event) {
      this.$emit('update:modelValue', this.clampValue(event.target.value));
    },
    handleNumberInput(event) {
      this.$emit('update:modelValue', this.clampValue(event.target.value));
    },
  },
};
</script>

<style lang="sass" scoped>
.slider-input-container
  margin-bottom: 12px

  &:last-child
    margin-bottom: 0

.slider-row
  display: flex
  align-items: center
  gap: 16px

.slider-label
  min-width: 60px
  color: var(--secondary)
  font-weight: 500
  font-size: 11px
  text-transform: uppercase
  letter-spacing: 0.5px
  flex-shrink: 0

.slider-controls
  flex: 1
  display: flex
  align-items: center
  gap: 10px

.slider
  flex: 1
  height: 4px
  border-radius: 2px
  background: rgba(128, 128, 128, 0.15)
  outline: none
  -webkit-appearance: none
  appearance: none
  cursor: pointer

  &::-webkit-slider-thumb
    -webkit-appearance: none
    appearance: none
    width: 14px
    height: 14px
    border-radius: 50%
    background: var(--accent)
    cursor: pointer
    transition: transform 0.15s ease
    margin-top: -5px

    &:hover
      transform: scale(1.15)

  &::-moz-range-thumb
    width: 14px
    height: 14px
    border-radius: 50%
    background: var(--accent)
    cursor: pointer
    border: none
    transition: transform 0.15s ease

    &:hover
      transform: scale(1.15)

  &::-webkit-slider-runnable-track
    width: 100%
    height: 4px
    border-radius: 2px
    background: rgba(128, 128, 128, 0.15)

  &::-moz-range-track
    width: 100%
    height: 4px
    border-radius: 2px
    background: rgba(128, 128, 128, 0.15)

.number-input
  width: 50px
  padding: 4px 6px
  text-align: center
  font-size: 11px
  border: 1px solid rgba(128, 128, 128, 0.2)
  border-radius: 4px
  background: var(--background)
  color: var(--primary)
  box-sizing: border-box
  transition: border-color 0.2s ease

  &:focus
    outline: none
    border-color: var(--accent)

  // Hide spinner arrows
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button
    -webkit-appearance: none
    margin: 0

  -moz-appearance: textfield
</style>
