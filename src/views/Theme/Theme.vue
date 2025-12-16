<template>
  <div class="theme-page">
    <transition name="slide">
      <div v-if="panelOpen" class="customization-panel">
        <div class="panel-header">
          <h2 class="title">Customize Theme</h2>
          <div @click="closePanel">
            <font-awesome-icon :icon="icons.faXmark" class="close-btn" />
          </div>
        </div>

        <div class="panel-content">
          <section class="presets-section">
            <div class="presets-header">
              <h3>Presets</h3>
            </div>
            <div class="themes-container">
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
                      <icon-button :disabled="true">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                          <polyline points="17 21 17 13 7 13 7 21"></polyline>
                          <polyline points="7 3 7 8 15 8"></polyline>
                        </svg>
                      </icon-button>
                    </template>
                    Save Theme
                    <br/>
                    (Not implemented)
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
                    <br/>
                    (Images not included)
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
                  <!-- Inheritance Info -->
                  <div class="inheritance-info">
                    <font-awesome-icon :icon="icons.faCircleInfo" />
                    <div>
                      <strong>Color Inheritance:</strong>
                      <span>
                        Some colors copy from other theme colors. To turn off inheritance and specify your own colors, click the link icon until you can edit the color.
                        <br/><br/>
                        The base style button switches between "light" and "dark", which affects the default colors if no color is set for something.
                      </span>
                    </div>
                  </div>

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
  </div>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import { toRaw } from 'vue';
import { faCircleInfo, faXmark } from '@fortawesome/free-solid-svg-icons';
import { parseDateRange, isDateInRange, loadAllThemes } from '@/utils/themes';
import { cleanupOrphanedImages } from '@/utils/imageStorage';
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
import lightTheme from '@/themes/light.json';

export default {
  components: {
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
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close'],
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
      panelOpen: false,
      customTheme: theme,
      themes: [],
      presetsExpanded: true,
      otherThemesExpanded: false,
      colorsExpanded: false,
      textExpanded: false,
      headerExpanded: false,
      iconCardsExpanded: false,
      particlesExpanded: false,
      advancedExpanded: false,
      isApplyingTheme: false, // Flag to prevent infinite loop in styling watcher
      icons: { faCircleInfo, faXmark },
    };
  },
  computed: {
    ...mapState(useClockStore, ['date']),
    ...mapState(useThemeStore, ['styling']),
    recommendedThemes() {
      const now = this.date;

      const recommended = this.themes.filter(t => {
        const timing = t.recommended?.timing;
        if (timing !== undefined && timing !== null) {
          if (timing === 'never') return false;
          if (timing === 'always') return true;

          if (timing === 'season' && t.seasonalDates) {
            const [start, end] = parseDateRange(t.seasonalDates, now);
            return isDateInRange(now, start, end);
          }

          if (typeof timing === 'string' && timing.length > 0) {
            const [start, end] = parseDateRange(timing, now);
            if (isDateInRange(now, start, end)) return true;
          }
        }

        return false;
      });

      return recommended.sort((a, b) => {
        const aIsBase = a.recommended?.timing === 'always' && !a.seasonalDates;
        const bIsBase = b.recommended?.timing === 'always' && !b.seasonalDates;
        const aHasRecommended = a.recommended?.timing !== undefined;
        const bHasRecommended = b.recommended?.timing !== undefined;
        const aIsSeasonalOnly = aHasRecommended && a.recommended?.timing === 'season';
        const bIsSeasonalOnly = bHasRecommended && b.recommended?.timing === 'season';

        // Base themes first
        if (aIsBase && !bIsBase) return -1;
        if (!aIsBase && bIsBase) return 1;

        // Then other explicitly recommended themes
        if (aHasRecommended && !bHasRecommended && !aIsSeasonalOnly && !bIsSeasonalOnly) return -1;
        if (!aHasRecommended && bHasRecommended && !aIsSeasonalOnly && !bIsSeasonalOnly) return 1;

        // Seasonal themes last
        if (aIsSeasonalOnly && !bIsSeasonalOnly) return 1;
        if (!aIsSeasonalOnly && bIsSeasonalOnly) return -1;

        return 0;
      });
    },

    otherThemes() {
      const recommended = new Set(this.recommendedThemes.map(t => t.metadata.name));
      return this.themes.filter(t => !recommended.has(t.metadata.name) && !t.seasonalDates);
    },

    seasonalThemes() {
      const activeSeasonalNames = new Set(
        this.recommendedThemes.filter(t => t.seasonalDates).map(t => t.metadata.name)
      );
      const filtered = this.themes.filter(t => {
        return t.seasonalDates && !activeSeasonalNames.has(t.metadata.name);
      });

      // Sort by start date (descending)
      return filtered.sort((a, b) => {
        const [startA] = parseDateRange(a.seasonalDates, this.date);
        const [startB] = parseDateRange(b.seasonalDates, this.date);
        return startB - startA;
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

    closePanel() {
      this.panelOpen = false;
      this.$emit('close');
    },

    async loadThemes() {
      this.themes = await loadAllThemes();
    },

    async loadTheme(theme) {
      // Ensure nested objects exist even if empty
      this.customTheme = {
        metadata: { ...theme.metadata },
        visibility: theme.visibility,
        ...(theme.recommended && { recommended: { ...theme.recommended } }),
        ...(theme.seasonalDates && { seasonalDates: theme.seasonalDates }),
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
      this.isApplyingTheme = true;
      this.setStyling(this.customTheme.styling);
      this.$nextTick(() => {
        this.isApplyingTheme = false;
      });
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
  },
  watch: {
    open: {
      immediate: true,
      handler(newVal) {
        this.panelOpen = newVal;

        // Reset state when closing
        if (!newVal) {
          this.otherThemesExpanded = false;
          this.colorsExpanded = false;
          this.textExpanded = false;
          this.headerExpanded = false;
          this.iconCardsExpanded = false;
          this.particlesExpanded = false;
          this.advancedExpanded = false;
        }
      },
    },
    styling: {
      deep: true,
      handler(newStyling) {
        // Skip if this update came from our own applyTheme call
        if (this.isApplyingTheme) return;

        // Update customTheme when store's styling changes externally
        // (e.g., from NewThemeCard or ThemeCard clicks)
        if (newStyling && JSON.stringify(newStyling) !== JSON.stringify(this.customTheme.styling)) {
          this.customTheme.styling = structuredClone(toRaw(newStyling));
          // Ensure nested objects exist for v-model binding
          if (!this.customTheme.styling.text) this.customTheme.styling.text = {};
          if (!this.customTheme.styling.header) this.customTheme.styling.header = {};
          if (!this.customTheme.styling.iconCards) this.customTheme.styling.iconCards = {};
        }
      },
    },
  },
  async mounted() {
    this.loadThemes();

    // Clean up orphaned images on mount
    await cleanupOrphanedImages(this.customTheme.styling);
  },
};
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.theme-page
  position: fixed
  top: 0
  left: 0
  width: 0
  height: 0
  pointer-events: none
  z-index: 1000

  // Re-enable pointer events for the panel
  .customization-panel
    pointer-events: auto

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

  +mobile
    width: 100vw
    border-right: none

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

  .title
    margin: 0
    font-size: 18px

  .close-btn
    font-size: 20px
    cursor: pointer !important  
    
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

.expanded-themes
  .subsection-title
    margin: 0 0 10px 0
    font-size: 13px
    font-weight: 600
    color: var(--secondary)
    text-transform: uppercase
    letter-spacing: 0.5px

.theme-grid
  display: grid
  grid-template-columns: repeat(2, 1fr)
  gap: 10px

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

.inheritance-info
  display: flex
  align-items: flex-start
  gap: 12px
  padding: 12px 14px
  background: rgba(128, 128, 128, 0.06)
  border: 1px solid rgba(128, 128, 128, 0.12)
  border-radius: 10px
  font-size: 13px
  margin-bottom: 16px

  svg
    flex-shrink: 0
    margin-top: 3px
    color: var(--accent)
    font-size: 16px

  strong
    color: var(--primary)
    font-weight: 600
    margin-right: 4px

  span
    color: var(--secondary)
    line-height: 1.4

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

.slide-enter-active,
.slide-leave-active
  transition: transform 0.3s ease

.slide-enter-from,
.slide-leave-to
  transform: translateX(-100%)
</style>
