<template>
  <div>
    <div v-for="announcement in announcements" class="announcements" :key="announcement.text">
      <div
        class="announcement"
        :class="{ 'full-screen': fullScreenMode }"
        v-if="!(!announcement.showInFullScreen && fullScreenMode)"
      >
        <div class="container">
          <div class="center" v-html="announcement.text"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // Example: [{ text: String, showInFullScreen: Boolean }]
      announcements: [],
    };
  },
  props: {
    fullScreenMode: { type: Boolean, default: false },
  },
};
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.announcements:nth-child(odd)
  background-color: var(--secondaryBackground)
  color: var(--primary)
.announcements:nth-child(even)
  background-color: var(--background)
  color: var(--secondary)

.announcement
  padding: 5px
  width: calc(100% - 10px) // subtract 2 * 5px (padding)

  letter-spacing: 1px

  &.full-screen
    font-size: 2.75vh

  .container
    display: flex
    align-items: center
    max-width: $content-width
    margin: auto

  .schedule-select
    &.hidden
      visibility: hidden
    +mobile-small
      display: none

  .center
    flex-grow: 1
    font-size: .9em
</style>
