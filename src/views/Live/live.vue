<template>
    <div class="live">
      <div class="background-block" />

      <div class="main">
        <home-link class="home-link" :invert="false" />
        <div class="inner-background">
          <h1 class="title"><font-awesome-icon class="icon" :icon="faRadio" /> Meet Live</h1>
          <p class="subtitle">Discover original music from Stevenson students.</p>
          <NowPlaying />
        </div>
      </div>
  </div>
</template>

<script>
import HomeLink from '@/components/HomeLink.vue';
import NowPlaying from '@/components/NowPlaying.vue';
import {
  faRadio,
} from '@fortawesome/free-solid-svg-icons';

export default {
  components: { HomeLink, NowPlaying },
  data() {
    return {
      faRadio,
    };
  },
};
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.live
  .background-block
    background-color: var(--headerBackgroundColor)
    height: 250px
    width: 100%
    left: 0
    position: absolute

  .main
    width: 80%
    max-width: $content-width + 80px // hardcoded value :( to make standard schedule periods all fit in one line (on my display)
    margin: auto
    position: relative
    +mobile
      width: 90%

    .inner-background
      +shadow
      background-color: var(--background)
      position: relative
      border-radius: 20px
      top: 100px
      overflow: hidden
      margin-bottom: 25px
      +mobile
        top: 75px

    .title
      text-align: left
      font-size: 2.5em
      margin: 15px 0 0 15px

    .icon
      color: var(--headerBackgroundColor)

    .subtitle
      text-align: left
      font-size: 1.5em
      margin: 10px 0 35px 15px

    .home-link
      position: absolute
      right: 0
      top: 30px
      +mobile
        top: 20px
</style>
