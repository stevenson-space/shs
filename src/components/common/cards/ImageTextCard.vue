<template>
  <card class="card" ref="card">
    <custom-link :href="link" v-bind="linkProps">
      <img class="image" :src="image" @load="setHeight"/>
      <div class="text">{{ text }}</div>
    </custom-link>
  </card>
</template>

<script>
import Card from 'common/Card.vue';
import CustomLink from 'common/CustomLink.vue';

export default {
  props: {
    image: { type: String, required: true },
    text: { type: String, required: true },
    link: { type: [String, Object], required: true },
    linkProps: { type: Object, default: () => ({}) },
  },
  methods: {
    setHeight() {
      this.$refs.card.setHeight();
    }
  },
  components: { Card, CustomLink },
}
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'
// .container
//   display: flex
//   flex-direction: row
//   height: 75px
//   align-items: center

.card
  cursor: pointer
  background-color: black

  .image
    width: 100%
    display: block
    opacity: .5
    transition: opacity .2s

  .text
    // flex-grow: 1
    text-align: center
    font-size: 2em
    // margin: 5px auto
    font-weight: bold
    // color: #444
    // color: var(--color)
    color: white
    position: absolute
    // bottom: 65px
    height: 100%
    width: 95%
    left: 2.5%
    top: 0
    display: flex
    justify-content: center
    align-items: center
    // background-color: var(--color)
    // opacity: .5
  
  &:hover
    .image
      opacity: 1
    
    .text
      display: none

</style>
