<template>
  <a class="link" :href="link" target="_blank" @click="handleAnalytics">
    <div class="image">
      <img :src="image"/>
    </div>

    <div>
      <div class="title">
        <slot/>
      </div>
      <div class="text" v-if="text">{{ text }}</div>
      <div class="site" v-if="site">{{ site }}</div>
    </div>

    <font-awesome-icon :icon="faExternalLinkAlt" class="icon"/>
  </a>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

export default {
  props: {
    link: { type: String, required: true },
    image: { type: String, required: true },
    text: { type: String, required: false },
    site: { type: String, required: false },
    analytics: { type: String, required: false },
  },
  data() {
    return {
      faExternalLinkAlt
    }
  },
  methods: {
    handleAnalytics() {
      if (this.analytics) {
        this.$ga.event('hackathon', this.analytics);
      }
    }
  },
  components: { FontAwesomeIcon }
}
</script>

<style lang="sass" scoped>
.link
  // width: 90%
  display: flex
  border: thin #bbb solid
  border-radius: 15px
  overflow: hidden
  align-items: center
  text-decoration: none
  color: black
  position: relative

  .color
    color: var(--color)

  .image
    width: 18%
    margin: 0 5px

    img
      width: 100%

  .title
    font-weight: bold
    font-size: 1.15em
    // color: var(--color)

  .text
    font-size: .55em
    margin-top: 2px

  .site
    font-size: .75em
    color: grey
    margin: 3px 0

  .icon
    margin: 0 5px
    color: var(--color)
    // color: grey
    // align-self: flex-end
    // width: 0
    position: absolute
    bottom: 5px
    right: 5px
    // display: block
    // font-size: 1em

</style>
