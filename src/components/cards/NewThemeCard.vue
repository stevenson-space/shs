<template>
  <timed-card v-if="theme.name !== themes[themes.length - 1].name" startTime="Nov 16, 2021" endTime="Dec 5, 2021">
    <div class="row">
      <rounded-button
        class="button"
        text="Try"
        :circular="false"
        @click="toggleColor()"
      />
      <div class="message">The New Winter Theme ☕</div>
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
  margin-right: 8px
  width: 40px
  height: 10px
</style>
