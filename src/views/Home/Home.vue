<template>
  <!-- the old home page, for anyone who switched back to it -->
  <classic-home v-if="homeStyle === 'classic'" />

  <!-- .hero-left turns on the side panel layout (see side-hero in style.sass) -->
  <div v-else :class="{ 'hero-left': heroPosition === 'left' }">
  <div class="home" :class="{ 'no-overflow': fullScreenMode }">
    <schedule-header
      class="hero"
      :full-screen-mode="fullScreenMode"
      @toggle-fullscreen="fullScreenMode = !fullScreenMode"
    />

    <main class="home-main">
      <home-notices />
      <widget-grid @open-themes="themeEditorOpen = true">
        <template #foot>
          <button class="old-version" type="button" @click="switchToClassic">
            <History :size="15" :stroke-width="2.4" aria-hidden="true" />
            Switch to the old version
          </button>
        </template>
      </widget-grid>
    </main>

    <theme-editor :open="themeEditorOpen" @close="themeEditorOpen = false" />
  </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import { History } from 'lucide-vue-next';
import '@/styles/home.css';
import useClockStore from '@/stores/clock';
import useUserSettingsStore from '@/stores/user-settings';
import HomeNotices from '@/components/home/HomeNotices.vue';
import WidgetGrid from '@/components/home/WidgetGrid.vue';
import ThemeEditor from '@/views/Theme/Theme.vue';
import ScheduleHeader from './Header.vue';
import ClassicHome from './ClassicHome.vue';

export default {
  components: {
    ClassicHome,
    History,
    ScheduleHeader,
    ThemeEditor,
    HomeNotices,
    WidgetGrid,
  },
  data() {
    return {
      fullScreenMode: false,
      themeEditorOpen: false,
    };
  },
  computed: {
    ...mapState(useUserSettingsStore, ['heroPosition', 'homeStyle']),
  },
  methods: {
    ...mapActions(useClockStore, ['startClock']),
    ...mapActions(useUserSettingsStore, ['setHomeStyle']),
    switchToClassic() {
      this.setHomeStyle('classic');
      window.scrollTo(0, 0);
    },
  },
  created() {
    // Sometimes the interval used in Header.vue stops when the tab leaves focus
    // so updating the date when focus returns is necessary
    window.addEventListener('focus', this.startClock);
  },
  beforeUnmount() {
    window.removeEventListener('focus', this.startClock);
  },
};
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.home
  // width of the countdown panel when it is docked on the left (0 when it is on top)
  --hero-width: 0px

.home-main
  min-width: 0

// under the widgets, next to "Edit home screen"
.old-version
  display: inline-flex
  align-items: center
  gap: 8px
  height: 38px
  padding: 0 16px
  border: 1px solid var(--w-line)
  border-radius: 999px
  background: transparent
  color: var(--w-muted)
  font: inherit
  font-size: 13.5px
  font-weight: 700
  cursor: pointer
  transition: color .15s ease, border-color .15s ease

  &:hover
    color: var(--primary)
    border-color: var(--w-line-strong)

  &:focus-visible
    outline: 2px solid var(--accent)
    outline-offset: 2px

.no-overflow
  height: 100vh
  overflow: hidden

// iPad (landscape) and laptop: countdown on the left, widgets on the right
+side-hero
  .home
    --hero-width: clamp(310px, 24vw, 360px)
    --hero-zoom: 1
    display: grid
    grid-template-columns: var(--hero-width) minmax(0, 1fr)
    align-items: start

  .hero
    grid-column: 1
    grid-row: 1

  .home-main
    grid-column: 2
    grid-row: 1

  // big monitors: the panel and everything in it grow with the widgets
  @media (min-width: 1700px) and (min-height: 860px)
    .home
      --hero-width: 440px
      --hero-zoom: 1.25

  @media (min-width: 2300px) and (min-height: 1150px)
    .home
      --hero-width: 540px
      --hero-zoom: 1.55
</style>
