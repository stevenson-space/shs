<template>
  <timed-card startTime="May 8, 2025" endTime="May 26, 2025">
    <div class="container">
      <div class="title"></div>
      <div class="message">
        SHS's 2024-25 Music Production 2 classes engaged in an activist songwriting project centered around important topics to raise awareness for
        <a class="link" href="https://www.gkmcenglewood.com/" target="_blank">Good Kids Mad City</a>,
        <a class="link" href="https://nami-nwsc.org/" target="_blank">NAMI Northwest Suburbs Chicago</a>, and
        <a class="link" href="https://buffalogrovepride.com/" target="_blank">The Pinta Pride Project</a>!

        <div class= "chips">
          <LinkChip
            href="https://youtube.com/playlist?list=PLap5ZkjM9rSEGwfnayinyap-wGVZNdN8g&si=jkeY3i9zYnPJueEx"
            label="Listen Now!"
            background="#fbe9e7"
          />
          <LinkChip
            href="https://omella.com/9zh2h"
            label="Donate Here"
            background="#dcffdb"
          />
        </div>
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
.chips
  display: flex
  gap: 10px
  flex-wrap: wrap
  justify-content: center
  margin-top: 8px

</style>
