<template>
  <div>
    <theme-change-modal
      :newTheme="selectedTheme"
      :showModal="showModal"
      v-on:true="choice(true)"
      v-on:false="choice(false)"
      v-on:close="showModal = false"
    />
    <div class="theme-row">
      <theme-circle
        v-for="themeItem in themes"
        v-bind:key="themeItem.name"
        v-show="showTheme(themeItem)"
        @click="changeTheme(themeItem)"
        :theme="themeItem"
        :isCurrentTheme="themeItem.name==theme.name && themeItem.suggestedColor == color"
      />
    </div>
  </div>
</template>

<script lang="ts">
import themeCircle from '@/views/Colors/ThemeCircle.vue';
import themes from '@/data/themes.json';
import ThemeChangeModal from '@/components/ThemeChangeModal.vue';
import useThemeStore from '@/stores/themes';
import useScheduleStore from '@/stores/schedules';
import { mapState, mapActions } from 'pinia';
import { defineComponent } from 'vue';
import { MapStateToComputed, Theme } from '@/utils/types';

type ThemeStoreState = {
  theme: Theme;
  color: string;
}

type ScheduleStoreState = {
  date: Date;
}

export default defineComponent({
  components: { themeCircle, ThemeChangeModal },
  computed: {
    ...(mapState(useThemeStore, ['theme', 'color']) as MapStateToComputed<ThemeStoreState>),
    ...(mapState(useScheduleStore, ['date']) as MapStateToComputed<ScheduleStoreState>),
  },
  data() {
    return {
      showModal: false,
      themes,
      selectedTheme: themes[0] as Theme,
    };
  },
  methods: {
    ...mapActions(useThemeStore, ['setTheme']),
    choice(useThemeColor: boolean): void {
      const data = { theme: this.selectedTheme, useThemeColor };
      this.showModal = false;
      this.setTheme(data);
    },
    changeTheme(theme: Theme): void {
      if (theme !== this.theme || theme.suggestedColor !== this.color) {
        this.selectedTheme = theme;
        if (this.color !== this.theme.suggestedColor) { //  if the color you set differs from the suggested color ("color conflict")
          this.showModal = true;
        } else {
          this.choice(true);
        }
      }
    },
    showTheme(theme: Theme): boolean {
      const { schedule } = theme;
      if (schedule === 'always') {
        return true;
      }
      const [startTime, endTime] = [
        new Date(schedule.substring(0, schedule.indexOf('-'))).getTime(),
        new Date(schedule.substring(schedule.indexOf('-') + 1)).getTime(),
      ];
      return this.date.getTime() > startTime && this.date.getTime() < endTime;
    },
  },
});
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'
.theme-row
    margin-bottom: 20px
    display: flex
    justify-content: center
    overflow-x: hidden
</style>
