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
  </card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import getLunch from '@/utils/lunch';
import useClockStore from '@/stores/clock';
import Card from '@/components/Card.vue';
import WhatIsThis from '@/components/WhatIsThis.vue';

const clockStore = useClockStore();

const lunch = computed(() => getLunch(clockStore.date));

const noLunchData = computed(() => lunch.value === null);
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

.lunch:last-child
  .lunch-content
    border-top: none

</style>
