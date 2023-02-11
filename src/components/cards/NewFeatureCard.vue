<template>
  <timed-card startTime="Feburary 13, 2023" endTime="Feburary 18, 2023">
    <div class="container">
      <div class="message">
        <br>
          🔔 No bells this week? No problem! Click the volume icon in the top right to enable the new Virtual Bell 
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
