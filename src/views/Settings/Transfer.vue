<template>
  <settings-section title="Transfer">
    <div class="buttons">
      <rounded-button text="Send Data" class="button" :icon="icons.faUpload" @click="showPopup(popups.send)" />
      <rounded-button text="Receive Data" class="button" :icon="icons.faDownload" @click="showPopup(popups.receive)" />
    </div>

    <confirm-popup :show="popupToShow == popups.send" ok-text="Send" @cancel="cancel" @ok="send">
      <div class="send-popup">
        <div class="title">Choose what to send:</div>

        <checkbox
          v-for="(_, setting) in shouldSendSetting"
          :key="setting"
          v-model="shouldSendSetting[setting]"
        >
          {{ settingToName(setting) }}
        </checkbox>
      </div>
    </confirm-popup>

    <confirm-popup :show="popupToShow == popups.code" cancel-text="" ok-text="Done" @ok="cancel">
      <div class="code-popup">
        Click on <span class="color">Receive Data</span> on the other device and enter this code:
        <div class="code">{{ code }}</div>
      </div>
    </confirm-popup>

    <confirm-popup :show="popupToShow == popups.receive" ok-text="Receive" @cancel="cancel" @ok="receive">
      <div class="receive-popup">
        <div class="title">Enter code:</div>
        <div>(Click <span class="color">Send</span> on other device to get code)</div>
        <input v-model="receiveCode">
      </div>
    </confirm-popup>

    <confirm-popup :show="popupToShow == popups.save" ok-text="Save" @cancel="cancel" @ok="save">
      <div class="save-popup">
        <div class="title">Choose what to save:</div>
        <checkbox
          v-for="(_, setting) in shouldSaveSetting"
          :key="setting"
          v-model="shouldSaveSetting[setting]"
        >
          {{ settingToName(setting) }}
        </checkbox>

        <div class="warning">Warning: Any existing data will be lost</div>
      </div>
    </confirm-popup>

    <popup :show="popupToShow == popups.loading">
      <div class="loading-popup">
        <font-awesome-icon :icon="icons.faSpinner" pulse />
        &nbsp;&nbsp;Loading
      </div>
    </popup>

    <confirm-popup :show="popupToShow == popups.error" cancel-text="" @ok="cancel" @cancel="cancel">
      <div class="error-popup">{{ errorMessage }}</div>
    </confirm-popup>
  </settings-section>
</template>

<script lang="ts">
import { faUpload, faDownload, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { mapState } from 'pinia';
import { defineComponent } from 'vue';
import useThemeStore from '@/stores/themes';
import useScheduleStore from '@/stores/schedules';
import useUserSettingsStore from '@/stores/user-settings';

import RoundedButton from '@/components/RoundedButton.vue';
import Popup from '@/components/Popup.vue';
import ConfirmPopup from '@/components/ConfirmPopup.vue';
import Checkbox from '@/components/Checkbox.vue';
import SettingsSection from './SettingsSection.vue';

// Note: setting refers to the name (e.g. 'color'), data inclued the content (e.g. '#FA32F5' or {'color' : '#FA32F5'})
type transferableSettingOption = 'color' |'theme' |'defaultScheduleMode' | 'grade' | 'customSchedules'

const transferableSettings: transferableSettingOption[] = ['color', 'theme', 'defaultScheduleMode', 'grade', 'customSchedules']; // the following strings should be direct properties of $store.state

const isValidTransferableSetting = (x: string) => transferableSettings.some((setting) => x === String(setting));

const popups = {
  none: 0,
  send: 1,
  code: 2,
  receive: 3,
  save: 4,
  loading: 5,
  error: 6,
};

export default defineComponent({
  components: {
    SettingsSection,
    RoundedButton,
    Popup,
    Checkbox,
    ConfirmPopup,
  },
  data() {
    return {
      icons: {
        faUpload,
        faDownload,
        faSpinner,
      },
      popups,
      popupToShow: 0, // using a single variable to control appearance of all popups to ensure only one is displayed at any point
      shouldSendSetting: {} as Record<transferableSettingOption, boolean>, // initialized in created()
      code: '',
      errorMessage: '',
      receiveCode: '',
      receivedData: {} as Record<transferableSettingOption, any>,
      shouldSaveSetting: {} as Record<transferableSettingOption, boolean>, // initialized after data is received
    };
  },
  created() {
    // Initialize each property of shouldSendSetting to true (meaning that all send checkboxes will be checked initially)
    transferableSettings.forEach((str) => {
      this.shouldSendSetting[str] = true;
    });
  },
  computed: {
    ...mapState(useThemeStore, ['theme', 'color']),
    ...mapState(useScheduleStore, ['defaultScheduleMode', 'customSchedules']),
    ...mapState(useUserSettingsStore, ['grade']),
  },
  methods: {
    settingToName(setting: transferableSettingOption) {
      const separatedWords = setting.replace(/([a-z])([A-Z])/g, '$1 $2'); // 'defaultScheduleSomething' to 'default Schedule Something'
      return separatedWords[0].toUpperCase() + separatedWords.slice(1); // capitalize first letter
    },
    showPopup(popup: any) {
      this.popupToShow = popup;
    },
    getSetting(name: transferableSettingOption) {
      switch (name.toLowerCase()) {
        case transferableSettings[0]: return this.color;
        case transferableSettings[1]: return this.theme;
        case transferableSettings[2]: return this.defaultScheduleMode;
        case transferableSettings[3]: return this.grade;
        case transferableSettings[4]: return this.customSchedules;
        default: return '';
      }
    },
    setSetting(name: transferableSettingOption, value: any) {
      switch (name.toLowerCase()) {
        case transferableSettings[0]: this.color = value; break;
        case transferableSettings[1]: this.theme = value; break;
        case transferableSettings[2]: this.defaultScheduleMode = value; break;
        case transferableSettings[3]: this.grade = value; break;
        case transferableSettings[4]: this.customSchedules = value; break;
        default: break;
      }
    },
    cancel() {
      // reset most things (usually unnecessary since they'll be overwritten anyway, but just in case)
      this.code = '';
      this.errorMessage = '';
      this.receiveCode = '';
      this.receivedData = {} as Record<transferableSettingOption, any>;
      this.shouldSaveSetting = {} as Record<transferableSettingOption, boolean>;
      this.popupToShow = popups.none;
    },
    async send() {
      this.showPopup(popups.loading);
      // Get the data for each selected option to send
      const data = {} as Record<transferableSettingOption, any>;
      for (const [setting, shouldSend] of Object.entries(this.shouldSendSetting) as [transferableSettingOption, any][]) {
        if (shouldSend) {
          // data[setting] = this.$store.state[setting];
          data[setting] = this.getSetting(setting);
        }
      }

      const response = await fetch('/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `content=${encodeURIComponent(JSON.stringify(data))}&syntax=json&expiry_days=1`,
      });
      if (response.status === 201) {
        const url = await response.text();
        const code = url.slice(url.lastIndexOf('/') + 1).trim().replace(/[^a-zA-Z0-9]/g, '');
        this.code = code.toLowerCase(); // converting to lower case to make it easier to type (will convert back when receiving)
        this.showPopup(popups.code);
      } else {
        this.errorMessage = 'Error: Please check your internet';
        this.showPopup(popups.error);
      }
    },

    async receive() {
      this.showPopup(popups.loading);
      let isValid = true;

      const response = await fetch(`/receive/${this.receiveCode.toUpperCase()}.txt`, {
        method: 'GET',
      });
      if (response.status === 200) {
        const data = await response.json();
        const settings = Object.keys(data);
        settings.forEach((setting) => {
          if (!isValidTransferableSetting(setting)) isValid = false;
        });
        if (isValid) {
          this.receivedData = data as Record<transferableSettingOption, any>;
          this.shouldSaveSetting = {} as Record<transferableSettingOption, boolean>; // reset it in case there was a previous received data with different settings
          settings.forEach((setting) => { // default to saving all settings present in data
            this.shouldSaveSetting[setting as transferableSettingOption] = true;
          });
          this.showPopup(popups.save);
        } else {
          this.errorMessage = 'Error: Invalid code';
          this.showPopup(popups.error);
        }
      } else {
        this.errorMessage = 'Error: Invalid code or no internet';
        this.showPopup(popups.error);
      }
    },
    save() {
      if (this.receivedData) {
        if (this.shouldSaveSetting.theme) {
          this.receivedData.theme = { theme: this.receivedData.theme, useThemeColor: !this.shouldSaveSetting.color };
        }
        for (const [setting, data] of (Object.entries(this.receivedData) as [transferableSettingOption, any][])) {
          if (this.shouldSaveSetting[setting]) {
            this.setSetting(setting, data);
          }
        }
      }
      this.cancel();
    },
  },
});
</script>

<style lang="sass" scoped>
.buttons
  display: flex
  justify-content: center
  font-size: 1.3em
  flex-flow: row wrap
  margin: 20px 0
  .button
    width: 200px
    margin: 10px 25px

.send-popup, .save-popup
  margin: 15px 25px
  width: 225px
  text-align: left
  display: flex
  flex-direction: column
  align-items: flex-start
  .title
    text-align: center
    width: 100%
    font-weight: bold
    color: var(--secondary)
    font-size: 1.2em
  .warning
    font-size: .76em
    color: red
    text-align: center
    margin-top: 15px
    width: 100%
    font-weight: bold

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

.receive-popup
  margin: 15px 25px
  text-align: center
  font-size: .79em
  .title
    font-size: 1.75em
    margin-bottom: 3px
  .color
    color: var(--color)
    font-weight: bold
  input
    margin-top: 12px
    border-radius: 5px
    border: thin solid #bbb
    font-size: 2em
    width: 150px
    letter-spacing: 2px
    font-weight: bold
    color: var(--color)
    text-align: center

.loading-popup
  margin: 25px
  font-size: 1.1em
.error-popup
  color: red
  margin: 15px 25px
  font-weight: bold
  max-width: 300px
</style>
