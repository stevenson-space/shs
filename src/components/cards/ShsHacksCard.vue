<template>
  <timed-card class="side-padding" startTime="May 19, 2024" endTime="May 24, 2025">
    <div class="top-padding ">
      <a class="main-link" href="https://scrapyardchicago.com" target="_blank">
        <img class="logo" src="@/assets/occasions/chicago-logo.png">
        <div class="register" onclick="">
          Build <i><b>something amazing</b></i> at Scrapyard Chicago, a free coding competition <span class="bold">March 15th-16th!</span><br><span class="color">Register Now!</span>&nbsp;
          <font-awesome-icon :icon="faArrowUpRightFromSquare" class="link-icon" />
        </div>
      </a>
    </div>
  </timed-card>
</template>

<script>
import TimedCard from '@/components/cards/TimedCard.vue';
import WhatIsThis from '@/components/WhatIsThis.vue';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

export default {
  components: { TimedCard, WhatIsThis },
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
    //background: white
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
.side-padding
  padding-left: 1em
  padding-right: 1em
</style>
