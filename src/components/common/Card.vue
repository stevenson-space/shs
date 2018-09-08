<template>
  <div class="card" ref="card" :style="style">
    <div class="wrapper" ref="wrapper">
      <slot/>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      height: 0,
      margin: 15,
      spanValue: 0,
      mutationObserver: null,
      debounceTimeout: null,
    };
  },
  computed: {
    style() {
      const { height, margin, spanValue } = this;
      return {
        height: `${height}px`,
        margin: `${margin}px`,
        gridRow: `span ${spanValue}`,
      }
    }
  },
  mounted() {
    this.setHeight();

    // for some reason, card doesn't open to full height on first load
    setTimeout(this.setHeight, 100);

    window.addEventListener('resize', this.debounceSetHeight);

    // The MutationObserver will detect when any children or descendants are added
    // and when any CSS is changed
    this.mutationObserver = new MutationObserver(this.setHeight);
    this.mutationObserver.observe(this.$refs.wrapper, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['style'],
    });
  },
  methods: {
    // call setHeight() manually from parent component whenever the content (slot) height changes
    // and the change is undetectable by MutationObserver
    setHeight() {
      const { margin, $refs } = this;
      this.height = $refs.wrapper.offsetHeight;

      // Adjust the number of rows the card spans (necessary for the masonry layout to work)
      this.spanValue = Math.ceil((this.height + margin * 2) / 5); // 5 is row height

      this.$emit('height-change');
    },
    debounceSetHeight() {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => this.setHeight(), 250);
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.debounceSetHeight);
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }
}
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.card
  background-color: white
  border-radius: 15px
  +shadow
  position: relative
  transition: height .3s
  overflow: hidden

  .wrapper
    overflow: hidden

</style>
