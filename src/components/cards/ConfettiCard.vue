<template>
  <card>
    <p style="text-align: center;">Congratulations to the class of <b>2022</b>, welcome class of <b>2026</b>! To celebrate the end of a great year, we've added confetti mode. Have a great summer!</p>
    <div class="button-row">
      <rounded-button v-if="!confettiMode" class="button" @click="start()" text="Start 🎉"></rounded-button>
      <rounded-button v-if="confettiMode" class="button" @click="stop()" text="Disable"></rounded-button>
    </div>
    <br>
  </card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Card from '@/components/Card.vue';
import RoundedButton from '@/components/RoundedButton.vue';

const confettiMode = ref(false);

function start(): void {
  confettiMode.value = true;
}

function stop(): void {
  confettiMode.value = false;
}
</script>

<style lang="sass" scoped>
.button-row
  display: flex
  justify-content: center
  gap: 10px
  .button
    width: 70px
</style>
