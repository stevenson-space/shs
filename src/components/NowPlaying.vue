<template>
  <div class="main">
    <img class="album-art" src="https://c.neevacdn.net/image/fetch/s--hZWQ4USi--/https%3A//f4.bcbits.com/img/a4171388314_10.jpg?savepath=a4171388314_10.jpg" />
    <div class="song-info">
      <p class="song-title">My Song</p>
      <p class="song-bullet">&bull;</p>
      <p class="song-artist">Andrew Wolf, 2025</p>
    </div>
    <div class="controls">
      <button class="control-button">
        <font-awesome-icon :icon="icons.faStepBackward" />
      </button>
      <button @click="playing ? play() : pause(); playing = !playing" class="control-button play-button">
        <font-awesome-icon :icon="playing ? icons.faPlay : icons.faPause" />
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
  data() {
    return {
      icons: {
        faStepBackward, faStepForward, faPlay, faPause,
      },
      playing: true,
      percentFinished: 0,
      currentTimePlaying: 0,
      totalSongTime: 0,
      currentSong: null,
    };
  },
  mounted() {
    this.currentSong = new Howl({
      src: ['https://ia803105.us.archive.org/14/items/rickrolld_201911/RickRoll%27D.mp3'],
      format: ['mp3'],
      volume: 1,
      onplay: () => {
        this.currentSong.fade(0, 1, 500);
      },
      onpause: () => {
        this.currentSong.fade(1, 0, 500);
      },
    });
    setInterval(() => this.updateProgressBar(), 100);
  },
  methods: {
    play() {
      this.currentSong.play();
      this.currentSong.fade(0, 1, 75);
    },
    async pause() {
      this.currentSong.fade(1, 0, 200);
      await this.sleep(200);
      this.currentSong.pause();
    },
    updateProgressBar() {
      this.percentFinished = (this.currentSong.seek() / this.currentSong.duration()) * 100;
      this.currentTimePlaying = this.currentSong.seek();
      this.totalSongTime = this.currentSong.duration();
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
      margin-top: 10px
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
