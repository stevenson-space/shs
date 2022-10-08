<template>
  <div class="main">
    <img class="album-art" v-if="song.album != 'NO_ART'" :src="require(`@/assets/music/album/${song.album}`)" />
    <div class="song-info">
      <p class="song-title">{{song.name}}</p>
      <p class="song-bullet">&bull;</p>
      <p class="song-artist">{{song.artist}}, {{song.year}}</p>
    </div>
    <div class="controls">
      <button class="control-button">
        <font-awesome-icon :icon="icons.faStepBackward" />
      </button>
      <button @click="playing ? pause() : play(); playing = !playing" class="control-button play-button">
        <font-awesome-icon :icon="playing ? icons.faPause : icons.faPlay" />
      </button>
      <button class="control-button">
        <font-awesome-icon :icon="icons.faStepForward" />
      </button>
    </div>
    <div class="progress">
      <p class="progress-text">{{formatTime(currentTimePlaying)}}</p>
      <div class="progress-bar">
        <div class="progress-bar-fill" :style="`width: ${percentFinished}%;`" />
      </div>
      <p class="progress-text">{{formatTime(totalSongTime)}}</p>
    </div>
  </div>
</template>

<script>
import { faStepBackward, faStepForward, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { Howl, Howler } from 'howler';

export default {
  props: {
    song: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      icons: {
        faStepBackward, faStepForward, faPlay, faPause,
      },
      playing: false,
      percentFinished: 0,
      currentTimePlaying: 0,
      totalSongTime: 0,
      currentSong: null,
      songId: 0,
    };
  },
  watch: {
    song(newSong, oldSong) {
      console.log('asdf');
      this.currentSong.unload();
      this.playing = false;
      this.percentFinished = 0;
      this.currentTimePlaying = 0;
      this.totalSongTime = 0;
      this.currentSong = new Howl({
        src: [`/music/${newSong.file}`],
        format: ['mp3'],
        volume: 1,
      });
    },
  },
  mounted() {
    this.currentSong = new Howl({
      src: [`/music/${this.song.file}`],
      format: ['mp3'],
      volume: 1,
    });
  },
  methods: {
    play() {
      if (this.songId === 0) {
        this.songId = this.currentSong.play();
        setInterval(() => this.updateProgressBar(), 100);
      } else this.currentSong.play(this.songId);
      this.currentSong.fade(0, 1, 75);
    },
    async pause() {
      this.currentSong.fade(1, 0, 200, this.songId);
      await this.sleep(200);
      this.currentSong.pause();
    },
    updateProgressBar() {
      this.percentFinished = (this.currentSong.seek() / this.currentSong.duration()) * 100;
      this.currentTimePlaying = this.currentSong.seek(this.songId);
      this.totalSongTime = this.currentSong.duration(this.songId);
    },
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const secondsLeft = (seconds - (minutes * 60)).toFixed(0); // ensure seconds is a whole number (0 decimal places)
      return `${minutes}:${seconds < 10 ? `0${secondsLeft}` : secondsLeft}`;
    },
    sleep(ms) {
      // eslint-disable-next-line no-promise-executor-return
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
  },
};
</script>

<style lang="sass" scoped>
  .main

    .progress
      display: flex
      .progress-text
        font-size: 0.8em
        font-weight: bold
        color: var(--textColor)
      .progress-bar
        width: 80%
        display: flex
        margin: 15px auto auto auto
        positon: absolute
        text-align: center
        background-color: var(--tertiary)
        border-radius: 10px
      .progress-bar-fill
        height: 15px
        width: 20%
        background-color: var(--headerBackgroundColor)
        transition: width 0.5s ease-in-out
        border-radius: 10px

    .album-art
      display: block
      margin-top: 0px
      width: 300px
      height: 300px
      object-fit: cover
      margin-left: auto
      margin-right: auto
      border-radius: 10px

    .song-info
      display: flex
      justify-content: center

      .song-title
        font-size: 1.5em
        font-weight: bold
      .song-bullet
        font-weight: bold
        font-size: 1.55em
        margin: auto 10px auto 10px
        color: var(--secondary)
      .song-artist
        font-size: 1.5em
        font-weight: bold
        color: var(--secondary)

    .controls
      display: flex
      justify-content: center

      .control-button
        background-color: transparent
        border: none
        margin: 0 10px 0 10px
        font-size: 2em
        color: var(--secondary)
        &:hover
          color: var(--headerBackgroundColor)
          cursor: pointer
      .play-button
        background-color: var(--headerBackgroundColor)
        border-radius: 50%
        padding: 10px 20px 9px 21px
        margin: 0
        transition: 0.15s
        font-size: 2.5em
        color: white
        &:hover
          color: white
          font-size: 2.6em
          cursor: pointer
          box-shadow: 0 0 10px 0 var(--tertiary)

</style>
