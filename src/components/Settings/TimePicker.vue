<template>
  <confirm-popup :show="show" @cancel="cancel" @ok="done" ok-text="Select">
    <div class="time-picker">
      <div class="time-selector">
        <scroll-selector :options="hours" v-model="selectedTime.hour"/>
        <span class="colon">:</span>
        <scroll-selector :options="minutes" v-model="selectedTime.minute"/>
        <scroll-selector :options="suffixes" v-model="selectedTime.suffix"/>
      </div>

      <div class="separator">
        <div class="line"/>
        <div class="text">or select an existing period</div>
        <div class="line"/>
      </div>

      <div class="options">
        <div
          class="option"
          v-for="option in options"
          :class="{ selected: option === selectedPeriod }"
          @click="choosePeriod(option)">
          <div class="text">{{ option.text }}</div>
          <div class="time">
            {{ convertMilitaryTime(option.time) }}
            <span class="suffix">{{ getSuffix(option.time) }}</span>
          </div>
        </div>
      </div>
      
      <checkbox class="set-others" v-model="setOthersChecked" v-show="mode === 'period'">
        <div class="text">Also set periods with the same name in other schedule types</div>
      </checkbox>

      <div class="separator"><div class="line"/></div>
    </div>
  </confirm-popup>
</template>

<script>
import ConfirmPopup from 'common/ConfirmPopup.vue';
import ScrollSelector from 'common/ScrollSelector.vue';
import Checkbox from 'common/Checkbox.vue';
import Bell from 'src/js/bell.js';

export default {
  data() {
    return {
      show: false,
      options: [],
      cancel: () => {},
      done: () => {},
      hours: Array(12).fill(0).map((_, i) => String(i + 1)), // generates ['1', '2', '3', '4', '5', ...]
      minutes: Array(60).fill(0).map((_, i) => i).map(val => (val < 10 ? '0' : '') + val), // generates ['00', '01', '02', ...]
      suffixes: ['AM', 'PM'],
      selectedTime: {
        hour: '1',
        minute: '00',
        suffix: 'AM',
      },
      mode: 'time', // can be 'time' or 'period'
      selectedPeriod: null,
      setOthersChecked: true,
    }
  },
  computed: {
    time() {
      if (this.mode === 'period') {
        return this.selectedPeriod ? {
          ...this.selectedPeriod,
          setOthers: this.setOthersChecked,
         } : '0:00';
      }

      // we assume mode === 'time'
      return { time: this.getSelectedTime() };
    }
  },
  methods: {
    pickTime(options = [], selectedTime = '1:00') {
      return new Promise((resolve, reject) => {
        this.options = options.slice(0); // make a copy to prevent modification of the original
        this.options.sort((a, b) => Bell.timeToNumber(a.time) - Bell.timeToNumber(b.time));
        this.setOthersChecked = true;

        this.show = true;

        this.setSelectedTime(selectedTime);

        this.cancel = () => {
          reject('User Canceled');
          this.show = false;
        }

        this.done = () => {
          resolve(this.time);
          this.show = false;
        }
      });
    },
    choosePeriod(period) {
      this.selectedPeriod = period;
      this.setSelectedTime(period.time);
      this.mode = 'period';
    },
    getSelectedTime() {
      let hours = Number(this.selectedTime.hour);
      if(this.selectedTime.suffix == "PM" && hours < 12) hours += 12;
      if(this.selectedTime.suffix == "AM" && hours === 12) hours -= 12;
      
      return hours + ':' + this.selectedTime.minute;
    },
    setSelectedTime(time) {
      let [hours, minutes] = time.split(':');
      hours = Number(hours);

      let suffix = hours >= 12 ? 'PM' : 'AM';
      hours = (hours > 12)? hours -12 : hours;
      hours = (hours == 0)? 12 : hours;

      this.selectedTime.hour = String(hours);
      this.selectedTime.minute = minutes;
      this.selectedTime.suffix = suffix;
    },
    convertMilitaryTime: Bell.convertMilitaryTime,
    getSuffix: Bell.getSuffix,
  },
  watch: {
    selectedTime: {
      handler() {
        if (this.mode !== 'time' && (!this.selectedPeriod || this.selectedPeriod.time !== this.getSelectedTime())) {
          this.mode = 'time';
          this.selectedPeriod = null;
        }
      },
      deep: true,
    }
  },
  components: {
    ConfirmPopup,
    ScrollSelector,
    Checkbox,
  }
}
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.time-picker
  margin-top: 15px;

  .time-selector
    display: flex
    align-items: center
    margin: 0 35px
    justify-content: center

    .colon
      font-size: 1.5em

  .separator
    display: flex
    align-items: center
    margin: 15px 0

    .line
      flex: 1
      height: 1px
      background-color: #bbb

    .text
      color: #666
      font-size: .8em
      margin: 0 5px

  .options
    height: 200px
    overflow: auto
    +no-scrollbar
    padding: 0 35px

    .option
      display: flex
      justify-content: space-between
      border-radius: 100px
      border: var(--color) thin solid
      margin: 10px 10px
      padding: 5px 10px
      // font-size: 1em
      cursor: pointer
      min-width: 200px
      &.selected
        background-color: var(--color)
        color: white

      .suffix
        font-size: .75em

  .set-others .text
    width: 200px

</style>
