<template>
  <card v-show="bell?.school && bell?.type != 'Summer' && lunch">
    <div class="title">Lunch</div>
    <div v-if="noLunchData" class="no-data lunch">
          No Lunch Data
         <what-is-this>Stevenson.Space relies on quality data dispayed by Stevenson's lunch website. We will promptly restore lunch functionality once data is provided there.</what-is-this>
    </div>
    <div v-else v-for="(items, name) in lunch" :key="name" class="lunch">
      <div class="name">{{ name }}</div>
      <div v-for="item in items" :key="item" class="item">
        {{ item }}
      </div>
    </div>
  </card>
</template>

<script>
import getLunch from '@/utils/lunch';
import Card from '@/components/Card.vue';
import WhatIsThis from '@/components/WhatIsThis.vue';
import { mapState } from 'pinia';
import useScheduleStore from '@/stores/schedules';

export default {
  components: { Card, WhatIsThis },
  data() {
    return {
      noLunchData: true,
    };
  },
  computed: {
    ...mapState(useScheduleStore, ['bell', 'date']),
    lunch() {
      return getLunch(this.date);
    },
  },
};
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.title
  text-align: center
  font-size: 1.5em
  margin: 15px 0

.no-data
  text-align: center
  margin-bottom: 4px

.lunch
  border-top: var(--color) 1.5px solid
  padding: 10px 0

  .name
    color: var(--color)
    font-weight: bold
    font-size: .85em
    text-align: center

  .item
    text-align: center
    margin: auto
    margin-top: 5px

</style>
