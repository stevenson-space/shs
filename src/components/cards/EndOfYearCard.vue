<template>
  <timed-card startTime="May 25, 2023" endTime="May 29, 2023">
    <div class="container">
      <div>
        Thank you to everyone who used Stevenson.Space this year! A special thanks to Andrew Wolf
        ('25) for so much great dev work keeping the site operational. Please have a happy and safe
        summer as best possible. Thank you.
      </div>
      <div style="margin-top: 5px">- Joseph Shepin ('22)</div>
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
  padding: 5px
  font-size: 15px
</style>
