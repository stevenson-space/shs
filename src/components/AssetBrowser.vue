<template>
  <teleport to="body">
    <transition name="modal">
      <div v-if="isOpen" class="modal-backdrop" @click.self="close">
        <div class="modal-content" :style="modalStyle">
          <div class="modal-header">
            <h3>{{ modalTitle }}</h3>
            <button @click="close" class="close-btn" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <div v-if="allImages.length === 0" class="empty-state">
              No images found
            </div>

            <div v-else class="images-grid" :class="{ 'particles-grid': folder === 'particles' }">
              <div
                v-for="image in allImages"
                :key="image.path"
                class="image-card"
                @click="selectImage(image)"
              >
                <div class="image-preview" :class="{ 'particle-preview': folder === 'particles' }" :style="{ backgroundImage: `url(${image.url})` }">
                  <div class="image-overlay">
                    <div class="image-name">{{ image.name }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { mapState } from 'pinia';
import useThemeStore from '@/stores/themes';
import { fallbackStyling } from '@/utils/themes';

// Import all images using Vite's glob import
const headerImageModules = import.meta.glob('@/themes/assets/header-images/*', {
  eager: true,
  as: 'url',
});

const particleImageModules = import.meta.glob('@/themes/assets/particles/**/*', {
  eager: true,
  as: 'url',
});

export default {
  name: 'AssetBrowser',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    folder: {
      type: String,
      default: 'header-images', // 'header-images' or 'particles'
    },
  },
  emits: ['close', 'select'],
  computed: {
    ...mapState(useThemeStore, ['styling']),

    modalStyle() {
      const fallback = fallbackStyling(this.styling);
      const bgColor = this.styling.background || fallback.background;
      return {
        backgroundColor: bgColor,
      };
    },

    modalTitle() {
      return this.folder === 'particles' ? 'Browse Particle Images' : 'Browse Header Images';
    },

    allImages() {
      const images = [];
      const imageModules = this.folder === 'particles' ? particleImageModules : headerImageModules;

      for (const [path, url] of Object.entries(imageModules)) {
        const filename = path.split('/').pop();
        const folderPath = path.split('/themes/assets/')[1].split('/').slice(0, -1).join('/');
        const name = filename.replace(/\.(png|jpg|jpeg|webp|gif)$/i, '');

        images.push({
          path: `assets://${folderPath}/${filename}`,
          url,
          filename,
          name,
          folder: folderPath.split('/').pop(),
        });
      }

      return images.sort((a, b) => a.name.localeCompare(b.name));
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },

    selectImage(image) {
      this.$emit('select', image.path);
      this.close();
    },
  },
};
</script>

<style lang="sass" scoped>
// Modal backdrop
.modal-backdrop
  position: fixed
  inset: 0
  background: rgba(0, 0, 0, 0.6)
  backdrop-filter: blur(8px)
  -webkit-backdrop-filter: blur(8px)
  display: flex
  align-items: center
  justify-content: center
  z-index: 2000
  padding: 20px

// Modal content
.modal-content
  border-radius: 16px
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5)
  border: 2px solid var(--accent)
  max-width: 800px
  width: 100%
  max-height: 90vh
  display: flex
  flex-direction: column
  overflow: hidden

// Modal header
.modal-header
  display: flex
  justify-content: space-between
  align-items: center
  padding: 8px 15px
  background: var(--accent)
  color: white
  flex-shrink: 0
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15)

  h3
    margin: 0
    font-size: 18px
    font-weight: 600

.close-btn
  width: 40px
  height: 40px
  border: none
  border-radius: 8px
  background: transparent
  color: white
  cursor: pointer
  display: flex
  align-items: center
  justify-content: center
  transition: opacity 0.2s
  padding: 0

  &:hover
    opacity: 0.8

// Modal body
.modal-body
  flex: 1
  overflow-y: auto
  padding: 24px

// Images grid
.images-grid
  display: grid
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))
  gap: 16px

  &.particles-grid
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr))

// Image card
.image-card
  cursor: pointer
  border-radius: 12px
  overflow: hidden
  transition: all 0.2s
  border: 2px solid transparent

  &:hover
    transform: translateY(-2px)
    border-color: var(--accent)

    .image-overlay::before
      background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, transparent 100%)

.image-preview
  width: 100%
  aspect-ratio: 16 / 9
  background-size: cover
  background-position: center
  background-color: rgba(128, 128, 128, 0.08)
  position: relative

  &.particle-preview
    aspect-ratio: 1 / 1
    background-size: contain
    background-repeat: no-repeat

.image-overlay
  position: absolute
  bottom: 0
  left: 0
  right: 0
  padding: 20px 12px 8px 12px
  display: flex
  justify-content: center
  align-items: flex-end
  border-bottom-left-radius: 10px
  border-bottom-right-radius: 10px
  transition: all 0.2s

  &::before
    content: ''
    position: absolute
    inset: 0
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%)
    backdrop-filter: blur(20px)
    -webkit-backdrop-filter: blur(20px)
    mask-image: linear-gradient(to top, black 0%, black 50%, transparent 100%)
    -webkit-mask-image: linear-gradient(to top, black 0%, black 50%, transparent 100%)
    border-bottom-left-radius: 10px
    border-bottom-right-radius: 10px
    z-index: 0

.image-name
  color: white
  font-size: 14px
  font-weight: 600
  text-align: center
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5)
  position: relative
  z-index: 1

// Empty state
.empty-state
  text-align: center
  padding: 60px 20px
  color: var(--secondary)
  font-size: 14px

// Modal transitions
.modal-enter-active,
.modal-leave-active
  transition: opacity 0.3s

  .modal-content
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)

.modal-enter-from,
.modal-leave-to
  opacity: 0

  .modal-content
    transform: scale(0.9)
    opacity: 0
</style>
