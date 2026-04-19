<template xmlns="http://www.w3.org/1999/html">
  <timed-card startTime="April 19, 2026" endTime="April 25, 2026">
    <div class="container">
      <div class="title"></div>
      <div class="message">
        Stevenson Space now works <strong>offline</strong>! You can now access the whole site even if you have no connection.
        <br/>
      </div>
      <div class="chips">
        <link-chip
          href="/install"
          label="Install App"
          :icon="faDownload"
          background="var(--accent)"
          color="var(--iconCardsRegular)"
          target="_blank"
          rel="noopener noreferrer"
        />
      </div>
    </div>
  </timed-card>
</template>

<script setup lang="ts">
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import TimedCard from './TimedCard.vue';
import LinkChip from './LinkChip.vue';
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
