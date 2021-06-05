<template>
  <timed-card startTime="May 20, 2021" endTime="August 11, 2021">
    <img class="logo" src="static/summer.png">
    <div class="message">Have a great summer break!</div>
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
  height: 85px
  padding: 10px 5px

.message
  font-size: .9em
  text-align: center
  padding-bottom: 10px
</style>
