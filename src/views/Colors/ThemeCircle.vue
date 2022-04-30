<template>
  <div class="theme-card">
    <div class="circle-border" :class="{ 'no-border': !isCurrentTheme }">
      <div class="circle" :style="{ background: gradientString }"></div>
      <div v-if="theme.type === 'gradient'" class="theme-inlay" :style="{ background: theme.background }"></div>
    </div>
    <div class="name" v-show="!(theme.type === 'gradient' & theme.hideName)">
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
  computed: {
    gradientString() {
      const { suggestedColor, background, headerBackgroundColor, type } = this.theme;
      return type === 'gradient' ? headerBackgroundColor : `linear-gradient( -45deg, ${suggestedColor}, ${suggestedColor} 50%, ${background} 50% )`;
    },
  },
};
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'
.theme-inlay
  height: 20px
  width: 20px
  position: absolute
  transform: translate(24px, -44px)
  border-radius: 20px
.theme-card
  text-align: center
  .circle
    width: 65px
    height: 65px
    border-radius: 68px
    margin: 2px
    +shadow-light
  .circle-border
    display: inline-block
    border: 2px solid grey
    border-radius: 80px
    margin: 0px 5px
  .no-border
    border-color: transparent !important
  .name
    margin-top: 10px
</style>
