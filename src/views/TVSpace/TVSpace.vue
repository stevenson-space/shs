<template>
  <div class="page">
    <Card
      class="card"
      :ignoreStyleMutations="true"
      @height-change="onHeightChange"
    >
      <div class="container">
        <span class="countdown center">
          {{ intoCountdownString(this.totalSecondsLeft) }}
        </span>
        <span class="schedule-name center">{{ this.bell.type.toUpperCase() }}</span>
        <div class="divider"/>
        <ScrollablePeriodList class="list" ref="periodList"/>
      </div>
    </Card>
  </div>
</template>

<script lang="ts">
import ScheduleCard from '@/components/cards/ScheduleCard.vue';
import useClockStore from '@/stores/clock'
import Card from "@/components/Card.vue";
import { intoCountdownString } from '@/utils/countdown';
import { mapState } from "pinia";
import {dateToSeconds} from "@/utils/util";
import ScrollablePeriodList from "@/components/ScrollablePeriodList.vue";

export default {
  components: {
    ScrollablePeriodList,
    ScheduleCard,
    Card
  },
  computed: {
    ...mapState(useClockStore, ['bell', 'date']),
    totalSecondsLeft() {
      return this.bell.getSecondsUntilNextTarget() - dateToSeconds(this.date)
    }
  },
  methods: {
    intoCountdownString,
    onHeightChange() {
      this.$refs.periodList?.scrollToCurrentPeriod();
    }
  }
}
</script>

<style scoped lang="sass">
@import '@/styles/style.sass'

.page
  height: 100vh
  display: flex
  flex-direction: column
  justify-content: flex-start
  overflow: hidden

.divider
  height: 3px
  background: var(--color)
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2)
  margin-top: 4px

.container
  // FIXME: this max-height is a hacky fix until the cards & period component can
  // be fixed to be more responsive. currently, the scrolling for the period list
  // doesn't display unless the container is constrained smaller than the max
  // size it can be, and 95vh is mostly unnoticeable but gets the scrolling working
  max-height: 95vh
  display: flex
  flex-direction: column
  gap: 2px
  padding: 6px
  background: var(--background)
  color: var(--secondary)
  border-radius: 15px

  .list
    text-shadow: 1px 1px 4px rgba(0.8,0.8,0.8,0.65)
    font-weight: bold
    font-size: 22px

  .center
    text-align: center
    width: 100%

  .countdown
    font-size: 3.25em
    line-height: 1em
    color: var(--secondary)
    margin-top: 8px

  .schedule-name
    color: dimgray
    font-weight: bolder
    font-size: 1.65em
</style>
