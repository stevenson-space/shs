<template>
  <div class="page">
    <Card>
      <div class="container">
        <span class="countdown">
          {{ intoCountdownString(this.totalSecondsLeft) }}
        </span>
        <h6>{{ this.bell.type.toUpperCase() }}</h6>
        <ScrollablePeriodList/>
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

.container
  display: flex
  flex-direction: column
  align-items: center
  gap: 2px
  padding: 6px
  background: var(--background)
  color: var(--secondary)
  border-radius: 15px
  font-weight: bold

  .countdown
    font-size: 3em
    line-height: 1em
    color: var(--secondary)
    margin-top: 8px

  h6
    color: darkgrey
    font-size: large
    padding-bottom: 8px
    margin: 8px
</style>
