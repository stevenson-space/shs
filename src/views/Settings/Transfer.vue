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
import { mapActions, mapState } from 'pinia';
import { defineComponent } from 'vue';
import RoundedButton from '@/components/RoundedButton.vue';
import Popup from '@/components/Popup.vue';
import ConfirmPopup from '@/components/ConfirmPopup.vue';
import Checkbox from '@/components/Checkbox.vue';
import { tryParseJSON } from '@/utils/util';
import useThemeStore from '@/stores/themes';
import useScheduleStore from '@/stores/schedules';
import useUserSettingsStore from '@/stores/user-settings';
import { CustomSchedules, MapStateToComputed, ScheduleMode, Theme } from '@/utils/types';
import SettingsSection from './SettingsSection.vue';

type transferableSettingOption = 'color' |'theme' |'defaultScheduleMode' | 'grade' | 'customSchedules'

const transferableSettings: transferableSettingOption[] = ['color', 'theme', 'defaultScheduleMode', 'grade', 'customSchedules'];

const popups = {
  none: 0,
  send: 1,
  code: 2,
  receive: 3,
  save: 4,
  loading: 5,
  error: 6,
};

type ThemeStoreState = {
  theme: Theme;
  color: string;
}

type GradeStoreState = {
  grade: string;
}

type ScheduleStoreState = {
  defaultScheduleMode: string;
  customSchedules: CustomSchedules;
}

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
    ...(mapState(useThemeStore, ['theme', 'color']) as MapStateToComputed<ThemeStoreState>),
    ...(mapState(useScheduleStore, ['defaultScheduleMode', 'customSchedules']) as MapStateToComputed<ScheduleStoreState>),
    ...(mapState(useUserSettingsStore, ['grade']) as MapStateToComputed<GradeStoreState>),
  },
  methods: {
    ...mapActions(useThemeStore, ['setTheme', 'setColor']),
    ...mapActions(useScheduleStore, ['setDefaultScheduleMode', 'setCustomSchedules']),
    ...mapActions(useUserSettingsStore, ['setGrade']),

    settingToName(setting: transferableSettingOption): string {
      const separatedWords = setting.replace(/([a-z])([A-Z])/g, '$1 $2'); // 'defaultScheduleSomething' to 'default Schedule Something'
      return separatedWords[0].toUpperCase() + separatedWords.slice(1); // capitalize first letter
    },
    showPopup(popup: any): void {
      this.popupToShow = popup;
    },
    getSetting(name: transferableSettingOption): string | Theme | ScheduleMode {
      switch (name) {
        case 'color': return this.color as string;
        case 'theme': return this.theme as Theme;
        case 'defaultScheduleMode': return this.defaultScheduleMode;
        case 'grade': return this.grade as string;
        case 'customSchedules': return this.customSchedules;
        default: return 'foo';
      }
    },
    setSetting(name: transferableSettingOption, value: any): void {
      switch (name) {
        case 'color': this.setColor(value); break;
        case 'theme': this.setTheme(value); break;
        case 'defaultScheduleMode': this.setDefaultScheduleMode(value); break;
        case 'grade': this.setGrade(value); break;
        case 'customSchedules': this.setCustomSchedules(value); break;
        default: break;
      }
    },
    cancel(): void {
      // reset most things (usually unnecessary since they'll be overwritten anyway, but just in case)
      this.code = '';
      this.errorMessage = '';
      this.receiveCode = '';
      this.receivedData = {} as Record<transferableSettingOption, any>;
      this.shouldSaveSetting = {} as Record<transferableSettingOption, boolean>;
      this.popupToShow = popups.none;
    },
    async send(): Promise<void> {
      this.showPopup(popups.loading);
      // Get the data for each selected option to send
      const data = {} as Record<transferableSettingOption, any>;
      for (const [setting, shouldSend] of Object.entries(this.shouldSendSetting) as [transferableSettingOption, any][]) {
        if (shouldSend) {
          data[setting] = this.getSetting(setting);
        }
      }
      const response = await fetch('https://dpaste.com/api/v2/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `content=${encodeURIComponent(JSON.stringify(data))}&syntax=json&expiry_days=1`,
      }) as Response;
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

    async receive(): Promise<void> {
      this.showPopup(popups.loading);
      let isValid = true;

      const response = await fetch(`https://dpaste.com/${this.receiveCode.toUpperCase()}.txt`, {
        method: 'GET',
      });
      if (response.status === 200) {
        const data = await response.json();
        const settings = Object.keys(data);
        settings.forEach((setting) => {
          if (!transferableSettings.some((transferableSetting) => transferableSetting === String(setting))) isValid = false; // make sure every recieved setting is acceptable
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
    save(): void {
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
