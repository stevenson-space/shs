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
        @click="fileInput?.click()"
      >
        <div v-if="!resolvedImageUrl" class="empty-state">
          <font-awesome-icon :icon="faImage" />
        </div>

        <!-- Overlay buttons left (info) -->
        <div class="button-overlay-left">
          <info-tooltip v-if="modelValue">
            <template #trigger>
              <icon-button class="overlay-btn" @click.stop type="button" ref="infoBtn">
                <font-awesome-icon :icon="faCircleInfo" />
              </icon-button>
            </template>
            {{ modelValue }}
          </info-tooltip>
        </div>

        <!-- Overlay buttons right (clear/upload & folder) -->
        <div class="button-overlay-right">
          <icon-button
            class="overlay-btn"
            v-if="modelValue"
            @click.stop="clearImage"
            type="button"
            title="Delete image"
          >
            <font-awesome-icon :icon="faTrashCan" />
          </icon-button>
          <icon-button
            class="overlay-btn"
            v-else
            @click.stop="fileInput?.click()"
            type="button"
            title="Upload image"
          >
            <font-awesome-icon :icon="faCloudArrowUp" />
          </icon-button>
          <icon-button
            class="overlay-btn"
            @click.stop="openAssetBrowser"
            type="button"
            title="Browse asset images"
          >
            <font-awesome-icon :icon="faFolderOpen" />
          </icon-button>
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

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount, useTemplateRef } from 'vue';
import {
  faImage,
  faCircleInfo,
  faTrashCan,
  faCloudArrowUp,
  faFolderOpen,
} from '@fortawesome/free-solid-svg-icons';
import { storeImage, deleteImage } from '@/utils/imageStorage';
import { globalImageResolver } from '@/utils/imageResolver';
import AssetBrowser from '@/components/AssetBrowser.vue';
import IconButton from '@/components/IconButton.vue';
import InfoTooltip from '@/components/InfoTooltip.vue';

const { modelValue, label = '', minAspectRatio = 2, assetFolder = 'header-images' } = defineProps<{
  modelValue?: string;
  label?: string;
  minAspectRatio?: number;
  assetFolder?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
  blur: [];
}>();

const error = ref<string | null>(null);
const imageCache = ref(globalImageResolver.getCache());
const assetBrowserOpen = ref(false);

const fileInput = useTemplateRef<HTMLInputElement>('fileInput');

const unsubscribeImageCache: (() => void) | undefined = globalImageResolver.onUpdate((cache) => {
  imageCache.value = cache;
});

watch(() => modelValue, (newVal) => {
  if (newVal?.startsWith('local://')) {
    globalImageResolver.load(newVal);
  }
}, { immediate: true });

onBeforeUnmount(() => {
  unsubscribeImageCache?.();
});

const resolvedImageUrl = computed(() => {
  // Reference imageCache for reactivity
  const _ = imageCache.value;
  return modelValue ? globalImageResolver.resolve(modelValue) : null;
});

const previewStyle = computed(() => {
  if (resolvedImageUrl.value) {
    const url = resolvedImageUrl.value.startsWith('data:')
      ? `url("${resolvedImageUrl.value}")`
      : `url(${resolvedImageUrl.value})`;
    return {
      backgroundImage: url,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }
  return {};
});

function openAssetBrowser(): void {
  assetBrowserOpen.value = true;
}

function handleAssetSelect(assetPath: string): void {
  emit('update:modelValue', assetPath);
  emit('blur');
}

async function clearImage(): Promise<void> {
  const oldValue = modelValue;

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

  emit('update:modelValue', '');
  emit('blur');
}

async function handleFileSelect(event: Event): Promise<void> {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  error.value = null;

  // Validate it's an image
  if (!file.type.startsWith('image/')) {
    error.value = 'Please select an image file';
    target.value = '';
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
          error.value = 'Your browser does not support image processing';
          target.value = '';
          return;
        }

        // Use SVG dimensions or default size
        canvas.width = img.width || 512;
        canvas.height = img.height || 512;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(async (blob) => {
          if (!blob) {
            error.value = 'Failed to process image. Try a smaller image';
            target.value = '';
            return;
          }

          const filename = file.name.replace(/\.svg$/i, '.png');

          try {
            await storeImage(filename, blob);
            console.log('[ImageUpload] Stored SVG as PNG in IndexedDB:', filename, 'Size:', blob.size, 'bytes');

            // Update model value with local:// path
            const localPath = `local://${filename}`;
            console.log('[ImageUpload] Emitting path:', localPath);
            emit('update:modelValue', localPath);

            // Immediately load the image into the resolver cache for instant preview
            try {
              await globalImageResolver.load(localPath);
            } catch (e) {
              console.error('[ImageUpload] Failed to load image:', e);
            }

            target.value = ''; // Reset to allow re-selecting the same file

            emit('blur'); // Trigger theme apply
          } catch (e) {
            console.error('[ImageUpload] Failed to store SVG:', e);
            error.value = 'Failed to store image. Try a smaller image.';
            target.value = ''; // Reset file input
          }
        }, 'image/png');
      };

      img.onerror = () => {
        error.value = 'Failed to load SVG';
        target.value = '';
      };

      img.src = (e.target as FileReader).result as string;
    };
    reader.readAsDataURL(file);
    return;
  }

  // Load image to check dimensions
  const img = new Image();
  const reader = new FileReader();

  reader.onload = (e) => {
    img.src = (e.target as FileReader).result as string;
  };

  img.onload = () => {
    const aspectRatio = img.width / img.height;

    if (aspectRatio < minAspectRatio) {
      error.value = `Image width must be at least ${minAspectRatio}x the height. Current: ${img.width}x${img.height}`;
      target.value = ''; // Reset file input
      return;
    }

    // Compress image for efficient storage
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      error.value = 'Your browser does not support image processing';
      target.value = '';
      return;
    }

    // Resize to max width of 1920px
    const maxWidth = 1920;
    let { width } = img;
    let { height } = img;

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
        error.value = 'Failed to process image. Try a smaller image';
        target.value = '';
        return;
      }

      const filename = file.name;

      try {
        await storeImage(filename, blob);
        console.log('[ImageUpload] Stored image in IndexedDB:', filename, 'Size:', blob.size, 'bytes');

        // Update model value with local:// path
        const localPath = `local://${filename}`;
        console.log('[ImageUpload] Emitting path:', localPath);
        emit('update:modelValue', localPath);

        // Immediately load the image into the resolver cache for instant preview
        try {
          await globalImageResolver.load(localPath);
        } catch (e) {
          console.error('[ImageUpload] Failed to load image:', e);
        }

        target.value = ''; // Reset to allow re-selecting the same file

        emit('blur'); // Trigger theme apply
      } catch (e) {
        console.error('[ImageUpload] Failed to store image:', e);
        error.value = 'Failed to store image. Try a smaller image.';
        target.value = ''; // Reset file input
      }
    }, mimeType, quality);
  };

  img.onerror = () => {
    error.value = 'Failed to load image';
    target.value = ''; // Reset file input
  };

  reader.readAsDataURL(file);
}
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
  background: var(--background)
  border-color: rgba(128, 128, 128, 0.25)

:deep(.overlay-btn.icon-btn)
  background: var(--background)
  border-color: rgba(128, 128, 128, 0.25)
  color: var(--primary)
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12)

  &:hover
    background: var(--background)
    border-color: rgba(128, 128, 128, 0.25)
    transform: scale(1.1)
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.18)

  svg
    color: inherit

.error
  color: #dc2626
  font-size: 11px
  padding: 0 4px
  text-align: center
</style>
