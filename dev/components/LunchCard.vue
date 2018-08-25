<template>
  <card v-show="bell.school">
    <div class="title">Lunch</div>
    <div class="lunch" v-for="(items, name) in lunch" :key="name">
      <div class="name">{{ name }}</div>
      <div class="item" v-for="item in items" :key="item">
        {{ item }}
      </div>
    </div>
  </card>
</template>

<script>
import getLunch from '../js/lunch.js';
import Card from './Card.vue';

export default {
  props: {
    date: { type: Date, required: true },
    bell: { type: Object, required: true },
  },
  computed: {
    lunch() {
      return getLunch(this.date);
    }
  },
  components: { Card },
}
</script>

<style lang="sass" scoped>
@import '../styles/style.sass'

.title
  text-align: center
  font-size: 1.5em
  margin: 15px 0

.lunch
  border-top: var(--color) 2px solid
  padding: 10px 0

  .name
    color: var(--color)
    font-weight: bold
    font-size: .75em
    text-align: center

  .item
    text-align: center
    margin: auto
    margin-top: 5px

</style>
