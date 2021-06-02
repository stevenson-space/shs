<template>
  <div class="form-element" @click="clicked">
    <slot />
    <!-- hidden button that simulates submission if the submit prop is true -->
    <input v-if="submit" type="submit" ref="submitButton" hidden />
  </div>
</template>

<script>
export default {
  props: {
    submit: { type: Boolean, default: false }
  },
  methods: {
    clicked(event) {
      // if this is the submit component, then click our simulated submit button
      if (this.submit) this.$refs.submitButton.click();
    }
  }
};
</script>

<style lang="sass" scoped>
.form-element
  display: flex
  flex-flow: column nowrap
  justify-content: center
  align-items: center

  margin-top: 10px
  margin-bottom: 10px
  width: 100%

  label
    margin-left: -10px
    padding-bottom: 5px
    width: 80%
    text-align: left

  p, span
    width: 80%
    font-size: 0.75em
    text-align: left
    margin: 5px
    
  input
    &:focus
      outline: none
    background: var(--background)
    color: var(--primary)
    padding: 0px 5px
    border-radius: 30px
    width: 80%
    border: 1px solid var(--color)
    height: 30px
    font-size: 1em
    text-indent: 0.3em
</style>