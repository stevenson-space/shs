<template>
  <div class="theme-page">
    <!-- Slide-in customization panel from LEFT -->
    <transition name="slide">
      <div v-if="panelOpen" class="customization-panel">
        <div class="panel-header">
          <h2>Customize Theme</h2>
          <button @click="panelOpen = false" class="close-btn">&times;</button>
        </div>

        <div class="panel-content">
          <!-- Theme Presets at top -->
          <section class="presets-section">
            <div class="presets-header">
              <h3>Presets</h3>
            </div>
            <div class="themes-container">
                <!-- Recommended Section -->
                <div class="theme-subsection">
                  <h4 class="subsection-title">Recommended</h4>
                  <div class="theme-grid">
                    <theme-card
                      v-for="(theme, index) in recommendedThemes"
                      :key="'rec-' + index"
                      :theme="theme"
                      @click="loadTheme(theme)"
                    />
                  </div>
                </div>

                <!-- View More Button -->
                <div style="text-align: center;">
                  <liquid-glass-button
                    v-if="!otherThemesExpanded"
                    @click="otherThemesExpanded = true"
                  >
                    View More
                  </liquid-glass-button>
                </div>

                <!-- Other Themes Section -->
                <transition name="expand">
                  <div v-show="otherThemesExpanded" class="expanded-themes">
                    <h4 class="subsection-title">Other</h4>
                    <div class="theme-grid">
                      <theme-card
                        v-for="(theme, index) in otherThemes"
                        :key="'other-' + index"
                        :theme="theme"
                        @click="loadTheme(theme)"
                      />
                    </div>

                    <!-- Seasonal Section -->
                    <div class="theme-subsection">
                      <h4 class="subsection-title">Seasonal</h4>
                      <div class="theme-grid">
                        <theme-card
                          v-for="(theme, index) in seasonalThemes"
                          :key="'seasonal-' + index"
                          :theme="theme"
                          @click="loadTheme(theme)"
                        />
                      </div>
                    </div>

                    <!-- View Less Button -->
                    <div style="text-align: center;">
                      <liquid-glass-button
                        @click="otherThemesExpanded = false"
                      >
                        View Less
                      </liquid-glass-button>
                    </div>
                  </div>
                </transition>
            </div>
          </section>

          <!-- Base Theme Selection -->
          <section class="section">
            <h3>Base Theme</h3>
            <div class="field">
              <label>Inherit From</label>
              <select v-model="customTheme.styling.base" @change="applyTheme">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </section>

          <!-- Styling customization -->
          <section class="section">
            <h3>Colors</h3>

            <div class="field">
              <label>Accent Color</label>
              <color-picker v-model="customTheme.styling.accent" property-path="accent" @update:modelValue="applyTheme" />
            </div>

            <div class="field">
              <label>Background</label>
              <color-picker v-model="customTheme.styling.background" property-path="background" @update:modelValue="applyTheme" />
            </div>

            <div class="field">
              <label>Secondary Background</label>
              <color-picker v-model="customTheme.styling.secondaryBackground" property-path="secondaryBackground" @update:modelValue="applyTheme" />
            </div>
          </section>

          <!-- Text Colors -->
          <section class="section">
            <h3>Text Colors</h3>

            <div class="field">
              <label>Primary Text</label>
              <color-picker v-model="customTheme.styling.text.primary" property-path="text.primary" @update:modelValue="applyTheme" />
            </div>

            <div class="field">
              <label>Secondary Text</label>
              <color-picker v-model="customTheme.styling.text.secondary" property-path="text.secondary" @update:modelValue="applyTheme" />
            </div>

            <div class="field">
              <label>Tertiary Text</label>
              <color-picker v-model="customTheme.styling.text.tertiary" property-path="text.tertiary" @update:modelValue="applyTheme" />
            </div>
          </section>

          <!-- Header -->
          <section class="section">
            <h3>Header</h3>

            <div class="field">
              <label>Header Background</label>
              <color-picker v-model="customTheme.styling.header.background" property-path="header.background" @update:modelValue="applyTheme" />
            </div>

            <div class="field">
              <label>Schedule Bar</label>
              <color-picker v-model="customTheme.styling.header.scheduleBar" property-path="header.scheduleBar" @update:modelValue="applyTheme" />
            </div>

            <div class="field">
              <label>Header Image (Full)</label>
              <input v-model="headerImageFull" type="text" placeholder="assets://header-images/..." @blur="applyTheme" />
            </div>

            <div class="field">
              <label>Header Image (Mobile)</label>
              <input v-model="headerImageMobile" type="text" placeholder="assets://header-images/..." @blur="applyTheme" />
            </div>
          </section>

          <!-- Icon Cards -->
          <section class="section">
            <h3>Icon Cards</h3>

            <div class="field">
              <label>Regular</label>
              <color-picker v-model="customTheme.styling.iconCards.regular" property-path="iconCards.regular" @update:modelValue="applyTheme" />
            </div>

            <div class="field">
              <label>Invert</label>
              <color-picker v-model="customTheme.styling.iconCards.invert" property-path="iconCards.invert" @update:modelValue="applyTheme" />
            </div>
          </section>

          <!-- Particles -->
          <section class="section">
            <h3>Particles</h3>

            <div class="field">
              <label class="checkbox-label">
                <input v-model="particlesEnabled" type="checkbox" @change="applyTheme" />
                <span>Enable Particles</span>
              </label>
            </div>

            <template v-if="particlesEnabled">
              <div class="field">
                <label>Speed</label>
                <input v-model.number="customTheme.styling.particles.speed" type="number" step="0.1" min="0" @blur="applyTheme" />
              </div>

              <div class="field">
                <label>Count</label>
                <input v-model.number="customTheme.styling.particles.count" type="number" min="0" @blur="applyTheme" />
              </div>

              <div class="field">
                <label>Size</label>
                <input v-model.number="customTheme.styling.particles.size" type="number" min="0" @blur="applyTheme" />
              </div>

              <div class="field">
                <label>Opacity</label>
                <input v-model.number="customTheme.styling.particles.opacity" type="number" step="0.1" min="0" max="1" @blur="applyTheme" />
              </div>

              <div class="field">
                <label>Wind Power</label>
                <input v-model.number="customTheme.styling.particles.windPower" type="number" step="0.1" @blur="applyTheme" />
              </div>

              <div class="field">
                <label class="checkbox-label">
                  <input v-model="customTheme.styling.particles.interaction" type="checkbox" @change="applyTheme" />
                  <span>Interaction</span>
                </label>
              </div>

              <div class="field">
                <label>Images (comma-separated)</label>
                <textarea v-model="particleImagesText" placeholder="assets://particles/image1.png" @blur="applyTheme"></textarea>
              </div>
            </template>
          </section>

          <!-- Actions -->
          <div class="actions">
            <button @click="exportTheme" class="export-btn">Export JSON</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Toggle button -->
    <button @click="panelOpen = !panelOpen" class="toggle-panel-btn">
      {{ panelOpen ? '×' : '🎨' }}
    </button>

    <!-- Home preview (non-interactive) -->
    <div ref="preview" class="preview" :style="{ height: previewHeight }">
      <div class="wrapper">
        <home />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import Home from '@/views/Home/Home.vue';
import ThemeCard from '@/components/ThemeCard.vue';
import ColorPicker from '@/components/ColorPicker.vue';
import useThemeStore from '@/stores/themes';
import useClockStore from '@/stores/clock';
import { fallbackStyling, parseDateRange, isDateInRange, loadAllThemes } from '@/utils/themes';
import lightTheme from '@/themes/base/light.json';

export default {
  components: {
    Home,
    ThemeCard,
    ColorPicker,
  },
  data() {
    return {
      panelOpen: true,
      customTheme: structuredClone(lightTheme),
      previewHeight: '',
      themes: [],
      presetsExpanded: true,
      otherThemesExpanded: false,
    };
  },
  computed: {
    ...mapState(useClockStore, ['date']),
    recommendedThemes() {
      const now = this.date;

      const recommended = this.themes.filter(t => {
        if (t.recommended !== undefined) {
          if (t.recommended === 'never') return false;
          if (t.recommended === 'always') return true;

          const [start, end] = parseDateRange(t.recommended, now);
          if (isDateInRange(now, start, end)) return true;
        }

        // Seasonal themes are recommended during their active dates (unless recommended: "never")
        if (t.seasonal?.dates) {
          const [start, end] = parseDateRange(t.seasonal.dates, now);
          return isDateInRange(now, start, end);
        }

        return false;
      });

      // Sort: explicitly recommended first, seasonal-only at the end
      return recommended.sort((a, b) => {
        const aHasRecommended = a.recommended !== undefined;
        const bHasRecommended = b.recommended !== undefined;
        const aIsSeasonalOnly = !aHasRecommended && a.seasonal?.dates;
        const bIsSeasonalOnly = !bHasRecommended && b.seasonal?.dates;

        if (aIsSeasonalOnly && !bIsSeasonalOnly) return 1;
        if (!aIsSeasonalOnly && bIsSeasonalOnly) return -1;
        return 0;
      });
    },

    otherThemes() {
      const recommended = new Set(this.recommendedThemes.map(t => t.metadata.name));
      return this.themes.filter(t => !recommended.has(t.metadata.name) && !t.seasonal?.dates);
    },

    seasonalThemes() {
      const now = this.date;
      const activeSeasonalNames = new Set(
        this.recommendedThemes.filter(t => t.seasonal?.dates).map(t => t.metadata.name)
      );
      return this.themes.filter(t => {
        if (!t.seasonal?.dates || activeSeasonalNames.has(t.metadata.name)) return false;

        // Filter out limited time themes that are outside their date range
        if (t.seasonal?.limitedTime) {
          const [start, end] = parseDateRange(t.seasonal.dates, now);
          return isDateInRange(now, start, end);
        }

        return true;
      });
    },

    particlesEnabled: {
      get() {
        return !!this.customTheme.styling.particles;
      },
      set(value) {
        if (value && !this.customTheme.styling.particles) {
          this.customTheme.styling.particles = {
            images: [],
            speed: 1,
            count: 20,
            size: 10,
            opacity: 0.8,
            windPower: 0,
            interaction: false,
          };
        } else if (!value) {
          delete this.customTheme.styling.particles;
        }
      },
    },
    particleImagesText: {
      get() {
        return this.customTheme.styling.particles?.images?.join(', ') || '';
      },
      set(value) {
        if (this.customTheme.styling.particles) {
          this.customTheme.styling.particles.images = value
            .split(',')
            .map(s => s.trim())
            .filter(s => s);
        }
      },
    },
    headerImageFull: {
      get() {
        return this.customTheme.styling.header.image?.full || '';
      },
      set(value) {
        if (!this.customTheme.styling.header.image) {
          this.customTheme.styling.header.image = {};
        }
        this.customTheme.styling.header.image.full = value || undefined;
        if (!value && !this.customTheme.styling.header.image.mobile) {
          delete this.customTheme.styling.header.image;
        }
      },
    },
    headerImageMobile: {
      get() {
        return this.customTheme.styling.header.image?.mobile || '';
      },
      set(value) {
        if (!this.customTheme.styling.header.image) {
          this.customTheme.styling.header.image = {};
        }
        this.customTheme.styling.header.image.mobile = value || undefined;
        if (!value && !this.customTheme.styling.header.image.full) {
          delete this.customTheme.styling.header.image;
        }
      },
    },
  },
  methods: {
    ...mapActions(useThemeStore, ['setStyling']),

    async loadThemes() {
      this.themes = await loadAllThemes();
    },

    loadTheme(theme) {
      const fallback = fallbackStyling(theme.styling);

      // Merge theme with fallback for editing
      this.customTheme = {
        metadata: { ...theme.metadata },
        visibility: theme.visibility,
        ...(theme.seasonal && { seasonal: { ...theme.seasonal } }),
        styling: {
          base: theme.styling?.base || 'light',
          background: theme.styling?.background,
          secondaryBackground: theme.styling?.secondaryBackground,
          accent: theme.styling?.accent,
          text: {
            primary: theme.styling?.text?.primary,
            secondary: theme.styling?.text?.secondary,
            tertiary: theme.styling?.text?.tertiary,
          },
          header: {
            background: theme.styling?.header?.background,
            scheduleBar: theme.styling?.header?.scheduleBar,
            ...(theme.styling?.header?.image && {
              image: { ...theme.styling.header.image }
            })
          },
          iconCards: {
            regular: theme.styling?.iconCards?.regular,
            invert: theme.styling?.iconCards?.invert,
          },
          ...(theme.styling?.particles && {
            particles: { ...theme.styling.particles }
          })
        }
      };
      this.applyTheme();
    },

    applyTheme() {
      this.setStyling(this.customTheme.styling);
    },

    exportTheme() {
      const json = JSON.stringify(this.customTheme, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.customTheme.metadata.name.toLowerCase().replace(/\s+/g, '-')}.json`;
      a.click();
      URL.revokeObjectURL(url);
    },

    setPreviewHeight() {
      const { offsetTop } = this.$refs.preview;
      const marginBottom = 20;
      this.previewHeight = `calc(100vh - ${offsetTop}px - ${marginBottom}px)`;
    },
  },
  mounted() {
    this.loadThemes();
    this.$nextTick(() => {
      this.setPreviewHeight();
    });
  },
};
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.theme-page
  min-height: 100vh
  position: relative
  padding-top: 10px

.customization-panel
  position: fixed
  top: 0
  left: 0
  width: min(400px, 90vw)
  height: 100vh
  background: var(--background)
  border-right: 2px solid var(--accent)
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.2)
  z-index: 1000
  display: flex
  flex-direction: column
  overflow: hidden

.panel-header
  display: flex
  justify-content: space-between
  align-items: center
  padding: 8px 15px
  border-bottom: 1px solid var(--accent)
  background: var(--accent)
  color: white
  flex-shrink: 0
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15)

  h2
    margin: 0
    font-size: 18px

  .close-btn
    background: transparent
    border: none
    color: white
    font-size: 36px
    cursor: pointer
    padding: 0
    width: 40px
    height: 40px
    display: flex
    align-items: center
    justify-content: center
    line-height: 1

    &:hover
      opacity: 0.8

.panel-content
  flex: 1
  overflow-y: auto
  padding: 15px

.presets-section
  margin-bottom: 25px
  padding-bottom: 20px
  border-bottom: 2px solid var(--accent)
  position: relative

.presets-header
  position: sticky
  top: -15px
  z-index: 10
  margin: -15px -15px 0 -15px
  padding: 8px 19px
  background: rgba(0, 0, 0, 0.15)
  backdrop-filter: blur(10px)
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)

  h3
    margin: 0
    color: var(--accent)
    font-size: 16px
    user-select: none

.expand-enter-active,
.expand-leave-active
  transition: all 0.3s ease
  overflow: hidden

.expand-enter-from,
.expand-leave-to
  opacity: 0
  max-height: 0

.expand-enter-to,
.expand-leave-from
  opacity: 1
  max-height: 2000px

.themes-container
  padding-top: 15px

.theme-subsection
  margin-bottom: 20px

  &:not(:first-child)
    margin-top: 24px

  .subsection-title
    margin: 0 0 10px 0
    font-size: 13px
    font-weight: 600
    color: var(--secondary)
    text-transform: uppercase
    letter-spacing: 0.5px

.view-more-btn
  padding: 10px 24px
  margin: 0 auto 12px
  border: 1px solid rgba(128, 128, 128, 0.3)
  border-radius: 50px
  background: rgba(255, 255, 255, 0.2)
  backdrop-filter: blur(10px)
  -webkit-backdrop-filter: blur(10px)
  color: var(--secondary)
  font-size: 11px
  font-weight: 600
  text-transform: uppercase
  letter-spacing: 0.5px
  cursor: pointer
  display: inline-flex
  align-items: center
  justify-content: center
  transition: all 0.2s ease
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
  width: auto

  &:hover
    background: rgba(255, 255, 255, 0.3)
    transform: translateY(-1px)
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15)

  &:active
    transform: translateY(0)

.expanded-themes
  .subsection-title
    margin: 0 0 10px 0
    font-size: 13px
    font-weight: 600
    color: var(--secondary)
    text-transform: uppercase
    letter-spacing: 0.5px

  .view-more-btn
    margin-top: 12px
    margin-bottom: 0

.theme-grid
  display: grid
  grid-template-columns: repeat(2, 1fr)
  gap: 10px

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

.section
  margin-bottom: 25px

  h3
    margin: 0 0 12px 0
    color: var(--accent)
    font-size: 16px
    border-bottom: 1px solid var(--accent)
    padding-bottom: 5px

  select
    width: 100%
    padding: 8px
    border: 1px solid var(--accent)
    border-radius: 4px
    background: var(--background)
    color: var(--primary)
    font-size: 13px

.field
  margin-bottom: 12px

  label
    display: block
    margin-bottom: 4px
    color: var(--primary)
    font-weight: 500
    font-size: 13px

  .checkbox-label
    display: flex
    align-items: center
    gap: 8px
    cursor: pointer
    font-weight: 500

    span
      user-select: none

  input[type="text"],
  input[type="number"],
  textarea
    width: 100%
    padding: 6px 8px
    border: 1px solid var(--accent)
    border-radius: 4px
    background: var(--background)
    color: var(--primary)
    font-size: 13px
    box-sizing: border-box

  .color-input-group
    display: flex
    gap: 8px
    align-items: center

    input[type="color"]
      width: 50px
      height: 35px
      border: 1px solid var(--accent)
      border-radius: 4px
      cursor: pointer
      flex-shrink: 0

    .color-text
      flex: 1

  input[type="checkbox"]
    width: 18px
    height: 18px
    cursor: pointer
    flex-shrink: 0

  textarea
    min-height: 60px
    resize: vertical
    font-family: monospace
    font-size: 11px

.actions
  display: flex
  gap: 10px
  padding-top: 15px
  border-top: 1px solid var(--accent)

  button
    flex: 1
    padding: 10px
    border: none
    border-radius: 4px
    cursor: pointer
    font-size: 13px
    font-weight: 600
    transition: all 0.2s

  .export-btn
    background: var(--accent)
    color: white

    &:hover
      opacity: 0.9

.toggle-panel-btn
  position: fixed
  top: 20px
  left: 20px
  width: 50px
  height: 50px
  background: var(--accent)
  color: white
  border: none
  border-radius: 50%
  font-size: 24px
  cursor: pointer
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2)
  z-index: 999
  transition: all 0.3s
  display: flex
  align-items: center
  justify-content: center

  &:hover
    transform: scale(1.1)
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3)

.preview
  width: 80%
  max-width: $content-width
  height: 500px
  overflow: auto
  margin: auto
  margin-top: 10px
  border-radius: 25px
  transition: box-shadow .2s
  min-width: 320px
  +mobile
    width: 90%
    +shadow

  .wrapper
    position: relative
    z-index: 0
    text-decoration: none
    display: block
    color: inherit
    border-radius: 25px
    overflow: hidden

    // This is placed over the Home preview to prevent anything in the preview from being clickable
    &::before
      position: absolute
      height: 100%
      width: 100%
      top: 0
      left: 0
      content: ''
      z-index: 26

// Slide transition from left
.slide-enter-active,
.slide-leave-active
  transition: transform 0.3s ease

.slide-enter-from,
.slide-leave-to
  transform: translateX(-100%)
</style>
