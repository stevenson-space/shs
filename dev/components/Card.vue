<template>
  <div class="card" ref="card" :style="style">
    <div class="wrapper" ref="wrapper">
      <slot/>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    color: { type: String, defualt: 'white' },
  },
  data() {
    return {
      height: 0,
      margin: 15,
      spanValue: 0,
    };
  },
  computed: {
    style() {
      const { height, margin, spanValue, color } = this;
      return {
        height: `${height}px`,
        margin: `${margin}px`,
        gridRow: `span ${spanValue}`,
        backgroundColor: color,
        mutationObserver: null,
      }
    }
  },
  mounted() {
    this.setHeight();

    // The MutationObserver will detect when any children or descendants are added
    // and when any CSS is changed
    this.mutationObserver = new MutationObserver(() => {
      console.log('hi');
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
  transition: height .2s
  overflow: hidden

  .wrapper
    overflow: auto

</style>
