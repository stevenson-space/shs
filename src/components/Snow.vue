<template>
<div>
  <SnowLogic
    :show="show"
    v-bind="{
      windPower: 0,
      speed: 1,
      count: 16,
      size: 6,
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
