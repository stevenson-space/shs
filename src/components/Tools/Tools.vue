<template>
  <div>
    <plain-header title="Tools" />
    <card-container>
      <timer-card />
    </card-container>
  </div>
</template>

<script>
import PlainHeader from 'common/PlainHeader.vue';
import CardContainer from 'common/CardContainer.vue';
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
