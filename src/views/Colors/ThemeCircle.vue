<template>
  <div class="theme-card">
    <div class="circle-border" :class="{ 'no-border': !isCurrentTheme }">
      <div class="circle" :style="{ background: gradientString }"></div>
    </div>
    <div class="name">
      {{ theme.name.toUpperCase().substring(0, 1) + theme.name.substring(1) }}
    </div>
  </div>
</template>
<script>
export default {
  props: {
    theme: { type: Object, required: true },
    isCurrentTheme: { type: Boolean, required: true },
  },
  data() {
    return {
      colors: [],
    };
  },
  computed: {
    gradientString() {
      const { suggestedColor, background } = this.theme;
      return `linear-gradient( -45deg, ${suggestedColor}, ${suggestedColor} 50%, ${background} 50% )`;
    },
  },
  mounted() {
    for (const x of ['suggestedColor', 'background']) {
      this.$set(this.colors, this.colors.length, this.theme[x]);
    }
  },
};
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'
.theme-card
  text-align: center
  .circle
    width: 68px
    height: 68px
    border-radius: 68px
    margin: 4px
  .circle-border
    border: 2px solid grey
    border-radius: 80px
    margin: 0px 5px
  .no-border
    border-color: transparent !important
  .name
    margin-top: 10px
</style>
