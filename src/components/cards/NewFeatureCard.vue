<template>
  <timed-card startTime="October 15, 2025" endTime="October 18, 2025">
    <div class="container">
      <div class="title">Senior Yearbook Photos!</div>
      <div class="message">
        Seniors, if you haven't had your yearbook photo taken yet, make sure to dress up for retakes <strong>Thursday, Oct 16th or Friday, Oct 17th</strong>.
        Stop by the <strong>Recital Hall (in the Glass Commons) 10am-3:30pm</strong> to have your picture taken!
        You won't be featured in the yearbook if you don't have your photo taken by V.I.P.!
        <br/>
        <u>Set a reminder to come dressed for photos!</u>
      </div>
    </div>
  </timed-card>
</template>

<script>
import TimedCard from "@/components/cards/TimedCard.vue";
import LinkChip from "@/components/cards/LinkChip.vue";

export default {
  components: { TimedCard, LinkChip },
};
</script>

<style lang="sass" scoped>
a
  color: var(--color)

.title
  margin-top: 20px
  color: red
.container
  display: flex
  align-items: center
  text-decoration: none
  justify-content: center
  flex-direction: column
  color: var(--primary)
  // border to make it stand out!!
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
    // 4 px red border

</style>
