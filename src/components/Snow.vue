<template>
<div>
  <SnowLogic
    :show="show"
    v-bind="{
      windPower: 0,
      speed: 1,
      count: 12,
      size: 10,
      opacity: 1,
      images: ['static/snowflake.png']
    }"
  ></SnowLogic>
  </div>
</template>

<script>
import SnowLogic from '@/components/SnowLogic.vue';

export default {
  data() {
    return {
      show: false,
    };
  },
  components: {
    SnowLogic,
  },
  mounted() {
    this.show = true;
  },
};
</script>
