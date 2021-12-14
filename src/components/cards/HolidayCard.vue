<template>
  <timed-card startTime="December 12, 2021" endTime="January 2, 2022">
    <img class="logo" src="static/snowman.png">
    <div class="message">Good luck on finals and have a good break!</div>
  </timed-card>
</template>

<script>
import TimedCard from './TimedCard.vue';

export default {
  components: { TimedCard },
};
</script>

<style lang="sass" scoped>
.logo
  display: block
  margin-left: auto
  margin-right: auto
  height: 110px
  padding: 10px 5px

.message
  font-size: .9em
  text-align: center
  padding-bottom: 10px
</style>
