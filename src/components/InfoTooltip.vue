<template>
  <div class="info-tooltip-wrapper">
    <div
      class="info-icon"
      tabindex="0"
      role="button"
      aria-label="More information"
      @mouseenter="showTooltip"
      @mouseleave="hideTooltip"
      @focus="showTooltip"
      @blur="hideTooltip"
      @click="toggleTooltip"
    >
      <slot name="trigger">
        <font-awesome-icon :icon="icon" />
      </slot>
    </div>
    <teleport to="body">
      <div v-if="isVisible" ref="tooltip" class="info-tooltip" :style="tooltipStyle">
        <slot />
      </div>
    </teleport>
  </div>
</template>

<script>
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

export default {
  props: {
    icon: {
      type: Object,
      default: () => faInfoCircle,
    },
  },
  data() {
    return {
      isVisible: false,
      tooltipStyle: {},
    };
  },
  methods: {
    showTooltip(event) {
      this.isVisible = true;
      this.$nextTick(() => {
        const rect = event.currentTarget.getBoundingClientRect();
        const tooltip = this.$refs.tooltip;

        if (tooltip) {
          const tooltipWidth = tooltip.offsetWidth;
          const tooltipHeight = tooltip.offsetHeight;

          let left = rect.left + rect.width / 2 - tooltipWidth / 2;
          let top = rect.top - tooltipHeight - 8;

          // Keep within viewport
          if (left < 10) left = 10;
          if (left + tooltipWidth > window.innerWidth - 10) {
            left = window.innerWidth - tooltipWidth - 10;
          }
          if (top < 10) top = rect.bottom + 8; // flip to bottom if no room above

          // Get current accent color from CSS variables
          const accentColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--accent')
            .trim();

          this.tooltipStyle = {
            left: `${left}px`,
            top: `${top}px`,
            background: accentColor,
            borderColor: accentColor,
          };
        }
      });
    },
    hideTooltip() {
      this.isVisible = false;
    },
    toggleTooltip(event) {
      if (this.isVisible) {
        this.hideTooltip();
      } else {
        this.showTooltip(event);
      }
    },
  },
};
</script>

<style lang="sass" scoped>
.info-tooltip-wrapper
  display: inline-flex
  align-items: center

.info-icon
  color: currentColor
  opacity: 0.9
  cursor: help
  transition: opacity 0.2s
  display: flex
  align-items: center

  &:hover
    opacity: 1

.info-tooltip
  position: fixed
  max-width: 200px
  width: max-content
  padding: 10px 12px
  background: rgba(0, 0, 0, 0.95)
  color: white
  border: 1px solid rgba(255, 255, 255, 0.1)
  border-radius: 8px
  font-size: 12px
  line-height: 1.5
  z-index: 100000
  pointer-events: none
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4)
</style>
