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

          <!-- Customization Section -->
          <section class="customization-section">
            <div class="presets-header">
              <h3>Customize</h3>
            </div>

            <div class="customization-content">
              <!-- Base Theme Toggle & Accent Color -->
              <div class="primary-controls">
                <div class="accent-control">
                  <color-picker label="Accent" v-model="customTheme.styling.accent" property-path="accent" @update:modelValue="applyTheme" />
                </div>
                <div class="controls-right">
                  <info-tooltip>
                    <template #trigger>
                      <icon-button @click="customTheme.styling.base = customTheme.styling.base === 'light' ? 'dark' : 'light'; applyTheme()">
                        <svg v-if="customTheme.styling.base === 'light'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <circle cx="12" cy="12" r="5"></circle>
                          <line x1="12" y1="1" x2="12" y2="3"></line>
                          <line x1="12" y1="21" x2="12" y2="23"></line>
                          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                          <line x1="1" y1="12" x2="3" y2="12"></line>
                          <line x1="21" y1="12" x2="23" y2="12"></line>
                          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                        </svg>
                      </icon-button>
                    </template>
                    Base Style
                  </info-tooltip>
                  <info-tooltip>
                    <template #trigger>
                      <icon-button @click="importTheme">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                      </icon-button>
                    </template>
                    Import Theme
                  </info-tooltip>
                  <info-tooltip>
                    <template #trigger>
                      <icon-button @click="exportTheme">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                      </icon-button>
                    </template>
                    Export Theme
                  </info-tooltip>
                  <info-tooltip>
                    <template #trigger>
                      <icon-button :disabled="true">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                          <polyline points="17 21 17 13 7 13 7 21"></polyline>
                          <polyline points="7 3 7 8 15 8"></polyline>
                        </svg>
                      </icon-button>
                    </template>
                    Save Theme
                  </info-tooltip>
                </div>
              </div>

              <!-- View More Toggle -->
              <div v-if="!advancedExpanded" style="text-align: center; margin-top: 16px;">
                <liquid-glass-button
                  @click="advancedExpanded = true"
                >
                  View More
                </liquid-glass-button>
              </div>

              <!-- Advanced Sections -->
              <transition name="expand">
                <div v-show="advancedExpanded" class="advanced-sections">
                  <!-- Background -->
                  <collapsible-section title="Background" v-model="colorsExpanded">
                    <div class="field-compact">
                      <color-picker label="Background" v-model="customTheme.styling.background" property-path="background" @update:modelValue="applyTheme" />
                    </div>
                    <div class="field-compact">
                      <color-picker label="Secondary Background" v-model="customTheme.styling.secondaryBackground" property-path="secondaryBackground" @update:modelValue="applyTheme" />
                    </div>
                  </collapsible-section>

              <!-- Text Colors -->
              <collapsible-section title="Text" v-model="textExpanded">
                <div class="field-compact">
                  <color-picker label="Primary" v-model="customTheme.styling.text.primary" property-path="text.primary" @update:modelValue="applyTheme" />
                </div>
                <div class="field-compact">
                  <color-picker label="Secondary" v-model="customTheme.styling.text.secondary" property-path="text.secondary" @update:modelValue="applyTheme" />
                </div>
                <div class="field-compact">
                  <color-picker label="Tertiary" v-model="customTheme.styling.text.tertiary" property-path="text.tertiary" @update:modelValue="applyTheme" />
                </div>
              </collapsible-section>

              <!-- Header -->
              <collapsible-section title="Header" v-model="headerExpanded">
                <div class="field-compact">
                  <color-picker label="Background" v-model="customTheme.styling.header.background" property-path="header.background" @update:modelValue="applyTheme" />
                </div>
                <div class="field-compact">
                  <color-picker label="Schedule Bar" v-model="customTheme.styling.header.scheduleBar" property-path="header.scheduleBar" @update:modelValue="applyTheme" />
                </div>
                <div class="image-uploads-row">
                  <image-upload label="Full" v-model="headerImageFull" :min-aspect-ratio="1.5" @blur="applyTheme" />
                  <image-upload label="Mobile" v-model="headerImageMobile" :min-aspect-ratio="1.5" @blur="applyTheme" />
                </div>
              </collapsible-section>

              <!-- Icon Cards -->
              <collapsible-section title="Icon Cards" v-model="iconCardsExpanded">
                <div class="field-compact">
                  <color-picker label="Regular" v-model="customTheme.styling.iconCards.regular" property-path="iconCards.regular" @update:modelValue="applyTheme" />
                </div>
                <div class="field-compact">
                  <color-picker label="Invert" v-model="customTheme.styling.iconCards.invert" property-path="iconCards.invert" @update:modelValue="applyTheme" />
                </div>
              </collapsible-section>

              <!-- Particles -->
              <collapsible-section title="Particles" v-model="particlesExpanded" :disabled="!particlesEnabled">
                <template #action>
                  <checkbox v-model="particlesEnabled" />
                </template>
                <template v-if="particlesEnabled">
                  <slider-input
                    label="Speed"
                    v-model="customTheme.styling.particles.speed"
                    :min="0"
                    :max="5"
                    :step="0.1"
                    @update:modelValue="applyTheme"
                  />
                  <slider-input
                    label="Count"
                    v-model="customTheme.styling.particles.count"
                    :min="0"
                    :max="100"
                    :step="1"
                    @update:modelValue="applyTheme"
                  />
                  <slider-input
                    label="Size"
                    v-model="customTheme.styling.particles.size"
                    :min="0"
                    :max="50"
                    :step="1"
                    @update:modelValue="applyTheme"
                  />
                  <slider-input
                    label="Opacity"
                    v-model="customTheme.styling.particles.opacity"
                    :min="0"
                    :max="1"
                    :step="0.01"
                    @update:modelValue="applyTheme"
                  />
                  <slider-input
                    label="Wind"
                    v-model="customTheme.styling.particles.windPower"
                    :min="-5"
                    :max="5"
                    :step="0.1"
                    @update:modelValue="applyTheme"
                  />

                  <!-- Particle Images -->
                  <div class="particle-images-section">
                    <label class="section-label">Images</label>
                    <div class="particle-images-list">
                      <image-upload
                        v-for="(image, index) in particleImages"
                        :key="`particle-${index}-${image}`"
                        :model-value="image"
                        :asset-folder="'particles'"
                        :min-aspect-ratio="0"
                        @update:modelValue="updateParticleImage(index, $event)"
                        @blur="applyTheme"
                      />
                    </div>
                  </div>
                </template>
              </collapsible-section>

              <!-- View Less Button -->
              <div style="text-align: center; margin-top: 16px;">
                <liquid-glass-button
                  @click="advancedExpanded = false"
                >
                  View Less
                </liquid-glass-button>
              </div>
                </div>
              </transition>
            </div>
          </section>
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
import { toRaw } from 'vue';
import Home from '@/views/Home/Home.vue';
import ThemeCard from '@/components/ThemeCard.vue';
import ColorPicker from '@/components/ColorPicker.vue';
import InfoTooltip from '@/components/InfoTooltip.vue';
import IconButton from '@/components/IconButton.vue';
import LiquidGlassButton from '@/components/LiquidGlassButton.vue';
import Checkbox from '@/components/Checkbox.vue';
import CollapsibleSection from '@/components/CollapsibleSection.vue';
import SliderInput from '@/components/SliderInput.vue';
import ImageUpload from '@/components/ImageUpload.vue';
import useThemeStore from '@/stores/themes';
import useClockStore from '@/stores/clock';
import { parseDateRange, isDateInRange, loadAllThemes } from '@/utils/themes';
import lightTheme from '@/themes/light.json';
import { cleanupOrphanedImages } from '@/utils/imageStorage';

export default {
  components: {
    Home,
    ThemeCard,
    ColorPicker,
    InfoTooltip,
    IconButton,
    LiquidGlassButton,
    Checkbox,
    CollapsibleSection,
    SliderInput,
    ImageUpload,
  },
  data() {
    // Initialize from store's current theme, not light.json
    const store = useThemeStore();
    const storeStyling = toRaw(store.styling); // Extract raw object from Proxy
    const currentStyling = structuredClone(storeStyling);

    const theme = {
      metadata: lightTheme.metadata,
      visibility: lightTheme.visibility,
      styling: currentStyling,
    };

    // Ensure nested objects exist for v-model binding
    if (!theme.styling.text) theme.styling.text = {};
    if (!theme.styling.header) theme.styling.header = {};
    if (!theme.styling.iconCards) theme.styling.iconCards = {};

    return {
      panelOpen: true,
      customTheme: theme,
      previewHeight: '',
      themes: [],
      presetsExpanded: true,
      otherThemesExpanded: false,
      colorsExpanded: false,
      textExpanded: false,
      headerExpanded: false,
      iconCardsExpanded: false,
      particlesExpanded: false,
      advancedExpanded: false,
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
        if (value) {
          if (!this.customTheme.styling.particles) {
            this.customTheme.styling.particles = {
              images: [],
              speed: 1,
              count: 20,
              size: 10,
              opacity: 0.8,
              windPower: 0,
            };
          }
        } else {
          delete this.customTheme.styling.particles;
          this.particlesExpanded = false;
        }
        this.applyTheme();
      },
    },

    particleImages() {
      const images = this.customTheme.styling.particles?.images || [];
      // Always ensure there's a trailing empty slot
      if (images.length === 0 || images[images.length - 1] !== '') {
        return [...images, ''];
      }
      return images;
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

    async loadTheme(theme) {
      // Ensure nested objects exist even if empty
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
            particles: {
              ...theme.styling.particles,
              images: [...(theme.styling.particles.images || [])]
            }
          })
        }
      };
      this.applyTheme();

      // Clean up images not referenced in the new theme
      await cleanupOrphanedImages(this.customTheme.styling);
    },

    applyTheme() {
      this.setStyling(this.customTheme.styling);
    },

    updateParticleImage(index, value) {
      if (!this.customTheme.styling.particles) {
        this.customTheme.styling.particles = {
          images: [],
          speed: 1,
          count: 20,
          size: 10,
          opacity: 0.8,
          windPower: 0,
        };
      }
      if (!this.customTheme.styling.particles.images) {
        this.customTheme.styling.particles.images = [];
      }

      // If updating the trailing empty slot with a value, add it to the array
      if (index === this.customTheme.styling.particles.images.length) {
        this.customTheme.styling.particles.images.push(value);
      } else {
        this.customTheme.styling.particles.images[index] = value;
      }

      // Use nextTick to ensure the update has been processed before cleanup
      this.$nextTick(() => {
        this.cleanupEmptyParticleImages();
      });
    },

    cleanupEmptyParticleImages() {
      if (!this.customTheme.styling.particles?.images) return;

      const images = this.customTheme.styling.particles.images;
      const indicesToRemove = [];

      // Find all empty images
      for (let i = 0; i < images.length; i++) {
        if (!images[i] || images[i].trim() === '') {
          indicesToRemove.push(i);
        }
      }

      // Remove all empty images (the computed property will add a trailing one)
      for (let i = indicesToRemove.length - 1; i >= 0; i--) {
        images.splice(indicesToRemove[i], 1);
      }
    },

    importTheme() {
      // hidden file input
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';

      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
          const text = await file.text();
          const importedTheme = JSON.parse(text);

          // Only import the styling field
          if (importedTheme.styling) {
            // Merge with current theme structure, but only use imported styling
            this.customTheme.styling = {
              base: importedTheme.styling?.base || 'light',
              background: importedTheme.styling?.background,
              secondaryBackground: importedTheme.styling?.secondaryBackground,
              accent: importedTheme.styling?.accent,
              text: {
                primary: importedTheme.styling?.text?.primary,
                secondary: importedTheme.styling?.text?.secondary,
                tertiary: importedTheme.styling?.text?.tertiary,
              },
              header: {
                background: importedTheme.styling?.header?.background,
                scheduleBar: importedTheme.styling?.header?.scheduleBar,
                ...(importedTheme.styling?.header?.image && {
                  image: { ...importedTheme.styling.header.image }
                })
              },
              iconCards: {
                regular: importedTheme.styling?.iconCards?.regular,
                invert: importedTheme.styling?.iconCards?.invert,
              },
              ...(importedTheme.styling?.particles && {
                particles: {
                  ...importedTheme.styling.particles,
                  images: [...(importedTheme.styling.particles.images || [])]
                }
              })
            };

            this.applyTheme();
            await cleanupOrphanedImages(this.customTheme.styling);
          } else {
            console.error('No styling field found in imported theme');
          }
        } catch (err) {
          console.error('Failed to import theme:', err);
          alert('Failed to import theme. Please check the file format.');
        }
      };

      input.click();
    },

    exportTheme() {
      // Create export object with custom metadata
      const exportData = {
        metadata: {
          name: 'Custom Theme',
          author: 'Unknown Artist',
        },
        styling: this.customTheme.styling,
      };

      const json = JSON.stringify(exportData, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'custom-theme.json';
      a.click();
      URL.revokeObjectURL(url);
    },

    setPreviewHeight() {
      const { offsetTop } = this.$refs.preview;
      const marginBottom = 20;
      this.previewHeight = `calc(100vh - ${offsetTop}px - ${marginBottom}px)`;
    },
  },
  async mounted() {
    this.loadThemes();
    this.$nextTick(() => {
      this.setPreviewHeight();
    });

    // Clean up orphaned images on mount
    await cleanupOrphanedImages(this.customTheme.styling);
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
  scrollbar-gutter: stable

.presets-section
  margin-bottom: 25px
  padding-bottom: 20px
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

.customization-section
  margin-bottom: 25px

.customization-content
  padding-top: 8px

.primary-controls
  display: flex
  gap: 16px
  padding: 0 0 20px 0
  margin-bottom: 20px
  border-bottom: 1px solid rgba(128, 128, 128, 0.08)
  align-items: flex-end

.accent-control
  flex: 1

.controls-right
  display: grid
  grid-template-columns: repeat(2, 1fr)
  gap: 6px
  flex-shrink: 0

.advanced-sections
  margin-top: 16px

:deep(.collapsible-section)
  .header-action .checkbox-container
    margin-top: 0

.image-uploads-row
  display: flex
  gap: 16px
  margin-bottom: 12px

  &:last-child
    margin-bottom: 0

.field-compact
  margin-bottom: 12px

  &:last-child
    margin-bottom: 0

// Particle Images Section
.particle-images-section
  margin-top: 16px

  .section-label
    display: block
    font-size: 13px
    font-weight: 500
    color: var(--secondary)
    text-transform: uppercase
    letter-spacing: 0.5px
    margin-bottom: 12px

.particle-images-list
  display: grid
  grid-template-columns: repeat(2, 1fr)
  gap: 16px

  label
    display: block
    margin-bottom: 6px
    color: var(--secondary)
    font-weight: 500
    font-size: 11px

  input[type="text"],
  input[type="number"],
  select,
  textarea
    width: 100%
    padding: 6px 8px
    border: 1px solid rgba(128, 128, 128, 0.2)
    border-radius: 6px
    background: var(--background)
    color: var(--primary)
    font-size: 12px
    box-sizing: border-box
    transition: border-color 0.2s ease

    &:focus
      outline: none
      border-color: var(--accent)

  textarea
    min-height: 50px
    resize: vertical
    font-family: monospace
    font-size: 10px

  .checkbox-label
    display: flex
    align-items: center
    gap: 6px
    cursor: pointer
    font-size: 12px

    input[type="checkbox"]
      width: 16px
      height: 16px
      cursor: pointer

.section
  margin-bottom: 20px

  h3
    margin: 0 0 10px 0
    color: var(--accent)
    font-size: 14px
    border-bottom: 1px solid rgba(128, 128, 128, 0.2)
    padding-bottom: 6px
    font-weight: 600

  select
    width: 100%
    padding: 8px
    border: 1px solid var(--accent)
    border-radius: 4px
    background: var(--background)
    color: var(--primary)
    font-size: 13px

.field
  margin-bottom: 10px

  label
    display: block
    margin-bottom: 6px
    color: var(--secondary)
    font-weight: 500
    font-size: 12px

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
