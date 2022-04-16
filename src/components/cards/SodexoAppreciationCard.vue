<template>
  <timed-card startTime="April 13, 2022" endTime="April 23, 2022">
    <div class="container">
      <img class="logo" src="static/occasions/sodexo-appreciation.png">
      <div class="message">
       Shoutout to the <b>131</b> Sodexo staff members that work tirelessly year-round to keep Stevenson in truly immaculate shape. Remember to give them the utmost appreciation and respect they deserve - not your mess.
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
.container
  display: flex
  align-items: center
  text-decoration: none
  justify-content: center
  flex-direction: column
  color: var(--primary)
  .logo
    height: 165px
    margin: 12px 10px
    background: white
    border-radius: 10px
  .message
    font-size: .85em
    text-align: left
    padding-bottom: 10px
    margin: 0 20px
    line-height: 1.6em
    text-align: center

</style>
