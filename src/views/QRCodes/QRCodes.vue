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
                :image="resolvedLogo"
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
              <font-awesome-icon :icon="faQrcode"  style="font-size:40px"/>
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
            <div class="input-wrapper">
              <input
                v-model="url"
                placeholder="https://stevenson.space"
                :class="{ 'has-error': error }"
              />
              <info-tooltip v-if="error" :icon="faCircleExclamation" class="input-error-icon">
                {{ error }}
              </info-tooltip>
            </div>
          </div>

          <div class="logo-row">
            <image-upload
              label="Logo"
              v-model="logoPath"
              :min-aspect-ratio="0.3"
              :asset-sources="['patriots/', 'QRCodeLogo.png']"
              asset-title="Browse QR Code Logos"
              :asset-thumbnail-square="true"
            />
            <div class="reset-wrapper">
              <rounded-button
                v-if="qrColor !== defaultColor || logoPath !== defaultLogoPath"
                text="Reset Styling"
                :circular="true"
                @click="reset"
              />
            </div>
          </div>

          <div class="save-info">
            <font-awesome-icon :icon="faFileExport" />
            <div>
              <strong>To save:</strong>
              <span>Drag & drop or tap and hold (mobile)</span>
            </div>
          </div>
        </div>
      </div>
      </card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import PlainHeader from '@/components/PlainHeader.vue';
import QRCodeVue3 from 'space-vue3-qrcode';
import Card from '@/components/Card.vue';
import RoundedButton from '@/components/RoundedButton.vue';
import ColorPicker from '@/components/ColorPicker.vue';
import ImageUpload from '@/components/ImageUpload.vue';
import InfoTooltip from '@/components/InfoTooltip.vue';
import { globalImageResolver } from '@/utils/imageResolver';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faQrcode, faFileExport, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

const defaultLogoPath = 'assets://QRCodeLogo.png';
const defaultColor = '#1F5D39';

const url = ref('https://stevenson.space');
const qrColor = ref(defaultColor);
const logoPath = ref(defaultLogoPath);
const imageCache = ref(globalImageResolver.getCache());
// qrKey forces QRCodeVue3 to remount (the library only draws once on mount, not on prop changes)
const qrKey = ref(0);

let unsubscribeImageCache: (() => void) | undefined;

onMounted(() => {
  unsubscribeImageCache = globalImageResolver.onUpdate((cache) => {
    imageCache.value = cache;
  });
});

onBeforeUnmount(() => {
  unsubscribeImageCache?.();
});

watch(logoPath, async (newVal) => {
  if (newVal?.startsWith('local://')) {
    await globalImageResolver.load(newVal);
  }
  qrKey.value++;
});

watch(qrColor, () => {
  qrKey.value++;
});

// Anchored, case-insensitive, no /g flag (stateful lastIndex not needed)
const urlPattern = /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/i;

const error = computed(() => {
  if (!url.value) return '';
  if (!urlPattern.test(url.value)) return 'Invalid URL format (e.g., https://stevenson.space)';
  if (url.value.length > 120) return 'URL too long';
  return '';
});

const showQR = computed(() => !error.value && url.value.length > 0);

const resolvedLogo = computed((): string | undefined => {
  if (!logoPath.value) return undefined;
  if (logoPath.value.startsWith('local://')) {
    const filename = logoPath.value.replace('local://', '');
    return imageCache.value[filename] ?? undefined;
  }
  return globalImageResolver.resolve(logoPath.value) ?? undefined;
});

function reset() {
  qrColor.value = defaultColor;
  logoPath.value = defaultLogoPath;
}
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

.input-wrapper
  position: relative
  display: flex
  align-items: center

  input
    flex: 1

  .input-error-icon
    position: absolute
    right: 12px
    color: #ef4444

  input.has-error
    border-color: rgba(239, 68, 68, 0.5)
    padding-right: 36px

.logo-row
  display: flex
  align-items: flex-start

.reset-wrapper
  flex: 1
  display: flex
  justify-content: center
  padding-top: 20px // clears the ImageUpload label height so button aligns with the image box
</style>
