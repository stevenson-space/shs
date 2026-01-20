<template>
  <timed-card startTime="January 11, 2026" endTime="January 19, 2026">
    <div class="container">
      <div class="title"></div>
      <div class="message">
        We have many new features planned for SHS Space, and your feedback would be very, very helpful!
        <i>(and, if you have ideas of your own, tell me that too!)</i><br/>
        <br/>
        Two responders will be randomly chosen for a $15 Jazzman's gift card!<br/>
        <br/>
        - Joshua F. ('26)
      </div>
      <div class="chips">
        <link-chip
          href="https://forms.gle/jxZkFJALWoa1zaKY8"
          label="Take Survey"
          :icon="icons.faPoll"
          background="var(--accent)"
          color="var(--iconCardsRegular)"
          target="_blank"
          rel="noopener noreferrer"
        />
      </div>
    </div>
  </timed-card>
</template>

<script>
import TimedCard from "@/components/cards/TimedCard.vue";
import LinkChip from "@/components/cards/LinkChip.vue";
import { faPoll } from "@fortawesome/free-solid-svg-icons";

export default {
  components: { TimedCard, LinkChip },
  data() {
    return {
      icons: {
        faPoll
      }
    };
  }
};
</script>

<style lang="sass" scoped>
a
  color: var(--accent)

.container
  display: flex
  align-items: center
  text-decoration: none
  justify-content: center
  flex-direction: column
  color: var(--primary)
  padding: 20px
  .link
    color: var(--accent)
  .message
    font-size: .85em
    padding-bottom: 10px
    margin: 0 20px
    line-height: 1.6em
    text-align: center
.chips
  display: flex
  gap: 10px
  flex-wrap: wrap
  justify-content: center
  margin-bottom: 10px

</style>
