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
    };
  },
  computed: {
    style() {
      const { height, margin, spanValue } = this;
      return {
        height: `${height}px`,
        margin: `${margin}px`,
        gridRow: `span ${spanValue}`,
        mutationObserver: null,
      }
    }
  },
  mounted() {
    this.setHeight();

    // The MutationObserver will detect when any children or descendants are added
    // and when any CSS is changed
    this.mutationObserver = new MutationObserver(() => {
      this.setHeight();
    });
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
      this.spanValue = Math.ceil((this.height + margin * 2) / 5);
    }
  },
  destroyed() {
    this.mutationObserver.disconnect();
  }
}
</script>

<style lang="sass" scoped>
@import '../styles/style.sass'

.card
  background-color: white
  border-radius: 15px
  +shadow
  position: relative
  transition: height .3s
  overflow: hidden

  .wrapper
    overflow: auto

</style>
