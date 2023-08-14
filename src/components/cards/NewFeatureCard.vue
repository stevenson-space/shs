<template>
  <timed-card startTime="August 13, 2023" endTime="August 17, 2023">
    <div class="container">
      <div class="title">Welcome Back 🎉</div>
      <div class="message">
        Go check out <a href="https://www.shsmaps.com/" target="_blank">SHSMaps</a>, a new website
        by Stevenson students. Import your schedule to view your routes from class to class offline,
        and easily share your rooms and paths for club advertisements. Your members will thank you!

        <br />
        <br />
        Also, you can now view the PWC schedule by enabling it in settings.
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
