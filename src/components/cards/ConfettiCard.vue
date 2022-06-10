<template>
  <card>
    <p style="text-align: center;">Congratulations to the class of <b>2022</b>, welcome class of <b>2026</b>! To celebrate the end of a great year, we've added confetti mode. Have a great summer!<p>
    <div class="button-row">
      <rounded-button v-if="!confettiMode" class="button" @click="start()" text="Start 🎉"></rounded-button>
      <rounded-button v-if="confettiMode" class="button" @click="stop()" text="Disable"></rounded-button>
    </div>
    <br>
  </card>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import Card from '@/components/Card.vue';
import Vue from 'vue';
import VueConfetti from 'vue-confetti';
import RoundedButton from '@/components/RoundedButton.vue';

Vue.use(VueConfetti);

export default {
  components: { Card, RoundedButton },
  data() {
    return {
      settings: {
        defaultDropRate: 4,
        particlesPerFrame: 0.3,
        particles: [
          {
            type: 'heart',
          },
          {
            type: 'rect',
          },
          {
            type: 'circle',
          },
          {
            type: 'image',
            url: '/static/patriot.png',
            size: 15,
          },
        ],
        defaultColors: [
          '#1b5e20',
          '#b38825',
          '#a864fd',
          '#29cdff',
          '#78ff44',
          '#ff718d',
          '#fdff6a',
        ],
      },
    };
  },
  computed: {
    ...mapState(['confettiMode']),
  },
  methods: {
    start() {
      this.setConfettiMode(true);
      this.$confetti.start(this.settings);
    },
    stop() {
      this.setConfettiMode(false);
      this.$confetti.stop();
    },
    ...mapMutations(['setConfettiMode']),
  },
  mounted() {
    if (this.confettiMode) {
      this.$confetti.start(this.settings);
    }
  },
};
</script>

<style lang="sass" scoped>
.button-row
  display: flex
  justify-content: center
  gap: 10px
  .button
    width: 70px
</style>
