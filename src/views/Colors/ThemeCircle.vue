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
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Theme } from '@/utils/types';

export default defineComponent({
  props: {
    theme: {
      type: Object as PropType<Theme>,
      required: true,
    },
    isCurrentTheme: { type: Boolean, required: true },
  },
  computed: {
    gradientString(): string {
      const { suggestedColor, background } = this.theme;
      return `linear-gradient( -45deg, ${suggestedColor}, ${suggestedColor} 50%, ${background} 50% )`;
    },
  },
});
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'
.theme-card
  text-align: center
  .circle
    width: 65px
    height: 65px
    border-radius: 68px
    margin: 2px
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
