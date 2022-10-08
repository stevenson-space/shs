<template>
    <div class="live">
      <div class="background-block" />

      <div class="main">
        <home-link class="home-link" :invert="false" />
        <div class="inner-background">
          <h1 class="title"><font-awesome-icon class="icon" :icon="icons.faRadio" /> Meet Jukebox</h1>
          <p class="subtitle">Discover original music from Stevenson students.</p>
          <NowPlaying :song="currentSong" />
          <div class="song-list" v-for="(song, index) in songs" :key="index">
            <button @click="setSongOf(index)" class="play-button">
              <font-awesome-icon :icon="icons.faPlay" />
            </button>
            <p class="song-title">{{song.name}}</p>
            <p class="song-bullet">&bull;</p>
            <p class="song-artist">{{song.artist}}, {{song.year}}</p>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import HomeLink from '@/components/HomeLink.vue';
import NowPlaying from '@/components/NowPlaying.vue';
import songs from '@/data/music.json';
import {
  faRadio,
  faPlay,
} from '@fortawesome/free-solid-svg-icons';

export default {
  components: { HomeLink, NowPlaying },
  data() {
    return {
      icons: {
        faRadio, faPlay,
      },
      currentSong: songs[0],
      songs,
    };
  },
  mounted() {
    console.log(this.songs[0]);
  },
  methods: {
    setSongOf(index) {
      this.currentSong = this.songs[index];
    },
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
      margin: 10px 0 0 15px

    .home-link
      position: absolute
      right: 0
      top: 30px
      +mobile
        top: 20px

    .song-list
      display: flex
      justify-content: center
      .play-button
        border: 0
        background-color: transparent
        margin: 0
        transition: 0.15s
        font-size: 1em
        margin: 3px 5px 0 0
        color: var(--headerBackgroundColor)
        &:hover
          font-size: 1.2em
          cursor: pointer
      .song-title
        font-size: 1em
        font-weight: bold
      .song-bullet
        font-weight: bold
        font-size: 1em
        margin: auto 5px auto 5px
        color: var(--secondary)
      .song-artist
        font-size: 1em
        font-weight: bold
        color: var(--secondary)
</style>
