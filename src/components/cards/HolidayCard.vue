<template>
  <timed-card :startTime="breakWindow.startTime" :endTime="breakWindow.endTime">
    <img class="logo" src="@/assets/occasions/snowman.png">
    <div class="message">{{ breakWindow.message }}</div>
  </timed-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import TimedCard from './TimedCard.vue';

const breakWindow = computed(() => {
  const now = new Date();
  const year = now.getMonth() === 11 ? now.getFullYear() : now.getFullYear() - 1;

  return {
    startTime: `December 15, ${year}`,
    endTime: `January 4, ${year + 1}`,
    message: 'Good luck on finals and have an amazing break! ❄️',
  };
});
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
