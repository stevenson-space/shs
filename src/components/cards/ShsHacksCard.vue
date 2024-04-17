<template>
  <timed-card startTime="April 16, 2024" endTime="April 20, 2024">
    <div class="top-padding">
      <a class="main-link" href="https://windycityhacks.com?ref=stevenson.space" target="_blank">
        <img class="logo" src="@/assets/occasions/windy-city-hacks.png">
        <div class="register" onclick="fathom.trackEvent('WCH Click')">
          Build <i><b>something amazing</b></i> at Windy City Hacks, Chicagoland's free 24-hour coding competition <span class="bold">June 22nd-23rd!</span> <br><span class="color">Register Now!</span>&nbsp;
          <font-awesome-icon :icon="faArrowUpRightFromSquare" class="link-icon" />
        </div>
      </a>
    </div>
  </timed-card>
</template>

<script>
import TimedCard from '@/components/cards/TimedCard.vue';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

export default {
  components: { TimedCard },
  data() {
    return {
      faArrowUpRightFromSquare,
    };
  },
};
</script>

<style lang="sass" scoped>
.main-link
  display: flex
  align-items: center
  text-decoration: none
  justify-content: center
  flex-direction: column
  color: var(--primary)
  .logo
    height: 150px
    margin: 10px
    background: white
    border-radius: 15px
  .register
    font-size: .85em
    text-align: left
    padding-bottom: 10px
    margin: 0 20px
    line-height: 1.6em
    text-align: center
    .color
      color: var(--color)
      font-weight: bold
    .bold
      font-weight: bold
    .link-icon
      font-size: 1.1em
      color: var(--color)
.top-padding
  padding-top: .5em    
</style>
