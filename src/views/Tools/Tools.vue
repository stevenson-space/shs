<template>
  <div>
    <plain-header title="Tools" />
    <card-container>
      <timer-card />
    </card-container>
  </div>
</template>

<script>
import PlainHeader from '@/components/PlainHeader.vue';
import CardContainer from '@/components/CardContainer.vue';
import TimerCard from './TimerCard.vue';

export default {
  components: {
    PlainHeader,
    CardContainer,
    TimerCard,
  },
};
</script>

<style lang="sass" scoped>

</style>
