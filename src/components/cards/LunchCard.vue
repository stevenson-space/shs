<template>
  <card v-show="clockStore.bell?.isSchoolDay && clockStore.bell?.type != 'Summer' && (lunch || noLunchData)">
    <div class="title">Lunch</div>
    <div v-if="noLunchData" class="no-data lunch">
          No Lunch Data
         <what-is-this>Stevenson.Space relies on quality data dispayed by Stevenson's lunch website. We will promptly restore lunch functionality once data is provided there.</what-is-this>
    </div>
    <div v-else v-for="(items, name) in lunch" :key="name" class="lunch">
      <div class="lunch-content">
        <div class="name">{{ name }}</div>
        <div v-for="item in items" :key="item" class="item">
          {{ item }}
        </div>
      </div>
    </div>
    <div class="nutrition-special">
      <div class="special-label">Today's rotating special</div>
      <div class="special-name">{{ todaysSpecial?.name || 'No rotating special' }}</div>
      <div v-if="todaysSpecial" class="special-meta">
        {{ todaysSpecial.location }}
      </div>
    </div>
    <div class="nutrition-link-row">
      <custom-link class="nutrition-link" :href="{ name: 'nutrition' }">
        Explore Nutrition Menu
      </custom-link>
    </div>
  </card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import getLunch from '@/utils/lunch';
import useClockStore from '@/stores/clock';
import Card from '@/components/Card.vue';
import WhatIsThis from '@/components/WhatIsThis.vue';
import CustomLink from '@/components/CustomLink.vue';
import nutritionData from '@/data/nutrition.json';

const clockStore = useClockStore();
const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const lunch = computed(() => getLunch(clockStore.date));
const noLunchData = computed(() => lunch.value === null);
const todaysSpecial = computed(() => {
  const weekday = weekdayNames[new Date(clockStore.date).getDay()];
  return nutritionData.rotatingSpecials.find((item) => item.weekday === weekday);
});
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.title
  text-align: center
  font-size: 1.5em
  margin: 15px 0

.no-data
  text-align: center
  margin-bottom: 4px

.lunch
  padding: 0 8px
  .lunch-content
    border-top: var(--accent) 1px solid
    padding: 10px 0px

  .name
    color: var(--accent)
    font-weight: bold
    font-size: .85em
    text-align: center

.item
    text-align: center
    margin: auto
    margin-top: 5px

.nutrition-link-row
  padding: 12px 8px 14px
  border-top: var(--accent) 1px solid

.nutrition-special
  padding: 12px 8px 14px
  border-top: var(--accent) 1px solid
  text-align: center

.special-label
  margin: 0
  font-size: 12px
  text-transform: uppercase
  letter-spacing: 0.08em
  color: var(--secondary)

.special-name
  margin-top: 8px
  font-size: 1.25em
  font-weight: bold

.special-meta
  margin-top: 4px
  color: var(--accent)
  font-size: .9em

.nutrition-link
  width: fit-content
  margin: 0 auto
  padding: 8px 14px
  border-radius: 999px
  border: 1px solid var(--accent)
  color: var(--accent)
  font-weight: 700


.lunch element
  .lunch:last-child .lunch-content
  border-top: none

</style>
