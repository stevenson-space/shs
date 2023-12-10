<template>
  <timed-card startTime="December 10, 2023" endTime="December 16, 2023">
    <div class="container">
      <div class="title">Jukebox 2024 🎸</div>
      <div class="message">
        We're looking for new submissions to join <a href="/jukebox">Jukebox</a> in 2024!
        <a href="https://forms.gle/mGvTXzRoWhBU4zfp6" target="_blank">Submit your song now</a> to be featured 🎵
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
