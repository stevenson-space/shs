<template>
  <settings-section title="Transfer">
    <div class="buttons">
      <rounded-button text="Send Data" class="button" :icon="icons.faUpload" @click="showSendPopup"/>
      <rounded-button text="Recieve Data" class="button" :icon="icons.faDownload"/>
    </div>
    <confirm-popup :show="popupToShow == 1" @cancel="hidePopup" @ok="send" ok-text="Send">
      <div class="show-popup">
        <div class="title">Choose what to send:</div>
        <checkbox v-model="sendData.color">Color</checkbox>
        <!-- <checkbox v-model="sendData.year">Year</checkbox>
        <checkbox v-model="sendData.defaultSchedule">Default Schedule</checkbox> -->
        <checkbox v-model="sendData.schedules">Schedules</checkbox>
      </div>
    </confirm-popup>
  </settings-section>
</template>

<script>
import { faUpload, faDownload } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

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
        faDownload
      },
      popupToShow: 0, // 0 - none, 1 - choose what to send, 2 - uploading..., 3 - display code
      sendData: {
        color: true,
        // year: true,
        // defaultSchedule: true,
        schedules: true,
      }
    };
  },
  methods: {
    hidePopup() { this.popupToShow = 0 },
    showSendPopup() { this.popupToShow = 1 },
    showUploadingPopup() { this.popupToShow = 2 },
    showCodePopup() { this.popupToShow = 3 },
    send() {
      this.showUploadingPopup();
      
      let data = {};
      if (this.sendData.color) {
        data.color = this.$state.color;
      }
      if (this.sendData.schedules) {
        data.schedules = this.$state.schedules;
      }

      // The following does not work yet because dpaste is not available over https
      // axios.post('http://dpaste.com/api/v2/', {
      //   content: JSON.stringify(data),
      //   syntax: 'json',
      //   expiry_days: 1,
      // }).then(response => {
      //   console.log(response);
      // }).catch(error => {
      //   console.log(error);
      // });
    }
  },
  components: {
    SettingsSection,
    RoundedButton,
    Popup,
    Checkbox,
    ConfirmPopup,
  }
}
</script>

<style lang="sass" scoped>

.buttons
  display: flex
  align-items: center
  height: 150px
  justify-content: center
  font-size: 1.4em

  .button
    width: 200px
    margin: 0 25px

.show-popup
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

</style>
