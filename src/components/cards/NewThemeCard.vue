<template>
  <card v-if="newTheme != null && !isDismissed">
    <div class="card-content">
      <div class="row">
        <rounded-button
          class="button"
          text="Try"
          :circular="false"
          @click="toggleTheme()"
        />
        <div class="message">{{ newTheme.seasonal?.message?.replace('[Try]','') || '' }}</div>
      </div>
      <div v-if="newTheme.metadata?.description" class="description">{{ newTheme.metadata.description }}</div>
      <button class="close-btn" @click="dismiss">&times;</button>
    </div>
  </card>
</template>

<script>
import Card from '@/components/Card.vue';
import RoundedButton from '@/components/RoundedButton.vue';
import { mapState, mapActions } from 'pinia';
import useClockStore from '@/stores/clock';
import useThemeStore from '@/stores/themes';
import { parseDateRange, isDateInRange, loadAllThemes } from '@/utils/themes';

export default {
  components: { Card, RoundedButton },
  computed: {
    ...mapState(useThemeStore, ['theme']),
    ...mapState(useClockStore, ['date']),
    newTheme() {
      // finds a seasonal theme that is within the current date range
      const now = this.date;

      for (const theme of this.themes) {
        if (!theme.seasonal?.dates) continue;

        const [start, end] = parseDateRange(theme.seasonal.dates, now);
        if (isDateInRange(now, start, end)) {
          return theme;
        }
      }
      return null;
    },
    isDismissed() {
      if (!this.newTheme) return false;
      const dismissedThemes = JSON.parse(localStorage.getItem('dismissedThemeCards') || '{}');
      const dismissedYear = dismissedThemes[this.newTheme.metadata.name];
      const currentYear = this.date.getFullYear();
      return dismissedYear === currentYear;
    },
  },
  data() {
    return {
      themes: [],
    };
  },
  methods: {
    ...mapActions(useThemeStore, ['setTheme']),

    toggleTheme() {
      this.setTheme(this.newTheme);
    },

    dismiss() {
      const dismissedThemes = JSON.parse(localStorage.getItem('dismissedThemeCards') || '{}');
      const currentYear = this.date.getFullYear();
      dismissedThemes[this.newTheme.metadata.name] = currentYear;
      localStorage.setItem('dismissedThemeCards', JSON.stringify(dismissedThemes));
    },
  },
  async mounted() {
    this.themes = await loadAllThemes();
  },
};
</script>

<style lang="sass" scoped>
.card-content
  display: flex
  align-items: center
  gap: 10px
  padding: 15px
  position: relative

.row
  display: flex
  justify-content: center
  align-items: center
  gap: 10px
  flex: 1

.message
  font-size: .9em
  text-align: center

.description
  text-align: center
  font-size: .9em
  flex: 1

.button
  width: 40px
  height: 10px

.close-btn
  background: transparent
  border: none
  font-size: 24px
  color: var(--secondary)
  cursor: pointer
  padding: 0
  width: 30px
  height: 30px
  display: flex
  align-items: center
  justify-content: center
  line-height: 1
  opacity: 0.6
  transition: opacity 0.2s
  flex-shrink: 0

  &:hover
    opacity: 1
</style>
