<template>
  <timed-card startTime="May 18, 2022" endTime="May 24, 2022">
    <div class="container">
      <img class="logo" src="static/occasions/GirlconLogo.png">
      <div class="message">
        Girlcon is a free conference aimed at empowering women in stem and it's happening this summer held @Expedia Chicago and virtually!
        <a href="https://GirlCon.org" class="link" target="_blank">Learn more</a>
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
    padding-bottom: 10px
    margin: 0 20px
    line-height: 1.6em
    text-align: center

</style>
