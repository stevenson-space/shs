<template>
  <card
    v-if="schedule || bell?.isSchoolDay"
    class="card"
    :ignoreStyleMutations="true"
    @height-change="onHeightChange"
  >
    <div v-if="title" class="title">{{ title }}</div>
    <ScrollablePeriodList
      ref="periodList"
      :schedule="schedule"
      :maxHeight="maxHeight"
    />
    <slot />
  </card>
</template>

<script>
import Card from '@/components/Card.vue';
import { mapState } from 'pinia';
import useClockStore from '@/stores/clock';
import ScrollablePeriodList from "@/components/ScrollablePeriodList.vue";

export default {
  components: {
    ScrollablePeriodList,
    Card
  },
  props: {
    schedule: { type: Object, default: null },
    title: { type: String, default: 'Schedule' },
    maxHeight: { type: String, default: null },
  },
  computed: {
    ...mapState(useClockStore, ['bell']),
  },
  methods: {
    onHeightChange() {
      this.$refs.periodList?.scrollToCurrentPeriod();
    }
  }
};
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.card
  padding: 0 8px 6px

  .title
    text-align: center
    font-size: 1.5em
    margin: 15px 0
</style>
