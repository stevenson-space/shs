<template>
  <card v-show="showCard">
    <img class="logo" src="static/snowman.png" />
    <div class="message">Have a great winter break!</div>
  </card>
</template>
<script>
import Card from "common/Card.vue";

export default {
  components: { Card },
  computed: {
    showCard() {
      //start December 14, 2020, end January 6, 2021 
      var startTime = 1607925600; //in epoch miliseconds 
      var endTime = 1609912800;
      var today = new Date() / 1000;
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
  .color
</style>
