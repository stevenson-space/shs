<template>
  <card class="card" :class="{ invert }">
    <custom-link :href="link">
      <div class="icon">
        <font-awesome-icon :icon="icon" size="5x"/>
      </div>
      <div class="text">{{ text }}</div>
    </custom-link>
  </card>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import Card from './Card.vue';
import CustomLink from './CustomLink.vue'

export default {
  props: {
    icon: { type: Object, required: true },
    text: { type: String, required: true },
    link: { type: [String, Object], default: ''},
    invert: { type: Boolean, default: false },
  },
  components: { Card, FontAwesomeIcon, CustomLink },
}
</script>

<style lang="sass" scoped>
@import '../styles/style.sass'

.card
  background-color: $color
  color: white
  &.invert
    background-color: white
    color: $color

  .icon
    display: flex
    justify-content: center
    align-items: center
    margin-top: 45px
    margin-bottom: 15px

  .text
    font-weight: bold
    letter-spacing: 1.5px
    text-align: center
    font-size: 1.5em
    margin-bottom: 50px

</style>
