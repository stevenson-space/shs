<template>
<!-- a template for making cards show up on custom time intervals -->
  <card v-show="showCard">
    <slot />
  </card>
</template>
<script>
import Card from "common/Card.vue";
export default {
  components: { Card },
  props: {
    startTime: { type: String, required: true}, //example "May 22, 2021"
    endTime: { type: String, required: true},
  },
  computed: {
    showCard() {
      const [startTime, endTime] = [
        new Date(this.startTime).getTime(),
        new Date(this.endTime).getTime(),
      ];
      const today = new Date().getTime();
      return today > startTime && today < endTime;
    },
  },
};
</script>
