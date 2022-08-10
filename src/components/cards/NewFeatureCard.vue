<template>
  <timed-card startTime="July 5, 2022" endTime="August 12, 2022">
    <div class="container">
      <div class="message">
        <br>
        Welcome Back to Stevenson.Space! We've been hard at work upgrading to <a href="https://vuejs.org/" target="_blank">Vue 3.0</a> which is a massive undertaking. If you're curious, check out the <a href="https://github.com/stevenson-space/shs/pull/125/files" target="_blank">Pull Request</a>. Please report any issues you find <a target="_blank" href="https://github.com/stevenson-space/shs/issues">here</a> or by <a href="mailto:admin@stevenson.space">email</a>. Thank you!
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
    padding-bottom: 10px
    margin: 0 20px
    line-height: 1.6em
    text-align: center

</style>
