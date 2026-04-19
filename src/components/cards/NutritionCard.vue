<template>
  <card v-show="clockStore.bell?.isSchoolDay && clockStore.bell?.type != 'Summer'" class="nutrition-card">
    <div class="title-row">
      <p class="title">Nutrition</p>
      <custom-link class="view-link" :href="{ name: 'nutrition' }">Open Menu</custom-link>
    </div>
    <div class="green-line"></div>

    <div class="summary-block">
      <p class="summary-label">Today's rotating special</p>
      <p class="summary-name">{{ todaysSpecial?.name || 'No rotating special' }}</p>
      <p class="summary-meta" v-if="todaysSpecial">
        {{ todaysSpecial.location }} • {{ todaysSpecial.weekday }}
      </p>
    </div>
  </card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Card from '@/components/Card.vue';
import CustomLink from '@/components/CustomLink.vue';
import useClockStore from '@/stores/clock';
import nutritionData from '@/data/nutrition.json';

const clockStore = useClockStore();

const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const todaysSpecial = computed(() => {
  const weekday = weekdayNames[new Date(clockStore.date).getDay()];
  return nutritionData.rotatingSpecials.find((item) => item.weekday === weekday);
});
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.nutrition-card
  padding: 0 8px 12px

.title-row
  display: flex
  justify-content: space-between
  align-items: center
  gap: 12px
  margin: 15px 0

.title
  margin: 0
  font-size: 20px

.view-link
  color: var(--accent)
  font-size: 13px
  font-weight: 700

.green-line
  width: 100%
  height: 1px
  background-color: var(--accent)
  margin-bottom: 14px

.summary-block
  text-align: center
  padding: 4px 0 10px

.summary-label
  margin: 0
  font-size: 12px
  text-transform: uppercase
  letter-spacing: 0.08em
  color: var(--secondary)

.summary-name
  margin: 8px 0 4px
  font-size: 22px
  font-weight: 700

.summary-meta
  margin: 0
  color: var(--accent)
  font-size: 14px

</style>
