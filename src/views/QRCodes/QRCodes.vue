<template>
  <div>
    <plain-header title='QR Codes' />
    <div class="qr-container">
      <card class="qr-card">
        <div class="qr-content">
        <div class="qr-left">
          <div class="qr-preview">
            <div v-if="showQR" class="qr-image">
              <QRCodeVue3
                :key="qrKey"
                :image="selectedIconImage"
                :width="300"
                :height="300"
                :margin="10"
                :value="url"
                :qrOptions="{ typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'Q' }"
                :imageOptions="{ hideBackgroundDots: true, imageSize: 0.4 }"
                :dotsOptions="{ type: 'rounded', color: qrColor }"
                :backgroundOptions="{ color: '#ffffff' }"
                :cornersSquareOptions="{ type: 'extra-rounded', color: qrColor }"
                :cornersDotOptions="{ type: 'circle', color: qrColor }"
                fileExt="png"
              />
            </div>
            <div v-else class="qr-empty">
              <font-awesome-icon :icon="icons.faQrcode"  style="font-size:40px"/>
              <p>Generate QR Code</p>
            </div>
          </div>
        </div>

        <div class="qr-right">
          <div class="field">
            <color-picker
              label="QR Code Color"
              v-model="qrColor"
              :allow-inherit="false"
              :disable-inline-button="true"
            />
          </div>

          <div class="field">
            <label>Center Icon</label>
            <dropdown
              class="icon-dropdown"
              :options="iconOptions"
              :modelValue="selectedIcon"
              :show-selected-as-option="false"
              @update:modelValue="updateIcon"
            />
            <div class="icon-preview" :class="{ empty: !selectedIconImage }">
              <img v-if="selectedIconImage" :src="selectedIconImage" alt="Selected center icon" />
              <span v-else>No center icon</span>
            </div>
            <div v-if="isCustomIconSelected" class="custom-upload">
              <input
                ref="customUploadInput"
                class="upload-input"
                type="file"
                accept="image/*"
                @change="handleCustomImageUpload"
              />
              <div class="tiny-note">Square transparent images work best.</div>
              <div v-if="uploadError" class="upload-error">
                {{ uploadError }}
              </div>
              <rounded-button
                v-if="customImageData"
                @click="clearCustomImage"
                text="Clear Upload"
                :circular="true"
                class="btn-reset"
              />
            </div>
          </div>

          <div class="field">
            <label>Link</label>
            <input
              v-model="url"
              placeholder="https://stevenson.space"
            />
          </div>

          <div class="save-info">
            <font-awesome-icon :icon="icons.faFileExport" />
            <div>
              <strong>To save:</strong>
              <span>Drag & drop or tap and hold (mobile)</span>
            </div>
          </div>

          <div v-if="url.length > 40" class="tip">
            💡 For long links, try <a href="https://bitly.com/" target="_blank">Bitly</a>
          </div>

          <div v-if="error" class="error">
            {{ error }}
          </div>

          <div v-if="qrColor !== defaultColor" class="buttons">
            <rounded-button
              @click="resetColor"
              text="Reset Color"
              :circular="true"
              class="btn-reset"
            />
          </div>
        </div>
      </div>
      </card>
    </div>
  </div>
</template>

<script>
import PlainHeader from '@/components/PlainHeader.vue';
import QRCodeVue3 from 'space-vue3-qrcode';
import Card from '@/components/Card.vue';
import RoundedButton from '@/components/RoundedButton.vue';
import ColorPicker from '@/components/ColorPicker.vue';
import Dropdown from '@/components/Dropdown.vue';
import logo from '@/assets/QRCodeLogo.png';
import patriot from '@/assets/patriot.png';
import patriotEclipse from '@/assets/patriot-eclipse.png';
import patriotLogoFestive from '@/assets/patriot-logo-festive.png';
import patriotLogoParty from '@/assets/patriot-logo-party.png';
import patriotLogoSpace from '@/assets/patriot-logo-space.png';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faQrcode, faFileExport } from '@fortawesome/free-solid-svg-icons';

export default {
  components: {
    PlainHeader,
    Card,
    RoundedButton,
    ColorPicker,
    Dropdown,
    QRCodeVue3,
    FontAwesomeIcon,
  },
  data() {
    const iconChoices = [
      { name: 'Stevenson Space', image: logo },
      { name: 'Patriot', image: patriot },
      { name: 'Patriot Eclipse', image: patriotEclipse },
      { name: 'Patriot Festive', image: patriotLogoFestive },
      { name: 'Patriot Party', image: patriotLogoParty },
      { name: 'Patriot Space', image: patriotLogoSpace },
      { name: 'Custom Upload', image: '', custom: true },
      { name: 'No Icon', image: '' },
    ];

    return {
      url: 'https://stevenson.space',
      qrColor: '#1F5D39',
      defaultColor: '#1F5D39',
      showQR: false,
      qrKey: 0,
      error: '',
      iconChoices,
      selectedIcon: 0,
      customImageData: '',
      uploadError: '',
      icons: {
        faQrcode,
        faFileExport,
      },
    };
  },
  computed: {
    canGenerate() {
      const urlPattern = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

      if (!this.url || this.url.length === 0) {
        this.error = '';
        return false;
      }

      if (!this.url.match(urlPattern)) {
        this.error = 'Invalid URL format (e.g., https://stevenson.space)';
        return false;
      }

      if (this.url.length > 120) {
        this.error = 'URL too long';
        return false;
      }

      this.error = '';
      return true;
    },
    iconOptions() {
      return this.iconChoices.map((choice) => choice.name);
    },
    selectedIconChoice() {
      return this.iconChoices[this.selectedIcon] || this.iconChoices[0];
    },
    isCustomIconSelected() {
      return !!this.selectedIconChoice?.custom;
    },
    selectedIconImage() {
      if (this.isCustomIconSelected) {
        return this.customImageData || '';
      }
      return this.selectedIconChoice?.image || '';
    },
  },
  watch: {
    qrColor() {
      this.qrKey++;
    },
    selectedIcon() {
      this.qrKey++;
    },
    customImageData() {
      if (this.isCustomIconSelected) this.qrKey++;
    },
    url() {
      this.showQR = this.canGenerate;
    },
  },
  mounted() {
    this.showQR = this.canGenerate;
  },
  methods: {
    resetColor() {
      this.qrColor = this.defaultColor;
    },
    updateIcon(iconIndex) {
      this.selectedIcon = iconIndex;
      this.uploadError = '';
    },
    handleCustomImageUpload(event) {
      const file = event?.target?.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        this.uploadError = 'Please upload an image file.';
        event.target.value = '';
        return;
      }

      const maxFileSize = 2 * 1024 * 1024;
      if (file.size > maxFileSize) {
        this.uploadError = 'Please use an image under 2MB.';
        event.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.customImageData = typeof reader.result === 'string' ? reader.result : '';
        this.uploadError = this.customImageData ? '' : 'Could not read image file.';
      };
      reader.onerror = () => {
        this.uploadError = 'Could not read image file.';
      };
      reader.readAsDataURL(file);
    },
    clearCustomImage() {
      this.customImageData = '';
      this.uploadError = '';
      if (this.$refs.customUploadInput) {
        this.$refs.customUploadInput.value = '';
      }
    },
  },
};
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.qr-container
  display: flex
  justify-content: center
  width: 100%

.qr-card
  width: auto
  max-width: 100%

.qr-content
  padding: 30px
  display: flex
  gap: 40px
  align-items: flex-start

  +mobile
    flex-direction: column
    padding: 20px
    gap: 30px

.qr-left
  flex: 0 0 350px
  display: flex
  flex-direction: column
  gap: 20px

  +mobile
    flex: none

.qr-right
  flex: 0 0 350px
  display: flex
  flex-direction: column
  gap: 20px

  +mobile
    flex: none

.qr-preview
  width: 100%
  aspect-ratio: 1
  background: white
  border-radius: 16px
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
  display: flex
  align-items: center
  justify-content: center
  padding: 30px
  box-sizing: border-box

.qr-image
  width: 100%
  height: 100%
  min-width: 300px
  min-height: 300px
  display: flex
  align-items: center
  justify-content: center

  :deep(.my-qur)
    width: 100% !important
    height: 100% !important

  :deep(canvas)
    width: 100% !important
    height: 100% !important
    object-fit: contain

.qr-empty
  width: 100%
  height: 100%
  min-width: 300px
  min-height: 300px
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  gap: 12px
  color: var(--secondary)
  opacity: 0.5

  svg
    opacity: 0.6

  p
    font-size: 14px

.save-info
  display: flex
  align-items: center
  gap: 12px
  padding: 14px 18px
  background: rgba(128, 128, 128, 0.06)
  border: 1px solid rgba(128, 128, 128, 0.12)
  border-radius: 10px
  font-size: 13px

  svg
    flex-shrink: 0
    color: var(--accent)

  strong
    color: var(--primary)
    font-weight: 600
    margin-right: 4px

  span
    color: var(--secondary)

.field
  display: flex
  flex-direction: column
  gap: 8px

  label
    font-size: 13px
    font-weight: 500
    color: var(--secondary)
    text-transform: uppercase
    letter-spacing: 0.5px

  input
    background: rgba(128, 128, 128, 0.06)
    border: 1px solid rgba(128, 128, 128, 0.12)
    border-radius: 10px
    padding: 10px 14px
    font-size: 14px
    color: var(--primary)
    transition: all 0.2s

    &::placeholder
      color: var(--tertiary)
      opacity: 0.5

    &:hover
      border-color: rgba(128, 128, 128, 0.2)

    &:focus
      outline: none
      border-color: var(--accent)
      box-shadow: 0 0 0 3px rgba(128, 128, 128, 0.08)

.icon-dropdown
  width: fit-content

.icon-preview
  margin-top: 10px
  width: 72px
  height: 72px
  border-radius: 12px
  border: 1px solid rgba(128, 128, 128, 0.18)
  background: rgba(128, 128, 128, 0.06)
  display: flex
  align-items: center
  justify-content: center
  font-size: 11px
  color: var(--secondary)
  text-align: center
  padding: 8px
  box-sizing: border-box

  img
    width: 100%
    height: 100%
    object-fit: contain

  &.empty
    border-style: dashed

.custom-upload
  margin-top: 10px
  display: flex
  flex-direction: column
  gap: 8px
  align-items: flex-start

.upload-input
  max-width: 100%
  font-size: 12px
  color: var(--secondary)

.tiny-note
  font-size: 11px
  color: var(--tertiary)
  line-height: 1.2

.upload-error
  font-size: 12px
  color: #ef4444

.tip
  font-size: 13px
  color: var(--secondary)
  padding: 12px 14px
  background: rgba(128, 128, 128, 0.04)
  border-radius: 8px
  border-left: 3px solid var(--accent)

  a
    color: var(--accent)

.error
  font-size: 13px
  color: #ef4444
  padding: 12px 14px
  background: rgba(239, 68, 68, 0.08)
  border-radius: 8px
  border-left: 3px solid #ef4444

.buttons
  display: flex
  gap: 10px
  margin-top: 8px

  .btn-reset
    width: 120px
</style>
