<template>
  <timed-card startTime="February 20, 2024" endTime="March 2, 2024">
    <div class="top-padding">
      <a class="main-link" href="https://docs.google.com/forms/d/e/1FAIpQLSeKScB0_C3Esobhakie0zaI9jqeejckgXy4xoCjE-DywjgJbw/viewform?usp=sf_link" target="_blank">
        <img class="logo" src="@/assets/occasions/shsHacks.png">
        <div class="register">
          Stevenson's free-to-attend hackathon is happening <span class="bold">Saturday March 2nd!</span> <br><span class="color">Register Now!</span>&nbsp;
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
