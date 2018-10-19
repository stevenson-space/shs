<template>
  <card v-show="show">
    <div class="rate-redesign-card">
      <span class="text">How's the redesign?</span>

      <div class="icon" v-hammer:tap="thumbsDown">
        <font-awesome-icon class="normal" :icon="faThumbsDown" fixed-width/>
        <font-awesome-icon class="hover" :icon="faThumbsDownHover" fixed-width/>
      </div>

      <div class="icon" v-hammer:tap="thumbsUp">
        <font-awesome-icon class="normal" :icon="faThumbsUp" fixed-width/>
        <font-awesome-icon class="hover" :icon="faThumbsUpHover" fixed-width/>
      </div>
    </div>
  </card>
</template>

<script>
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-regular-svg-icons';
import { faThumbsUp as faThumbsUpHover, faThumbsDown as faThumbsDownHover } from '@fortawesome/free-solid-svg-icons'; 
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import Card from 'common/Card.vue';

export default {
  data() {
    return {
      faThumbsUp,
      faThumbsDown,
      faThumbsUpHover,
      faThumbsDownHover,
      show: true,
    }
  },
  methods: {
    thumbsUp() {
      this.rate(true);
    },
    thumbsDown() {
      this.rate(false);
    },
    rate(good) {
      const rating = good ? 'good' : 'bad'
      localStorage.hasRatedRedesign = rating;
      this.$ga.event('Rate', rating);
      setTimeout(() => this.show = false, 100);
    }
  },
  created() {
    if (localStorage.hasRatedRedesign) {
      this.show = false;
    }
  },
  components: { Card, FontAwesomeIcon },
}
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.rate-redesign-card
  padding: 5px 20px
  font-weight: bold
  color: var(--color)
  display: flex
  align-items: center

  .text
    flex-grow: 15

  .icon
    flex-grow: 1
    font-size: 1.75em
    cursor: pointer

    .hover
      display: none

    &:hover, &:active
      .normal
        display: none
      .hover
        display: initial

</style>

