<template>
  <card v-show="clockStore.bell?.isSchoolDay && clockStore.bell?.type != 'Summer' && lunch">
    <div class="title">Lunch</div>
    <div v-for="(items, name) in lunch" :key="name" class="lunch">
      <div class="lunch-content">
        <div class="name">{{ name }}</div>
        <div v-for="item in items" :key="item" class="item">
          {{ item }}
        </div>
      </div>
    </div>
  </card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import useClockStore from '@/stores/clock';
import Card from '@/components/Card.vue';
import { rotatingMenuMap } from '@/utils/food/rotating-map';

const clockStore = useClockStore();

const lunch = computed(() => {
  try {
    const menu = rotatingMenuMap.getMenuUnchecked(clockStore.date);
    const dayOfWeek = clockStore.date.toLocaleDateString('en-US', { weekday: 'long' });
    
    return {
      'Comfort Food': [menu.comfort],
      'Mindful': [menu.mindful],
      'Sides': menu.sides,
      'Soup': menu.soup,
      'International': [menu.international],
      'Special': [`${menu.special} ${dayOfWeek}`],
    };
  } catch (e) {
    if (e instanceof RangeError) {
      console.error(e);
      return null;
    }
    throw e;
  }
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


.lunch element
  .lunch:last-child .lunch-content
  border-top: none

</style>
