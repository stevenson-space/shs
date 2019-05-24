<template>
  <settings-section title="Transfer">
    <div class="buttons">
      <rounded-button text="Send Data" class="button" :icon="icons.faUpload" @click="showSendPopup"/>
      <rounded-button text="Recieve Data" class="button" :icon="icons.faDownload"/>
    </div>

    <confirm-popup :show="popupToShow == 1" @cancel="hidePopup" @ok="send" ok-text="Send">
      <div class="send-popup">
        <div class="title">Choose what to send:</div>
        <checkbox v-model="sendData.color">Color</checkbox>
        <!-- <checkbox v-model="sendData.year">Year</checkbox>
        <checkbox v-model="sendData.defaultSchedule">Default Schedule</checkbox> -->
        <checkbox v-model="sendData.schedules">Schedules</checkbox>
      </div>
    </confirm-popup>
    
    <popup :show="popupToShow == 2">
        <div class="loading-popup">
          <font-awesome-icon :icon="icons.faSpinner" pulse/>
          &nbsp;&nbsp;Loading
        </div>
    </popup>
    
    <confirm-popup :show="popupToShow == 3" cancelText="" okText="Done" @ok="hidePopup">
        <div class="code-popup">
          Click on <span class="color">Recieve Data</span> on the other device and enter this code:
          <div class="code">{{ code }}</div>
        </div>
    </confirm-popup>
    
    <confirm-popup :show="popupToShow == 4" cancelText="" @ok="hidePopup" @cancel="hidePopup">
        <div class="error-popup">Error: {{ errorMessage }}</div>
    </confirm-popup>
  </settings-section>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import { faUpload, faDownload, faSpinner } from '@fortawesome/free-solid-svg-icons';
import superagent from 'superagent';

import SettingsSection from './SettingsSection.vue';
import RoundedButton from 'common/RoundedButton.vue';
import Popup from 'common/Popup.vue';
import ConfirmPopup from 'common/ConfirmPopup.vue';
import Checkbox from 'common/Checkbox.vue';

export default {
  data() {
    return {
      icons: {
        faUpload,
        faDownload,
        faSpinner,
      },
      popupToShow: 0, // 0 - none, 1 - choose what to send, 2 - loading..., 3 - display code, 4 - display error if error
      sendData: {
        color: true,
        // year: true,
        // defaultSchedule: true,
        schedules: true,
      },
      code: 'ABCDEFG',
      errorMessage: 'Failed to access internet for numerous unidentifiable reasons',
    };
  },
  methods: {
    hidePopup() { this.popupToShow = 0 },
    showSendPopup() { this.popupToShow = 1 },
    showUploadingPopup() { this.popupToShow = 2 },
    showCodePopup() { this.popupToShow = 3 },
    showErrorPopup() { this.popupToShow = 4 },
    send() {
      this.showUploadingPopup();
      
      let data = {};
      if (this.sendData.color) {
        data.color = this.$store.state.color;
      }
      if (this.sendData.schedules) {
        data.schedules = this.$store.state.schedules;
      }
      
      superagent
        .post('https://cranky-jennings-b82188.netlify.com/send')
        .send({ content: JSON.stringify(data), syntax: 'json', expiry_days: 1})
        .type('form')
        .then(response => {
            console.log(response)
            const url = response.text;
            this.code = url.slice(url.lastIndexOf('/') + 1).trim().replace(/[^a-zA-Z0-9]/g, '');
            this.showCodePopup();
        })
        .catch(error => {
          this.errorMessage = error.message.split('\n')[0];
          this.showErrorPopup();
        });
    }
  },
  components: {
    SettingsSection,
    RoundedButton,
    Popup,
    Checkbox,
    ConfirmPopup,
    FontAwesomeIcon,
  }
}
</script>

<style lang="sass" scoped>

.buttons
  display: flex
  align-items: center
  height: 150px
  justify-content: center
  font-size: 1.3em

  .button
    width: 200px
    margin: 0 25px

.send-popup
  margin: 15px 25px
  width: 200px
  text-align: left
  display: flex
  flex-direction: column
  align-items: flex-start

  .title
    text-align: center
    width: 100%
    font-weight: bold
    color: #333
    font-size: 1.15em

.loading-popup
  margin: 25px
  font-size: 1.1em

.code-popup
  margin: 15px 25px 10px 25px
  max-width: 300px
  text-align: center

  .color, .code
    color: var(--color)
    font-weight: bold

  .code
    margin-top: 5px
    font-size: 1.75em
    letter-spacing: 3px

.error-popup
  color: red
  margin: 15px 25px
  font-weight: bold
  max-width: 300px

</style>
