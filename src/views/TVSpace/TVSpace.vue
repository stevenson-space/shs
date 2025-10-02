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
        <ScrollablePeriodList class="list" ref="periodList" :tv-space="true"/>
      </div>
    </Card>
  </div>
</template>

<script lang="ts">
import ScheduleCard from '@/components/cards/ScheduleCard.vue';
import useClockStore from '@/stores/clock'
import Card from "@/components/Card.vue";
import { intoCountdownString } from '@/utils/countdown';
import { mapActions, mapState } from "pinia";
import {dateToSeconds} from "@/utils/util";
import ScrollablePeriodList from "@/components/ScrollablePeriodList.vue";
import tvspaceTheme from '@/themes/tvspace.json';
import useThemeStore from '@/stores/themes';


export default {
  components: {
    ScrollablePeriodList,
    ScheduleCard,
    Card
  },
  mounted() {
    if (this.$route.query.settheme === 'true') {
      this.setTheme(tvspaceTheme);
    }
  },
  computed: {
    ...mapState(useClockStore, ['bell', 'date']),
    totalSecondsLeft() {
      return this.bell.getSecondsUntilNextTarget() - dateToSeconds(this.date)
    }
  },
  methods: {
    ...mapActions(useThemeStore, ['setTheme']),
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
  height: 2px
  background: var(--accent)
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2)
  margin-top: 2px
  margin-bottom: 1px

.container
  // FIXME: this max-height is a hacky fix until the cards & period component can
  // be fixed to be more responsive. currently, the scrolling for the period list
  // doesn't display unless the container is constrained smaller than the max
  // size it can be, and 97vh is mostly unnoticeable but gets the scrolling working
  max-height: 97vh
  display: flex
  flex-direction: column
  gap: 1px
  padding: 2px
  background: var(--background)
  color: var(--secondary)
  border-radius: 8px
  width: 100%
  box-sizing: border-box

  .list
    text-shadow: 1px 1px 4px rgba(0.8,0.8,0.8,0.65)
    font-weight: bold
    font-size: 20px

  .center
    text-align: center
    width: 100%

  .countdown
    font-size: 2.6em
    line-height: 0.9em
    color: var(--secondary)
    margin-top: 2px
    margin-bottom: 3px

  .schedule-name
    color: lightgray
    font-weight: bolder
    font-size: 1.1em
    line-height: 1em
    margin-bottom: 1px
</style>
