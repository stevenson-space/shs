<template>
  <timed-card startTime="December 14, 2025" endTime="January 9, 2026">
    <div class="container">
      <div class="title"></div>
      <div class="message">
        SHS Space has a new theme editor!
        Either choose a prebuilt theme or, if you're feeling creative, make your own and share it with your friends!
      </div>
      <div class="chips">
        <link-chip
          href="#"
          label="Edit Theme"
          :icon="icons.faDroplet"
          background="var(--accent)"
          color="var(--iconCardsRegular)"
          @click.native.prevent="$emit('open-theme-editor')"
        />
      </div>
    </div>
  </timed-card>
</template>

<script>
import TimedCard from "@/components/cards/TimedCard.vue";
import LinkChip from "@/components/cards/LinkChip.vue";
import { faDroplet } from "@fortawesome/free-solid-svg-icons";

export default {
  components: { TimedCard, LinkChip },
  data() {
    return {
      icons: {
        faDroplet
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
