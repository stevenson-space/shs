<template>
  <card v-show="bell?.school && bell?.type != 'Summer' && lunch">
    <div class="title">Lunch</div>
    <div v-if="noLunchData" class="no-data lunch">
          No Lunch Data
         <what-is-this>Stevenson.Space relies on quality data dispayed by Stevenson's lunch website. We will promptly restore lunch functionality once data is provided there.</what-is-this>
    </div>
    <div v-else>
      <div v-for="(items, name) in lunch" :key="name" class="lunch">
        <div class="name">{{ name }}</div>
        <div v-for="item in items" :key="item" class="item">
          {{ item }}
        </div>
      </div>
    </div>
    <div class="button-container">
      <font-awesome-icon
        class="expand-button"
        :icon="expandIcon"
        @mousedown="showModal"
      />
    </div>
    <div v-show="modalShowing" id="expandedLunch" class="modal">
      <div class="modal-content">
        <div class="top-bar">
          <span class="close" @mousedown="hideModal">&times;</span>
          <p>Full Menu</p>
        </div>
        <div class="text-container" v-for="(items,name) in arrangedData" :key="name">
          <div class="name">{{ name }}</div>
          <div v-for="item in items" :key="item" class="item">
            {{ item }}
          </div>
        </div>
      </div>
    </div>
  </card>
</template>

<script>
import { faExpand } from '@fortawesome/free-solid-svg-icons';
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
      expandIcon: faExpand,
      modalShowing: false,
      arrangedData: miscData.menuGroups,
    };
  },
  computed: {
    ...mapState(useScheduleStore, ['bell', 'date']),
    lunch() {
      return getLunch(this.date);
    },
  },
  methods: {
    showModal() {
      this.modalShowing = true;
    },
    hideModal() {
      this.modalShowing = false;
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

.button-container
  display: flex
  justify-content: center
  border-top: var(--color) 1.5px solid

  .expand-button
    padding: 15px
    height: 25px
    width: 25px
    transition: padding 200ms, width 200ms, height 200ms

  .expand-button:hover
    padding: 13px
    height: 29px
    width: 29px

.modal
  position: fixed
  z-index: 1
  left: 0
  top: 0
  width: 100%
  height: 100%
  overflow: auto
  background-color: rgb(0,0,0)
  background-color: rgba(0,0,0,0.4)

  .modal-content
    background-color: white
    margin: 15% auto
    padding: 5px 20px
    border: 3px solid var(--color)
    width: 80%

    .top-bar
      display: flex
      .close
        font-size: 40px
        color: black
        opacity: 0.5
        text-decoration: none
        transition: opacity 300ms

      .close:hover
        opacity: 1
        cursor: pointer

      p
        font-size: 1.5em
        margin: 10px
        left: 50%
        position: absolute
        transform: translate(-50%,0)

    .text-container
      border-top: var(--color) 1.5px solid
      padding: 10px 0

</style>
