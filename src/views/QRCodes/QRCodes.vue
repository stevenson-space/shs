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
                :image="logo"
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
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
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
            <label>Link</label>
            <input
              v-model="url"
              placeholder="https://stevenson.space"
            />
          </div>

          <div class="save-info">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
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
import logo from '@/assets/QRCodeLogo.png';

export default {
  components: { PlainHeader, Card, RoundedButton, ColorPicker, QRCodeVue3 },
  data() {
    return {
      url: 'https://stevenson.space',
      qrColor: '#1F5D39',
      defaultColor: '#1F5D39',
      showQR: false,
      qrKey: 0,
      error: '',
      logo,
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
  },
  watch: {
    qrColor() {
      this.qrKey++;
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
