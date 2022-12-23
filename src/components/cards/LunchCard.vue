<template>
  <card v-show="bell?.school && bell?.type != 'Summer' && lunch">
    <div class="title">Lunch</div>
    <div v-if="noLunchData" class="no-data lunch">
          No Lunch Data
         <what-is-this>Stevenson.Space relies on quality data dispayed by Stevenson's lunch website. We will promptly restore lunch functionality once data is provided there.</what-is-this>
    </div>
    <div v-else>
      <div v-if="isMorning" class="lunch">
        <div class="name">Ala Carte Breakfast</div>
        <div v-for="item in alBreakfast" :key="item" class="item">
          {{ item }}
        </div>
      </div>
      <div v-for="(items, name) in lunch" :key="name" class="lunch">
        <div class="name">{{ name }}</div>
        <div v-for="item in items" :key="item" class="item">
          {{ item }}
        </div>
      </div>
      <div v-for="(items, name) in mData" :key="name" class="exLunch">
        <div class="name">{{ name }}</div>
        <div v-for="item in items" :key="item" class="item">
          {{ item }}
        </div>
      </div>
    </div>
    <p>{{isExpanded}}</p>
    <div class="arrow-container">
      <font-awesome-icon
        v-show="(expandNums < 3)"
        :icon="icons.faChevronDown"
        class="expand arrow"
        @mousedown="expand"
      />
      <font-awesome-icon
        v-show="(expandNums > 0)"
        :icon="icons.faChevronUp"
        class="collapse arrow"
        @mousedown="condense"
      />
    </div>
  </card>
</template>

<script>
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import getLunch from '@/utils/lunch';
import Card from '@/components/Card.vue';
import WhatIsThis from '@/components/WhatIsThis.vue';
import { mapState } from 'pinia';
import useScheduleStore from '@/stores/schedules';
import miscData from '@/data/miscLunch.json';

export default {
  components: { Card, WhatIsThis },
  data() {
    return {
      noLunchData: false,
      icons: {
        faChevronDown,
        faChevronUp,
      },
      expandNums: 0,
      alBreakfast: ['Bacon', 'Sausage', 'Potatoes', 'Eggs'],
    };
  },
  computed: {
    ...mapState(useScheduleStore, ['bell', 'date']),
    lunch() {
      return getLunch(this.date);
    },
    isMorning() {
      const currentDate = new Date();
      const currTime = currentDate.getHours() * 100 + currentDate.getMinutes();
      if (currTime < 830) {
        return true;
      }
      return false;
    },
    mData() {
      const x = miscData.list;
      let fList = {};
      for (let i = 0; i < this.expandNums; i++) {
        fList = { ...fList, ...x[i] };
      }
      return fList;
    },
  },
  methods: {
    expand() {
      if (this.expandNums < 4) {
        this.expandNums += 1;
      }
    },
    condense() {
      if (this.expandNums > 0) {
        this.expandNums -= 1;
      }
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

.exLunch
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
.arrow-container
  display: flex
  justify-content: center

  .arrow
    margin: -3px 10px 5px 10px
    font-size: 1.75em
    cursor: pointer
    color: var(--color)

</style>
