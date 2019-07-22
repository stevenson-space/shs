<template>
  <div class="plain-header">
    <home-link class="home-link"/>
    <span class="title">{{ title }}</span>
  </div>
</template>

<script>
import HomeLink from './HomeLink.vue';

export default {
  props: {
    title: { type: String, required: true },
  },
  components: { HomeLink },
}
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.plain-header
  max-width: $content-width
  margin: auto
  position: relative
  margin-top: 10px
  color: var(--color)
  +mobile
    text-align: center

  .title
    line-height: 125px
    font-size: 4em  
    font-weight: bold
    margin-left: 50px
    +mobile
      margin-left: 0
  
  .home-link
    position: absolute
    top: 10px
    right: 10px
    +mobile-small
      top: 0
      right: 5px

</style>
