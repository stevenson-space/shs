<template>
  <timed-card startTime="Feburary 15, 2023" endTime="Feburary 20, 2023">
    <div class="container">
      <div class="message">
        <br>
          📻 Jukebox is now live, <a href="/jukebox">visit now to discover original music by Stevenson students!</a>
        <br>
      </div>
    </div>
  </timed-card>
</template>

<script>
import TimedCard from '@/components/cards/TimedCard.vue';

export default {
  components: { TimedCard },
};
</script>

<style lang="sass" scoped>
a
  color: var(--color)
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
    font-size: .85em
    text-align: left
    padding-bottom: 20px
    margin: 0 20px
    line-height: 1.6em
    text-align: center

</style>
