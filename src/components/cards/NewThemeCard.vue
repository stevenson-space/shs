<template>
  <card v-if="newTheme != null && theme.name !== newTheme.name">
    <div class="row">
      <rounded-button
        class="button"
        text="Try"
        :circular="false"
        @click="toggleColor()"
      />
      <div class="message">{{ newTheme.message.replace('[Try]','') }}</div>
      <theme-change-modal :newTheme="newTheme" :showModal="showModal"
      v-on:true="choice(true)"
      v-on:false="choice(false)"
      v-on:close="showModal = false" />
    </div>
  </card>
</template>

<script>
import themes from '@/data/themes.json';
import Card from '@/components/Card.vue';
import { mapState, mapGetters } from 'vuex';
import RoundedButton from '@/components/RoundedButton.vue';
import ThemeChangeModal from '@/components/ThemeChangeModal.vue';

export default {
  components: { Card, RoundedButton, ThemeChangeModal },
  computed: {
    ...mapState(['theme', 'color']),
    ...mapGetters([
      'date',
    ]),
    newTheme() { // finds a seasonal theme that within the current date
      for (const x of this.themes) {
        const { schedule } = x;
        if (schedule.toLowerCase() !== 'always') {
          const [startTime, endTime] = [
            new Date(schedule.substring(0, schedule.indexOf('-'))).getTime(),
            new Date(schedule.substring(schedule.indexOf('-') + 1)).getTime(),
          ];
          if (this.date.getTime() > startTime && this.date < endTime) {
            return x;
          }
        }
      }
      return null;
    },
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
      data.theme = this.newTheme;
      this.$store.commit('setTheme', data);
    },
    toggleColor() {
      if (this.color !== this.theme.suggestedColor) { //  if the color you set differs from the suggested color ("color conflict")
        this.showModal = true;
      } else {
        this.choice(true);
      }
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
