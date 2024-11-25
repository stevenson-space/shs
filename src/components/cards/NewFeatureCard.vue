<template>
  <timed-card startTime="November 22, 2024" endTime="November 26, 2024">
    <div class="container">
      <div class="title"></div>
      <div class="message">
        <a class="link" href="/snowball" target="_blank">LAST CHANCE: ❄️ Registration for this year's Operation Snowball closes TODAY!</a> Don't miss out on a weekend of fun activities, team building, bonding with friends, and endless hot chocolate from December 5th-7th at Camp Timberlee in East Troy, Wisconsin! 
      </div>
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
a
  color: var(--color)

.title
  margin-top: 20px
.container
  display: flex
  align-items: center
  text-decoration: none
  justify-content: center
  flex-direction: column
  color: var(--primary)
  .link
    color: var(--color)
  .logo
    height: 165px
    margin: 12px 10px
    background: white
    border-radius: 100%
  .message
    padding-top: 5px
    font-size: .85em
    text-align: left
    padding-bottom: 20px
    margin: 0 20px
    line-height: 1.6em
    text-align: center
</style>
