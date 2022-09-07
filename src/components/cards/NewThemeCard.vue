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
      <div class="description">{{ newTheme.description }}</div>
  </card>
</template>

<script>
import themes from '@/data/themes.json';
import Card from '@/components/Card.vue';
import RoundedButton from '@/components/RoundedButton.vue';
import ThemeChangeModal from '@/components/ThemeChangeModal.vue';
import useScheduleStore from '@/stores/schedules';
import useThemeStore from '@/stores/themes';
import { mapState, mapActions } from 'pinia';

export default {
  components: { Card, RoundedButton, ThemeChangeModal },
  computed: {
    ...mapState(useThemeStore, ['theme', 'color']),
    ...mapState(useScheduleStore, ['date']),
    newTheme() { // finds a seasonal theme that within the current date
      for (const x of this.themes) {
        const { schedule } = x;
        if (schedule !== 'always') {
          const [startTime, endTime] = [
            new Date(schedule.substring(0, schedule.indexOf('-'))).getTime(),
            new Date(schedule.substring(schedule.indexOf('-') + 1)).getTime(),
          ];
          const currentTime = this.date.getTime();
          if ((currentTime > startTime) && (this.date < endTime) && ((currentTime - startTime) < 6.048e8)) { // if the theme is within the start and end time, and within the first 7 days
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
    ...mapActions(useThemeStore, ['setTheme']),
    choice(useThemeColor) {
      const data = { useThemeColor };
      this.showModal = false;
      data.theme = this.newTheme;
      this.setTheme(data);
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
.description
  text-align: center
  font-size: .9em
  padding: 5px 10px 10px 10px
.button
  margin-right: 8px
  width: 40px
  height: 10px
</style>
