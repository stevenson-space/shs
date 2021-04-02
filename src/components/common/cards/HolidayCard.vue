<template>
  <card v-show="showCard">
    <img class="logo" src="static/snowman.png">
    <div class="message">Happy Snow Day!</div>
  </card>
</template>

<script>
import Card from "common/Card.vue";

export default {
  components: { Card },
  computed: {
    showCard() {
      const startTime = 1613455260; //Use "Epoch Timestamp" from https://www.epochconverter.com/
     const endTime = 1613541540;
      const today = new Date() / 1000;
      return today > startTime && today < endTime;
    },
  },
};
</script>

<style lang="sass" scoped>
.logo
  display: block
  margin-left: auto
  margin-right: auto
  height: 85px
  padding: 10px 5px

.message
  font-size: .85em
  text-align: center
  padding-bottom: 10px
</style>
