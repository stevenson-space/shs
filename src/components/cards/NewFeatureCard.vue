<template>
  <timed-card startTime="November 7, 2024" endTime="November 9, 2024">
    <div class="container">
      <div class="title"></div>
      <div class="message">
        Go check out the <a href="https://shsgiveathon.com/" target="_blank"> GiveAThon Leaderboard</a>, a website by NHS. It's a great way to see how much money all of us have raised so far, and to compete with your friends for 1st place 🥇
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
