<template>
  <card class="timer-card" :shadow="false" :border="true" :class="{ fullscreen: isFullscreen }">
    <div ref="fullscreen-wrapper" class="fullscreen-wrapper">
      <div class="header">
        <div v-hammer:tap="() => shouldMakeSound = !shouldMakeSound" class="icon-button sound">
          <font-awesome-icon class="icon" :icon="icons.faVolumeUp" fixed-width />
          <div class="slash" :class="{ hide: shouldMakeSound }" />
        </div>

        <div class="title">Timer</div>

        <div v-hammer:tap="isFullscreen ? exitFullscreen : makeFullscreen" class="icon-button">
          <font-awesome-icon class="icon" :icon="isFullscreen ? icons.faCompress : icons.faExpand" fixed-width />
        </div>
      </div>

      <div class="container">
        <div class="time-selector">
          <scroll-selector ref="scroll-selector-1" v-model="time.hours" :options="hours" :font-size="fontSize" />
          <span class="letter">h</span>
          <span class="colon">:</span>
          <scroll-selector ref="scroll-selector-2" v-model="time.minutes" :options="minutes" :font-size="fontSize" />
          <span class="letter">m</span>
          <span class="colon">:</span>
          <scroll-selector ref="scroll-selector-3" v-model="time.seconds" :options="minutes" :font-size="fontSize" />
          <span class="letter">s</span>
        </div>

        <div class="info-text">
          <font-awesome-icon :icon="icons.faInfoCircle" />
          &nbsp;Scroll to select time
        </div>

        <div class="add-time-buttons" :class="{ disabled: !!timer }">
          <div class="button" @click="addTime(60)">+1<span class="small">m</span></div>
          <div class="button" @click="addTime(5 * 60)">+5<span class="small">m</span></div>
          <div class="button" @click="addTime(10 * 60)">+10<span class="small">m</span></div>
        </div>

        <checkbox
          v-if="browserSupportsNotifications"
          :value="shouldNotify"
          label-size="1em"
          @input="notifyCheckboxInput($event)"
        >
          <span>Notify Me &nbsp;</span>

          <what-is-this>
            Notifies you when the timer finishes even if you're on a different tab/app (requires permission)
          </what-is-this>
        </checkbox>

        <div class="control-buttons">
          <rounded-button class="button" text="Reset" :circular="false" @click="reset" />
          <rounded-button
            v-hammer:tap="startStopButton.action"
            class="button"
            v-bind="startStopButton"
            :circular="false"
          />
        </div>
      </div>
    </div>

    <div ref="filler" class="filler" /> <!-- fills space when the rest of the content is in full screen mode -->

    <confirm-popup :show="showTimerDonePopup" cancel-text="" @ok="timerDoneOk">
      <div class="timer-done-text">Timer Done!</div>
      <!-- TODO Display negative stopwatch counting time since timer ended-->
    </confirm-popup>

    <confirm-popup :show="showAllowNotificationsPopup" cancel-text="" @ok="showAllowNotificationsPopup = false">
      <div class="allow-notifications-text">Please allow notifications to enable this option</div>
    </confirm-popup>
  </card>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faInfoCircle, faExpand, faCompress, faVolumeUp, faSlash } from '@fortawesome/free-solid-svg-icons';
import anime from 'animejs';

import Card from 'common/Card.vue';
import ScrollSelector from 'common/ScrollSelector.vue';
import RoundedButton from 'common/RoundedButton.vue';
import Checkbox from 'common/Checkbox.vue';
import ConfirmPopup from 'common/ConfirmPopup.vue';
import WhatIsThis from 'common/WhatIsThis.vue';

export default {
  components: {
    Card,
    ScrollSelector,
    RoundedButton,
    FontAwesomeIcon,
    Checkbox,
    ConfirmPopup,
    WhatIsThis,
  },
  data() {
    return {
      hours: Array(24).fill(0).map((_, i) => i).map(val => (val < 10 ? '0' : '') + val), // generates ['00', '01', '02', ..., '23']
      minutes: Array(60).fill(0).map((_, i) => i).map(val => (val < 10 ? '0' : '') + val), // generates ['00', '01', '02', ..., '59']
      seconds: Array(60).fill(0).map((_, i) => i).map(val => (val < 10 ? '0' : '') + val), // same as minutes
      time: {
        hours: '00',
        minutes: '05',
        seconds: '00',
      },
      initialTimeSeconds: 5 * 60, // this should be initialized to the seconds version of the time object above
      timer: null, // will be set to the result of setTimeout when start is clicked
      endTime: 0, // will be set to the real epoch time of when the timer should end
      icons: {
        faInfoCircle,
        faExpand,
        faCompress,
        faVolumeUp,
        faSlash,
      },
      shouldNotify: false,
      browserSupportsNotifications: 'Notification' in window,
      showTimerDonePopup: false,
      shouldMakeSound: false,
      audio: null,
      isFullscreen: false,
      fullscreenAnimation: null,
      serviceWorkerListener: null,
      showAllowNotificationsPopup: false,
    };
  },
  computed: {
    startStopButton() {
      return {
        text: this.timer ? 'Stop' : 'Start',
        action: this.timer ? this.stop : this.start,
        invert: !!this.timer,
      };
    },
    fontSize() {
      if (this.isFullscreen) {
        return (window.innerWidth >= 786 ? '5em' : '3em');
      }
      return '1.75em';
    },
  },
  watch: {
    shouldMakeSound() {
      if (this.shouldMakeSound && !this.audio) {
        // initially playing some blank audio while tab is in focus allows audio to be played later even when tab is in background
        const blankAudio = new Audio('static/blank.mp3');
        blankAudio.play();

        this.audio = new Audio('static/timer.mp3');
      }
    },
  },
  created() {
    if (navigator.serviceWorker) {
      this.serviceWorkerListener = (event) => {
        if (event.data === 'stop-timer-done-audio' && this.audio) this.audio.pause();
      };
      navigator.serviceWorker.addEventListener('message', this.serviceWorkerListener);
    }
  },
  beforeDestroy() {
    if (this.serviceWorkerListener) {
      navigator.serviceWorker.removeEventListener('message', this.serviceWorkerListener);
    }
  },
  methods: {
    timeToSeconds({ hours, minutes, seconds }) {
      return Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds);
    },
    normalizeTime(time) { // convert time object with numbers to strings with the extra '0' if num < 10
      const normalizedTime = {};
      Object.keys(time).forEach((key) => {
        normalizedTime[key] = (time[key] < 10 ? '0' : '') + time[key];
      });
      return normalizedTime;
    },
    secondsToTime(seconds, normalize = true) {
      const s = Math.max(seconds, 0); // in case seconds is negative for some reason
      const time = {};
      time.hours = Math.floor(s / (60 * 60));
      time.minutes = Math.floor((s - time.hours * 60 * 60) / 60);
      time.seconds = seconds - time.hours * 60 * 60 - time.minutes * 60;
      return normalize ? this.normalizeTime(time) : time;
    },
    start() {
      this.initialTimeSeconds = this.timeToSeconds(this.time);
      this.endTime = Date.now() + this.initialTimeSeconds * 1000;
      this.countdown();
    },
    countdown() {
      const secondsLeft = Math.round((this.endTime - Date.now()) / 1000);
      this.time = this.secondsToTime(secondsLeft);
      if (secondsLeft > 0) {
        this.timer = setTimeout(this.countdown, 1000);
      } else { // Timer Done
        this.stop();
        this.showTimerDonePopup = true;

        if (this.shouldNotify && Notification.permission === 'granted' && navigator.serviceWorker) {
          // using service workers instead of normal notifications because android requires it (and desktop still supports it too)
          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification('Timer Done!', {
              tag: 'timer',
              icon: 'favicon/favicon-196x196.png',
              renotify: true,
            });
          });
        }

        if (this.shouldMakeSound && this.audio) {
          this.audio.currentTime = 0;
          this.audio.play();
        }
      }
    },
    stop() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    },
    reset() {
      this.stop();
      this.time = this.secondsToTime(this.initialTimeSeconds);
    },
    addTime(secondsToAdd) {
      if (!this.timer) { // typically only want to add time if the timer is not currently running
        // don't let the time go over 23:59:59 because that's the maximum time that can be displayed
        const seconds = Math.min(this.timeToSeconds(this.time) + secondsToAdd, (23 * 60 * 60) + (59 * 60) + 59);
        this.time = this.secondsToTime(seconds);
      }
    },
    timerDoneOk() {
      this.showTimerDonePopup = false;
      if (this.audio) {
        this.audio.pause();
      }
    },
    makeFullscreen() {
      if (!this.isFullscreen) {
        const $fullscreenWrapper = this.$refs['fullscreen-wrapper'];

        // Purpose of filler is to maintain the card's height while the contents are in fullscreen
        // (position: fixed items don't take up space in container)
        // this prevents the card from unnaturally resizing when exiting full screen
        this.$refs.filler.style.height = `${$fullscreenWrapper.offsetHeight}px`;

        $fullscreenWrapper.style.position = 'fixed';
        this.fullscreenAnimation = anime({
          targets: $fullscreenWrapper,
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          easing: 'cubicBezier(0.25, 0.1, 0.25, 1.0)',
          duration: 300,
        });

        // sometimes the time scroll selectors change value when switching to/from fullscreen,
        // so we reset the time to it's prior value
        const { seconds, minutes, hours } = this.time; // need to do this so we get actual values instead of reference
        this.fullscreenAnimation.finished.then(() => {
          this.time = { seconds, minutes, hours };
          this.scrollAllScrollSelectors(); // ios doesn't automatically scroll for some reason
        });

        this.isFullscreen = true;
      }
    },
    exitFullscreen() {
      if (this.isFullscreen && this.fullscreenAnimation) {
        this.fullscreenAnimation.reverse();
        this.fullscreenAnimation.play();

        const { seconds, minutes, hours } = this.time; // need to do this so we get actual values instead of reference

        this.fullscreenAnimation.finished.then(() => {
          anime.remove(this.$refs['fullscreen-wrapper']);
          this.$refs.filler.style.height = 0;
          this.$refs['fullscreen-wrapper'].removeAttribute('style'); // remove all changes made to this element by javascript
          this.fullscreenAnimation = null;

          // sometimes the time scroll selectors change value when switching to/from fullscreen,
          // so we reset the time to it's prior value
          this.time = { seconds, minutes, hours };
          this.scrollAllScrollSelectors(); // ios doesn't automatically scroll for some reason
        });

        this.isFullscreen = false;
      }
    },
    notifyCheckboxInput(shouldNotify) {
      if (shouldNotify && Notification.permission !== 'granted') {
        if (Notification.permission === 'denied') this.showAllowNotificationsPopup = true;
        else {
          Notification.requestPermission().then(() => {
            this.shouldNotify = Notification.permission === 'granted';
          });
        }
      } else {
        this.shouldNotify = shouldNotify;
      }
    },
    scrollAllScrollSelectors() { // this forcibly scrolls all the scroll selectors to the selected value
      for (let i = 1; i <= 3; i++) {
        this.$refs[`scroll-selector-${i}`].scrollToSelected();
      }
    },
  },
};
</script>

<style lang="sass" scoped>
@import "src/styles/style.sass"

.timer-card
  .fullscreen-wrapper
    background-color: var(--background)

  .header
    display: flex
    background-color: var(--color)
    padding: 3px 20px
    color: var(--background)
    font-size: 1.25em
    align-items: center
    user-select: none

    .title
      flex: 1
      text-align: center
      font-weight: bold
      font-size: 1.1em

    .icon-button
      cursor: pointer
      position: relative
      padding: 7px 10px
      +hover-darken-background

      &.sound
        .slash
          position: absolute
          top: 0
          background-color: var(--background)
          height: 3px
          width: 30px
          border-radius: 10px
          transition: transform .2s ease
          transform: rotate(45deg) translate(12px, 16px) scale(1)
          &.hide
            transform: rotate(45deg) translate(12px, 16px) scale(0)

  .container
    padding: 15px
    outline: none

  .time-selector
    display: flex
    align-items: center
    justify-content: center

    .letter
      margin-top: 6px

    .colon
      font-size: 1.75em
      margin: 0 5px 0 10px

  .info-text
    text-align: center
    font-size: .75em
    margin: 5px 0
    color: var(--secondary)

  .add-time-buttons
    display: flex
    justify-content: center
    font-weight: bold
    font-size: 1.25em
    color: var(--color)
    margin-top: 10px
    border: thin solid var(--color)
    border-radius: 10px
    user-select: none
    &.disabled
      color: gray
      border-color: #999

    .button
      padding: 2px 10px
      margin: 0 5px
      cursor: pointer

      .small
        font-size: .75em

  .control-buttons
    display: flex
    justify-content: space-evenly
    margin-top: 25px

    .button
      margin: 0 10px

  .timer-done-text
    margin: 25px 50px
    font-size: 2.5em
    font-weight: bold
    color: #444
    +mobile-small
      font-size: 2em

  .allow-notifications-text
    margin: 20px 30px
    font-size: 1.1em

  &.fullscreen
    .header
      padding: 10px 20px
      font-size: 1.5em

      .icon-button.sound .slash
        height: 3.6px
        width: 36px
        transform: rotate(45deg) translate(12px, 17px) scale(1)
        &.hide
          transform: rotate(45deg) translate(12px, 17px) scale(0)

    .time-selector
      .letter
        margin-top: 40px
        font-size: 1.5em
        +mobile
          font-size: 1.25em
          margin-top: 20px
      .colon
        font-size: 5em
        +mobile
          font-size: 3em

    .info-text
      // display: none
      margin: 15px 0

    .add-time-buttons
      font-size: 2em
      margin-top: 20px
      +mobile
        font-size: 1.7em
        margin-top: 10px
      .button
        padding: 3px 10px
        margin: 0 20px
        +mobile
          margin: 0 10px

    .control-buttons
      font-size: 1.25em
      margin-top: 30px
      +mobile
        margin-top: 25px

</style>
