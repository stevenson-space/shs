<template>
  <card :color="backgroundColor">
    <custom-link :href="link">
      <div class="icon">
        <font-awesome-icon :icon="icon" size="5x" :style="{ color: foregroundColor }"/>
      </div>
      <div class="text" :style="{ color: foregroundColor }">{{ text }}</div>
    </custom-link>
  </card>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import Card from './Card.vue';
import CustomLink from './CustomLink.vue'

export default {
  props: {
    color: { type: String, required: true },
    icon: { type: Object, required: true },
    text: { type: String, required: true },
    link: { type: [String, Object], default: ''},
    invert: { type: Boolean, default: false },
  },
  data() {
    return {
      backgroundColor: this.invert ? 'white' : this.color,
      foregroundColor: this.invert ? this.color : 'white',
    }
  },
  components: { Card, FontAwesomeIcon, CustomLink },
}
</script>

<style lang="sass" scoped>
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
