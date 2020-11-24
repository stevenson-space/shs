<template>
  <card>
    <img class="logo" src="static/thanksgiving.jpg" />
    <div class="message">Have a happy Thanksgiving break! &nbsp;</div>
  </card>
</template>

<script>
import Card from "common/Card.vue";

export default {
  components: { Card, },
 
};
</script>

<style lang="sass" scoped>
.logo
    display: block
    margin-left: auto
    margin-right: auto
    height: 85px
    padding: 10px 5px

.message
    font-size: .85em
    text-align: center
    padding-bottom: 10px
    .color

</style>
