<template>
  <div
    class="theme-card"
    @click="$emit('click', theme)"
  >
    <div class="theme-thumbnail">
      <img
        v-if="headerImage"
        :src="headerImage"
        :alt="theme.metadata.name"
        class="header-image"
      />
      <div v-else class="color-split">
        <div class="accent-half" :style="{ background: accent }"></div>
        <div class="background-half" :style="{ background: background }"></div>
      </div>

      <div class="theme-info-overlay">
        <div class="theme-text">
          <div class="theme-name">{{ theme.metadata.name }}</div>
          <div class="theme-author">{{ theme.metadata.author }}</div>
        </div>
        <div class="theme-icons">
          <info-tooltip v-if="theme.seasonal?.dates" :icon="icons.faCalendar" @click.stop>
            {{ seasonalDateRange }}
          </info-tooltip>
          <info-tooltip v-if="theme.metadata?.description" @click.stop>
            {{ theme.metadata.description }}
          </info-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InfoTooltip from '@/components/InfoTooltip.vue';
import { formatDateRange, fallbackTheme } from '@/utils/themes';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

export default {
  components: {
    InfoTooltip,
  },
  props: {
    theme: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      icons: { faCalendar },
    };
  },
  computed: {
    headerImage() {
      const fullImage = this.theme.styling?.header?.image?.full;
      if (!fullImage) return null;

      if (fullImage.startsWith('assets://')) {
        return fullImage.replace('assets://', '/src/themes/assets/');
      }
      return fullImage;
    },
    accent() {
      const fallback = fallbackTheme(this.theme);
      return this.theme.styling?.accent || fallback.styling.accent;
    },
    background() {
      const fallback = fallbackTheme(this.theme);
      return this.theme.styling?.background || fallback.styling.background;
    },
    seasonalDateRange() {
      if (!this.theme.seasonal?.dates) return '';
      return formatDateRange(this.theme.seasonal.dates);
    },
  },
};
</script>

<style lang="sass" scoped>
.theme-card
  cursor: pointer
  border-radius: 12px
  overflow: visible
  transition: all 0.2s ease
  border: 2px solid transparent

  &:hover
    transform: translateY(-2px)

    .theme-thumbnail
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25)

.theme-thumbnail
  width: 100%
  aspect-ratio: 16 / 9
  overflow: visible
  position: relative
  border-radius: 12px
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15)
  transition: all 0.2s ease

  .header-image
    width: 100%
    height: 100%
    object-fit: cover
    border-radius: 12px

  .color-split
    width: 100%
    height: 100%
    display: flex
    border-radius: 12px
    overflow: hidden

    .accent-half,
    .background-half
      flex: 1
      height: 100%

  .theme-info-overlay
    position: absolute
    bottom: 0
    left: 0
    right: 0
    padding: 30px 10px 8px 10px
    color: white
    display: flex
    justify-content: space-between
    align-items: flex-end
    border-bottom-left-radius: 12px
    border-bottom-right-radius: 12px

    &::before
      content: ''
      position: absolute
      bottom: 0
      left: 0
      right: 0
      height: 100%
      background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, transparent 100%)
      backdrop-filter: blur(8px)
      mask-image: linear-gradient(to top, black 0%, black 50%, transparent 100%)
      -webkit-mask-image: linear-gradient(to top, black 0%, black 50%, transparent 100%)
      border-bottom-left-radius: 12px
      border-bottom-right-radius: 12px
      z-index: 0

    .theme-text
      flex: 1
      text-align: left
      position: relative
      z-index: 1

      .theme-name
        font-weight: 700
        font-size: 14px
        line-height: 1.3
        margin-bottom: 2px

      .theme-author
        font-size: 11px
        opacity: 0.9
        font-weight: 400

    .theme-icons
      display: flex
      gap: 6px
      flex-shrink: 0
      position: relative
      z-index: 1

    :deep(.info-tooltip-wrapper)
      .info-icon
        color: white
</style>
