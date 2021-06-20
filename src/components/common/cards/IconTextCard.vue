<template>
  <card class="card" :class="{ invert }">
    <custom-link :href="link" v-bind="linkProps">
      <div class="icon"> 
        <font-awesome-icon class="boxIcon" :icon="icon" size="5x" v-bind="iconProps" />
      </div>
      <div class="text">{{ text }}</div>
    </custom-link>
  </card>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import Card from 'common/Card.vue';
import CustomLink from 'common/CustomLink.vue';

export default {
  components: { Card, FontAwesomeIcon, CustomLink },
  props: {
    icon: { type: Object, required: true },
    text: { type: String, required: true },
    link: { type: [String, Object], default: '' },
    linkProps: { type: Object, default: () => ({}) },
    invert: { type: Boolean, default: false },
    iconProps: { type: Object, default: () => {} },
  }
  
};
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'


.card
  background: var(--color) !important
  color: var(--iconTextCardColor)
  transition: transform .4s
  &.invert
    background-color: var(--secondaryBackground) !important
    color: var(--iconTextCardInvertColor)
  &:hover
    transform: scale(1.03)

  .icon
    display: flex
    justify-content: center
    align-items: center
    margin-top: 40px
    margin-bottom: 15px

  .text
    font-weight: bold
    letter-spacing: 1.5px
    text-align: center
    font-size: 1.5em
    margin-bottom: 45px


  .boxIcon
    height: 65px
    +desktop
      height: 75px
</style>
