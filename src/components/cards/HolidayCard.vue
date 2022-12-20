<template>
  <timed-card startTime="December 19, 2022" endTime="January 10, 2023">
    <img class="logo" src="@/assets/occasions/snowman.png">
    <div class="message">Good luck on finals and have an amazing break! ❄️</div>
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
