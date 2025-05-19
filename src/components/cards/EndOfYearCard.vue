<template>
  <timed-card startTime="May 19, 2025" endTime="May 24, 2025">
    <div class="container">
      <div>
        Thank you to everyone who used Stevenson.Space this year! A special thanks to Joshua Fernandes
        ('26), Krithika Bayyapu ('27), and Max Sun ('27) for so much great dev work keeping the site operational. Have an amazing summer!
      </div>
      <div style="margin-top: 10px">- Andrew Wolf ('25)</div>
    </div>
  </timed-card>
</template>

<script>
import TimedCard from "@/components/cards/TimedCard.vue";

export default {
  components: { TimedCard },
};
</script>

<style lang="sass" scoped>
.container
  display: flex
  align-items: center
  text-align: center
  text-decoration: none
  justify-content: center
  flex-direction: column
  color: var(--primary)
  padding: 10px
  font-size: 14px
</style>
