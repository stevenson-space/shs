<template>
  <timed-card startTime="May 20, 2021" endTime="September 1, 2021">
    <div class="row">
      <div v-if="theme.name !== themes[themes.length - 1].name" class="message">Introducing <b>{{capitalize(themes[themes.length - 1].name)}} Mode</b></div>
      <div v-else class="message">Go Back To <b>{{capitalize(themes[0].name)}} Mode</b></div>
      <rounded-button
        class="button"
        text="Try It"
        :circular="false"
        @click="toggleColor()"
      />
      <theme-change-modal :newTheme="getNewTheme()" :showModal="showModal"
      v-on:true="choice(true)"
      v-on:false="choice(false)"
      v-on:close="showModal = false" />
    </div>
  </timed-card>
</template>

<script>
import themes from '@/data/themes.json';
import TimedCard from '@/components/cards/TimedCard.vue';
import { mapState } from 'vuex';
import RoundedButton from '@/components/RoundedButton.vue';
import ThemeChangeModal from '@/components/ThemeChangeModal.vue';

export default {
  components: { TimedCard, RoundedButton, ThemeChangeModal },
  computed: {
    ...mapState(['theme', 'color']),
  },
  data() {
    return {
      showModal: false,
      themes,
    };
  },
  methods: {
    choice(useThemeColor) {
      const data = { useThemeColor };
      this.showModal = false;
      data.theme = this.getNewTheme();
      this.$store.commit('setTheme', data);
    },
    toggleColor() {
      if (this.color !== this.theme.suggestedColor) { //  if the color you set differs from the suggested color ("color conflict")
        this.showModal = true;
      } else {
        this.choice(true);
      }
    },
    getNewTheme() {
      return this.theme.name !== this.themes[this.themes.length - 1].name ? this.themes[this.themes.length - 1] : themes[0];
    },
    capitalize(str) {
      return str.substring(0, 1).toUpperCase() + str.substring(1);
    },
  },
};
</script>

<style lang="sass" scoped>
.row
  display: flex
  justify-content: center
  align-items: center
.message
  margin-top: 8px
  font-size: .9em
  text-align: center
  padding-bottom: 10px
.button
  margin-left: 8px
  width: 40px
  height: 10px
</style>
