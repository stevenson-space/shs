<template>
  <div class="scroll-selector" :style="{ height: `${optionHeight * (2 * numOptionsAbove + 1)}px`, fontSize }">
    <!-- eslint-disable-next-line vue/require-v-for-key vue/no-unused-vars-->
    <div v-for="_ in Array(numOptionsAbove)" :style="{ height: `${optionHeight}px`}" />

    <div
      v-for="option in options"
      ref="option"
      :key="option"
      class="option"
      :class="{ selected: option === value }"
      @click="$emit('input', option)"
    >
      {{ option }}
    </div>

    <!-- eslint-disable-next-line vue/require-v-for-key vue/no-unused-vars-->
    <div v-for="_ in Array(numOptionsAbove)" :style="{ height: `${optionHeight}px`}" />
  </div>
</template>

<script>
export default {
  props: {
    options: { type: Array, required: true },
    value: { type: String, required: true },
    numOptionsAbove: { type: Number, default: 1 }, // the number of options to be displayed above the selected option to indicate scrollability
    fontSize: { type: String, default: '1em' }, // this property must be used to set font-size because optionHeight depends upon it
  },
  data() {
    return {
      optionHeight: 0,
    };
  },
  watch: {
    value() {
      this.scrollToSelected();
    },
    fontSize() {
      this.$nextTick(this.setOptionHeight);
    },
  },
  mounted() {
    this.setOptionHeight();
    setTimeout(this.setOptionHeight, 100); // just in case

    this.$nextTick(this.scrollToSelected);

    let scrollTimeout = null;
    this.$el.addEventListener('scroll', () => {
      // wait until user is finished scrolling before selecting a choice (debounce)
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const selectedIndex = Math.round(this.$el.scrollTop / this.optionHeight);
        this.$emit('input', this.options[selectedIndex]);
        this.scrollToSelected();
      }, 100);
    });
  },
  methods: {
    scrollToSelected() {
      this.$nextTick(() => { // wait until this.value is updated if necessary
        const index = this.options.indexOf(this.value);
        if (index > -1) {
          this.$el.scroll({
            top: this.$refs.option[index].offsetTop - (this.optionHeight * this.numOptionsAbove),
            behavior: 'smooth',
          });
        }
      });
    },
    setOptionHeight() {
      this.optionHeight = this.$refs.option[0].getBoundingClientRect().height;
    },
  },
};
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.scroll-selector
  height: 90px
  overflow: auto
  text-align: center
  position: relative
  +no-scrollbar
  -webkit-overflow-scrolling: touch

  .option
    color: #bbb
    cursor: pointer
    padding: 0 5px

    &.selected
      color: var(--primary)
      // font-weight: bold

</style>
