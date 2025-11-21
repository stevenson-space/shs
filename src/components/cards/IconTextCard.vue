<template>
  <card class="card" :class="{ invert }" @click="handleClick">
    <custom-link v-if="link" :href="link" v-bind="linkProps">
      <div class="icon">
        <font-awesome-icon class="boxIcon" :icon="icon" size="5x" v-bind="iconProps" />
      </div>
      <div class="text">{{ text }}</div>
    </custom-link>
    <div v-else>
      <div class="icon">
        <font-awesome-icon class="boxIcon" :icon="icon" size="5x" v-bind="iconProps" />
      </div>
      <div class="text">{{ text }}</div>
    </div>
  </card>
</template>

<script>
import Card from '@/components/Card.vue';
import CustomLink from '@/components/CustomLink.vue';

export default {
  components: { Card, CustomLink },
  props: {
    icon: { type: Object, required: true },
    text: { type: String, required: true },
    link: { type: [String, Object], default: '' },
    linkProps: { type: Object, default: () => ({}) },
    invert: { type: Boolean, default: false },
    iconProps: { type: Object, default: () => {} },
  },
  emits: ['click'],
  methods: {
    handleClick() {
      if (!this.link) {
        this.$emit('click');
      }
    },
  },
};
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.card
  background: var(--accent) !important
  color: var(--iconCardsRegular)
  transition: transform .4s
  &.invert
    background-color: var(--secondaryBackground) !important
    color: var(--iconCardsInvert)
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
