<template>
  <div class="theme-card">
    <div class='circle-border' :class="{'no-border': !isCurrentTheme}">
      <div class="circle" :style="{ background: gradientString,  }"></div>
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
      return `linear-gradient( -45deg, ${this.colors[0]}, ${this.colors[0]} 50%, ${this.colors[1]} 50% )`;
    },
  },
  mounted() {
    for (var x of ["suggestedColor", "background"]) {
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