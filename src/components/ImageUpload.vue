<template>
  <div class="image-upload">
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      @change="handleFileSelect"
      style="display: none"
    />

    <!-- Image preview frame -->
    <div class="image-preview-wrapper">
      <label v-if="label" class="image-label">{{ label }}</label>
      <div
        class="image-preview"
        :style="previewStyle"
        @click="$refs.fileInput.click()"
      >
        <div v-if="!resolvedImageUrl" class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </div>

        <!-- Overlay buttons left (info) -->
        <div class="button-overlay-left">
          <button
            v-if="modelValue"
            @click.stop
            @mouseenter="showTooltip"
            @mouseleave="hideTooltip"
            class="overlay-btn info-btn"
            type="button"
            ref="infoBtn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </button>
        </div>

        <!-- Tooltip (portal to body) -->
        <teleport to="body">
          <div
            v-if="tooltipVisible"
            class="image-path-tooltip"
            :style="tooltipStyle"
          >
            {{ modelValue }}
          </div>
        </teleport>

        <!-- Overlay buttons right (clear/upload & folder) -->
        <div class="button-overlay-right">
          <button
            v-if="modelValue"
            @click.stop="clearImage"
            class="overlay-btn clear-btn"
            type="button"
            title="Clear image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <button
            v-else
            @click.stop="$refs.fileInput.click()"
            class="overlay-btn upload-btn"
            type="button"
            title="Upload image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </button>
          <button
            @click.stop="openAssetBrowser"
            class="overlay-btn folder-btn"
            type="button"
            title="Browse asset images"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
        </div>
      </div>
      <div v-if="error" class="error">{{ error }}</div>
    </div>

    <!-- Asset Browser Modal -->
    <asset-browser
      :is-open="assetBrowserOpen"
      :folder="assetFolder"
      @close="assetBrowserOpen = false"
      @select="handleAssetSelect"
    />
  </div>
</template>

<script>
import { storeImage, deleteImage } from '@/utils/imageStorage';
import { globalImageResolver } from '@/utils/imageResolver';
import AssetBrowser from './AssetBrowser.vue';

export default {
  name: 'ImageUpload',
  components: {
    AssetBrowser,
  },
  props: {
    modelValue: String,
    label: {
      type: String,
      default: '',
    },
    minAspectRatio: {
      type: Number,
      default: 2, // width must be at least 2x height
    },
    assetFolder: {
      type: String,
      default: 'header-images', // 'header-images' or 'particles'
    },
  },
  emits: ['update:modelValue', 'blur'],
  data() {
    return {
      error: null,
      imageCache: globalImageResolver.getCache(),
      tooltipVisible: false,
      tooltipStyle: {},
      assetBrowserOpen: false,
    };
  },
  computed: {
    resolvedImageUrl() {
      // Reference imageCache for reactivity
      const _ = this.imageCache;
      return this.modelValue ? globalImageResolver.resolve(this.modelValue) : null;
    },
    previewStyle() {
      if (this.resolvedImageUrl) {
        const url = this.resolvedImageUrl.startsWith('data:')
          ? `url("${this.resolvedImageUrl}")`
          : `url(${this.resolvedImageUrl})`;
        return {
          backgroundImage: url,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
      }
      return {};
    },
  },
  created() {
    // Subscribe to image cache updates
    this.unsubscribeImageCache = globalImageResolver.onUpdate((cache) => {
      this.imageCache = cache;
    });

    // Load the current image if it's a local:// path
    if (this.modelValue?.startsWith('local://')) {
      globalImageResolver.load(this.modelValue);
    }
  },
  beforeUnmount() {
    if (this.unsubscribeImageCache) {
      this.unsubscribeImageCache();
    }
  },
  methods: {
    showTooltip() {
      if (!this.$refs.infoBtn) return;

      const btn = this.$refs.infoBtn;
      const rect = btn.getBoundingClientRect();

      this.tooltipStyle = {
        position: 'fixed',
        left: `${rect.left}px`,
        top: `${rect.top - 36}px`,
        zIndex: 1001,
      };
      this.tooltipVisible = true;
    },

    hideTooltip() {
      this.tooltipVisible = false;
    },

    openAssetBrowser() {
      this.assetBrowserOpen = true;
    },

    handleAssetSelect(assetPath) {
      this.$emit('update:modelValue', assetPath);
      this.$emit('blur');
    },

    async clearImage() {
      const oldValue = this.modelValue;

      // If clearing a local:// image, delete it from IndexedDB
      if (oldValue?.startsWith('local://')) {
        const filename = oldValue.replace('local://', '');
        try {
          await deleteImage(filename);
          console.log('[ImageUpload] Deleted image from IndexedDB:', filename);
        } catch (err) {
          console.error('[ImageUpload] Failed to delete image:', err);
        }
      }

      this.$emit('update:modelValue', '');
      this.$emit('blur');
    },

    async handleFileSelect(event) {
      const file = event.target.files[0];
      if (!file) return;

      this.error = null;

      // Validate it's an image
      if (!file.type.startsWith('image/')) {
        this.error = 'Please select an image file';
        return;
      }

      // Handle SVG files - convert to PNG for canvas compatibility
      if (file.type === 'image/svg+xml') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            // Convert SVG to PNG via canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
              this.error = 'Your browser does not support image processing';
              event.target.value = '';
              return;
            }

            // Use SVG dimensions or default size
            canvas.width = img.width || 512;
            canvas.height = img.height || 512;
            ctx.drawImage(img, 0, 0);

            canvas.toBlob(async (blob) => {
              if (!blob) {
                this.error = 'Failed to process image. Try a smaller image';
                event.target.value = '';
                return;
              }

              const filename = file.name.replace(/\.svg$/i, '.png');

              try {
                await storeImage(filename, blob);
                console.log('[ImageUpload] Stored SVG as PNG in IndexedDB:', filename, 'Size:', blob.size, 'bytes');

                // Update model value with local:// path
                const localPath = `local://${filename}`;
                console.log('[ImageUpload] Emitting path:', localPath);
                this.$emit('update:modelValue', localPath);

                // Immediately load the image into the resolver cache for instant preview
                try {
                  await globalImageResolver.load(localPath);
                } catch (e) {
                  console.error('[ImageUpload] Failed to load image:', e);
                }

                event.target.value = ''; // Reset to allow re-selecting the same file

                this.$emit('blur'); // Trigger theme apply
              } catch (e) {
                console.error('[ImageUpload] Failed to store SVG:', e);
                this.error = 'Failed to store image. Try a smaller image.';
                event.target.value = ''; // Reset file input
              }
            }, 'image/png');
          };

          img.onerror = () => {
            this.error = 'Failed to load SVG';
            event.target.value = '';
          };

          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
        return;
      }

      // Load image to check dimensions
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        const aspectRatio = img.width / img.height;

        if (aspectRatio < this.minAspectRatio) {
          this.error = `Image width must be at least ${this.minAspectRatio}x the height. Current: ${img.width}x${img.height}`;
          event.target.value = ''; // Reset file input
          return;
        }

        // Compress image for efficient storage
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          this.error = 'Your browser does not support image processing';
          event.target.value = '';
          return;
        }

        // Resize to max width of 1920px
        const maxWidth = 1920;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to Blob (more efficient than base64)
        // Use PNG for transparency support, JPEG for photos
        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const quality = mimeType === 'image/jpeg' ? 0.85 : undefined;

        canvas.toBlob(async (blob) => {
          if (!blob) {
            this.error = 'Failed to process image. Try a smaller image';
            event.target.value = '';
            return;
          }

          const filename = file.name;

          try {
            await storeImage(filename, blob);
            console.log('[ImageUpload] Stored image in IndexedDB:', filename, 'Size:', blob.size, 'bytes');

            // Update model value with local:// path
            const localPath = `local://${filename}`;
            console.log('[ImageUpload] Emitting path:', localPath);
            this.$emit('update:modelValue', localPath);

            // Immediately load the image into the resolver cache for instant preview
            try {
              await globalImageResolver.load(localPath);
            } catch (e) {
              console.error('[ImageUpload] Failed to load image:', e);
            }

            event.target.value = ''; // Reset to allow re-selecting the same file

            this.$emit('blur'); // Trigger theme apply
          } catch (e) {
            console.error('[ImageUpload] Failed to store image:', e);
            this.error = 'Failed to store image. Try a smaller image.';
            event.target.value = ''; // Reset file input
          }
        }, mimeType, quality);
      };

      img.onerror = () => {
        this.error = 'Failed to load image';
        event.target.value = ''; // Reset file input
      };

      reader.readAsDataURL(file);
    },
  },
};
</script>

<style lang="sass" scoped>
.image-upload
  display: flex
  gap: 12px
  align-items: flex-end

.image-preview-wrapper
  position: relative
  width: 140px
  display: flex
  flex-direction: column
  gap: 8px

.image-label
  font-size: 13px
  font-weight: 500
  color: var(--secondary)
  text-transform: uppercase
  letter-spacing: 0.5px
  flex-shrink: 0
  white-space: nowrap

.image-preview
  width: 100%
  height: 96px
  border-radius: 12px
  box-shadow: 0 0 0 2px var(--background), 0 0 0 4px rgba(128, 128, 128, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
  position: relative
  cursor: pointer
  overflow: hidden
  background: rgba(128, 128, 128, 0.08)

  &:hover
    box-shadow: 0 0 0 2px var(--background), 0 0 0 4px rgba(128, 128, 128, 0.25), 0 6px 16px rgba(0, 0, 0, 0.15)
    transform: translateY(-1px)

  .empty-state
    width: 100%
    height: 100%
    display: flex
    align-items: center
    justify-content: center
    color: var(--secondary)
    opacity: 0.3

.button-overlay-left
  position: absolute
  bottom: 6px
  left: 6px
  display: flex
  gap: 6px
  opacity: 1

.button-overlay-right
  position: absolute
  bottom: 6px
  right: 6px
  display: flex
  gap: 6px
  opacity: 1

.overlay-btn
  width: 32px
  height: 32px
  border: none
  border-radius: 8px
  background: rgba(0, 0, 0, 0.7)
  backdrop-filter: blur(8px)
  color: white
  cursor: pointer
  display: flex
  align-items: center
  justify-content: center
  transition: all 0.2s
  padding: 0
  position: relative
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3)

  &:hover
    background: rgba(0, 0, 0, 0.85)
    transform: scale(1.15)
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4)

  &:active
    transform: scale(0.95)

  svg
    display: block
    width: 16px
    height: 16px

.clear-btn
  &:hover
    background: rgba(220, 38, 38, 0.9)

.upload-btn
  &:hover
    background: var(--accent)

.folder-btn
  &:hover
    background: var(--accent)

.info-btn
  cursor: default

  &:hover
    background: rgba(59, 130, 246, 0.9)
    transform: scale(1.1)

.image-path-tooltip
  background: rgba(0, 0, 0, 0.9)
  color: white
  padding: 6px 10px
  border-radius: 6px
  font-size: 11px
  white-space: nowrap
  max-width: 300px
  overflow: hidden
  text-overflow: ellipsis
  pointer-events: none
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3)

  &::before
    content: ''
    position: absolute
    bottom: -6px
    left: 8px
    border: 6px solid transparent
    border-top-color: rgba(0, 0, 0, 0.9)

.error
  color: #dc2626
  font-size: 11px
  padding: 0 4px
  text-align: center
</style>
