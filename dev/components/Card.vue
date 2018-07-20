<template>
  <div class="card" ref="card" :style="style">
    <slot/>
  </div>
</template>

<script>
export default {
  props: {
    height: { type: Number, default: null },
  },
  data() {
    return {
      margin: 15,
      spanValue: 0,
    };
  },
  computed: {
    style() {
      const { height, margin, spanValue } = this;
      return {
        height: `${height}px` || 'auto',
        margin: `${margin}px`,
        gridRow: `span ${spanValue}`,
      }
    }
  },
  mounted() {
    this.setGridSpan();
  },
  methods: {
    setGridSpan() {
      const { height, margin, $refs } = this;
      const cardHeight = height || $refs.card.offsetHeight;
      this.spanValue = Math.ceil((cardHeight + margin * 2) / 5);
    }
  },
  watch: {
    height() {
      this.setGridSpan();
    }
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

</style>
