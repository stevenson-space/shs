<template>
  <card class="timer-card" :shadow="false" :border="true">
    <div class="header">
      <div class="icon-button sound" v-hammer:tap="() => shouldMakeSound = !shouldMakeSound">
        <font-awesome-icon class="icon" :icon="icons.faVolumeUp" fixed-width/>
        <!-- <font-awesome-icon :class="{ hide: shouldMakeSound }" class="icon slash" :icon="icons.faSlash"/> -->
        <!-- <font-awesome-icon :class="{ hide: shouldMakeSound }" class="icon slash-2" :icon="icons.faSlash"/> -->
        <div class="line" :class="{ hide: shouldMakeSound }"/>
      </div>
      <div class="title">Timer</div>
      <div class="icon-button"><font-awesome-icon class="icon" :icon="icons.faExpand" fixed-width/></div>
    </div>

    <div class="container">
      <div class="time-selector">
        <scroll-selector :options="hours" v-model="time.hours" font-size="1.75em"/>
        <span class="letter">h</span>
        <span class="colon">:</span>
        <scroll-selector :options="minutes" v-model="time.minutes" font-size="1.75em"/>
        <span class="letter">m</span>
        <span class="colon">:</span>
        <scroll-selector :options="minutes" v-model="time.seconds" font-size="1.75em"/>
        <span class="letter">s</span>
      </div>

      <div class="info-text">
        <font-awesome-icon :icon="icons.faInfoCircle"/>
        &nbsp;Scroll to select time
      </div>

      <div class="add-time-buttons" :class="{ disabled: !!timer }">
        <div class="button" @click="addTime(60)">+1<span class="small">m</span></div>
        <div class="button" @click="addTime(5 * 60)">+5<span class="small">m</span></div>
        <div class="button" @click="addTime(10 * 60)">+10<span class="small">m</span></div>
      </div>

      <checkbox v-model="shouldNotify" label-size="1em" v-if="browserSupportsNotifications">Notify Me</checkbox>

      <div class="control-buttons">
        <rounded-button class="button" text="Reset" :circular="false" @click="reset"/>
        <rounded-button class="button" v-bind="startStopButton" :circular="false" v-hammer:tap="startStopButton.action"/>
      </div>
    </div>

    <confirm-popup :show="showTimerDonePopup" cancelText="" @ok="showTimerDonePopup = false">
      <div class="timer-done-text">Timer Done!</div>
    </confirm-popup>
  </card>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faInfoCircle, faExpand, faCompress, faVolumeUp, faSlash } from '@fortawesome/free-solid-svg-icons';

import Card from 'common/Card.vue';
import ScrollSelector from 'common/ScrollSelector.vue';
import RoundedButton from 'common/RoundedButton.vue';
import Checkbox from 'common/Checkbox.vue';
import ConfirmPopup from 'common/ConfirmPopup.vue';

export default {
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
      shouldMakeSound: false,
      browserSupportsNotifications: 'Notification' in window,
      showTimerDonePopup: false,
    }
  },
  computed: {
    startStopButton() {
      return {
        text: this.timer ? 'Stop' : 'Start',
        action: this.timer ? this.stop : this.start,
        invert: !!this.timer,
      }
    }
  },
  methods: {
    timeToSeconds({hours, minutes, seconds}) {
      return Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds);
    },
    normalizeTime(time) { //convert time object with numbers to strings with the extra '0' if num < 10
      Object.keys(time).forEach(key => {
        time[key] = (time[key] < 10 ? '0' : '') + time[key];
      });
      return time;
    },
    secondsToTime(seconds, normalize = true) {
      seconds = Math.max(seconds, 0); // in case seconds is negative for some reason
      const time = {};
      time.hours = Math.floor(seconds / (60 * 60));
      time.minutes = Math.floor((seconds - time.hours * 60 * 60) / 60);
      time.seconds = seconds - time.hours * 60 * 60 - time.minutes * 60;
      return normalize ? this.normalizeTime(time) : time;
    },
    start() {
      this.initialTimeSeconds = this.timeToSeconds(this.time);
      this.endTime = Date.now() + this.initialTimeSeconds * 1000;
      this.countdown();
    },
    countdown() {
      let secondsLeft = Math.round((this.endTime - Date.now()) / 1000);
      this.time = this.secondsToTime(secondsLeft);
      if (secondsLeft > 0) {
        this.timer = setTimeout(this.countdown, 1000);
      } else {
        this.stop();
        this.showTimerDonePopup = true;
        if (this.shouldNotify && Notification.permission == 'granted') {
          new Notification('Timer Done!');
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
    addTime(secondsToAdd, force = false) {
      if (!this.timer || force) { // typically only want to add time if the timer is not currently running
        // don't let the time go over 23:59:59 because that's the maximum time that can be displayed
        const seconds = Math.min(this.timeToSeconds(this.time) + secondsToAdd, 23*60*60 + 59*60 + 59);
        this.time = this.secondsToTime(seconds);
      }
    }
  },
  watch: {
    shouldNotify() {
      if (this.shouldNotify && Notification.permission != 'granted') {
        Notification.requestPermission();
      }
    }
  },
  components: {
    Card,
    ScrollSelector,
    RoundedButton,
    FontAwesomeIcon,
    Checkbox,
    ConfirmPopup,
  },
}
</script>

<style lang="sass" scoped>
@import "src/styles/style.sass"

.timer-card
  .header
    display: flex
    background-color: var(--color)
    padding: 3px 20px
    color: white
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
        .line
          position: absolute
          top: 0
          background-color: white
          height: 3px
          width: 30px
          border-radius: 10px
          transition: transform .2s ease
          transform: rotate(45deg) translate(12px, 16px) scale(1)
          &.hide
            transform: rotate(45deg) translate(12px, 16px) scale(0)

    .slash
      font-size: 1.2em
      transition: transform .2s
      transform: translateX(-3px)
      &.hide
        transform: translateX(-3px) scale(0)

    // .slash-2
    //   font-size: 1.2em
    //   color: var(--color)
    //   transition: transform .2s
    //   transform: translate(-4.5px , 2.5px)
    //   &.hide
    //     transform: translate(-4.5px, 2.5px) scale(0)

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
    color: #777

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

</style>
