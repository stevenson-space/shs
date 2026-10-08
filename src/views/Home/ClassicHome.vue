<!--
  The home page as it was before the redesign, kept for anyone who prefers
  it (Settings > General > Home Page, or the button under the new home
  screen). Everything below is the original page; the only addition is the
  "Updated version" button that switches back.
-->
<template>
  <div class="classic-home" :class="{ 'no-overflow': fullScreenMode }">
    <button v-if="!fullScreenMode" class="new-version" type="button" @click="switchToNew">
      <Sparkles :size="15" :stroke-width="2.4" aria-hidden="true" />
      Updated version
    </button>
    <schedule-header
      :full-screen-mode="fullScreenMode"
      @toggle-fullscreen="fullScreenMode = !fullScreenMode"
    />
    <theme-editor :open="themeEditorOpen" @close="themeEditorOpen = false" />

    <card-container class="card-container">
        <end-of-year-card />
        <countdown-card
          untilDate="May 23, 2025"
          message="🌴 Summer Countdown 🐬"
        />
        <new-feature-card @open-theme-editor="themeEditorOpen = true" />
        <new-theme-card />
        <contribute-card />
        <april-fools-card />
        <shs-hacks-card/>
        <holiday-card />
        <schedule-card max-height="270px"/>
        <weather-card />
        <pwc-card/>
        <lunch-card />
        <upcoming-events-card />

        <icon-text-card :icon="icons.faBell"
                        text="Bell Schedules"
                        link="bellschedules"
                        :invert="false" />

        <icon-text-card :icon="icons.faLink" text="Links" link="links" :invert="true" />

        <icon-text-card :icon="icons.faCalendarDays" text="Calendar" link="calendar" :invert="true" />
        <icon-text-card :icon="icons.faQrcode" text="QR Codes" link="qr" />


        <icon-text-card :icon="icons.faCalculator"
                        text="GPA Calculator"
                        link="gpaCalculator"
                        :link-props="{ type: 'a' }"
                        :invert="true" />

        <icon-text-card :icon="icons.faDroplet" text="Switch Theme" @click="themeEditorOpen = !themeEditorOpen" />

        <icon-text-card
          v-if="!isStandalone"
          :icon="icons.faDownload"
          text="Install"
          link="install"
        />

        <icon-text-card :icon="icons.faHourglass" text="Timer" link="tools" :invert="true" />

        <icon-text-card :icon="icons.faRadio" text="Jukebox" link="jukebox" />

        <!-- Documents card hidden after I removed all the documents that have copyright issues. If we ever want to bring this feature back, everything must be properly licensed. -->
        <!-- <icon-text-card :icon="icons.faFileLines" text="Documents" link="documents" /> -->

        <icon-text-card :icon="icons.faGear" text="Settings" link="settings" :invert="true" />
    </card-container>
  </div>
</template>

<script>
import {
  faBell,
  faLink,
  faFileLines,
  faCalendarDays,
  faDroplet,
  faCalculator,
  faGear,
  faHourglass,
  faQrcode,
  faRadio,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { mapActions } from "pinia";
import { Sparkles } from "lucide-vue-next";
import useUserSettingsStore from "@/stores/user-settings";
import CardContainer from "@/components/CardContainer.vue";
import UpcomingEventsCard from "@/components/cards/UpcomingEventsCard.vue";
import IconTextCard from "@/components/cards/IconTextCard.vue";
import WeatherCard from "@/components/cards/WeatherCard.vue";
import PwcCard from "@/components/cards/PwcCard.vue";
import ScheduleCard from "@/components/cards/ScheduleCard.vue";
import HolidayCard from "@/components/cards/HolidayCard.vue";
import ContributeCard from "@/components/cards/ContributeCard.vue";
import LunchCard from "@/components/cards/LunchCard.vue";
import NewThemeCard from "@/components/cards/NewThemeCard.vue";
import ShsHacksCard from '@/components/cards/ShsHacksCard.vue';
import AprilFoolsCard from '@/components/cards/AprilFoolsCard.vue';
import NewFeatureCard from "@/components/cards/NewFeatureCard.vue";
import EndOfYearCard from "@/components/cards/EndOfYearCard.vue";
import CountdownCard from "@/components/cards/CountdownCard.vue";
import useClockStore from "@/stores/clock";
import ScheduleHeader from "./Header.vue";
import ThemeEditor from "@/views/Theme/Theme.vue";

export default {
  components: {
    Sparkles,
    ScheduleHeader,
    CardContainer,
    UpcomingEventsCard,
    LunchCard,
    IconTextCard,
    ScheduleCard,
    WeatherCard,
    PwcCard,
    HolidayCard,
    ContributeCard,
    NewThemeCard,
    ShsHacksCard,
    AprilFoolsCard,
    NewFeatureCard,
    EndOfYearCard,
    CountdownCard,
    ThemeEditor,
  },
  data() {
    return {
      icons: {
        faBell,
        faLink,
        faFileLines,
        faCalendarDays,
        faDroplet,
        faCalculator,
        faGear,
        faHourglass,
        faQrcode,
        faRadio,
        faDownload,
      },
      fullScreenMode: false,
      themeEditorOpen: false,
      isStandalone: false,
    };
  },
  methods: {
    ...mapActions(useClockStore, ["startClock"]),
    ...mapActions(useUserSettingsStore, ["setHomeStyle"]),
    switchToNew() {
      this.setHomeStyle("new");
      window.scrollTo(0, 0);
    },
  },
  created() {
    // Sometimes the interval used in Header.vue stops when the tab leaves focus
    // so updating the date when focus returns is necessary
    this.onFocus = () => this.startClock();
    window.addEventListener("focus", this.onFocus);
    // check if the app is launched as an installed PWA (standalone window) so we can hide the Install card
    const mql = window.matchMedia('(display-mode: standalone)');
    this.isStandalone = mql.matches || navigator.standalone === true;
    const standaloneHandler = (e) => { this.isStandalone = e.matches; };
    if (mql.addEventListener) {
      mql.addEventListener('change', standaloneHandler);
    } else {
      mql.addListener(standaloneHandler);
    }
    this.mql = mql;
    this.standaloneHandler = standaloneHandler;
  },
  // this page can now be switched in and out, so it cleans up after itself
  beforeUnmount() {
    window.removeEventListener("focus", this.onFocus);
    if (this.mql?.removeEventListener) {
      this.mql.removeEventListener('change', this.standaloneHandler);
    } else {
      this.mql?.removeListener(this.standaloneHandler);
    }
  },
};
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.classic-home
  position: relative

// back to the redesigned home page; sits in the header's empty top-left corner
.new-version
  position: absolute
  top: 14px
  left: 14px
  z-index: 5
  display: inline-flex
  align-items: center
  gap: 7px
  height: 36px
  padding: 0 15px 0 12px
  border: 1.5px solid rgba(255, 255, 255, .7)
  border-radius: 999px
  background: rgba(0, 0, 0, .2)
  color: #fff
  font: inherit
  font-size: 14px
  font-weight: 700
  cursor: pointer
  backdrop-filter: blur(6px)
  -webkit-backdrop-filter: blur(6px)
  box-shadow: 0 4px 14px -6px rgba(0, 0, 0, .5)
  transition: background .15s ease, transform .15s ease

  &:hover
    background: rgba(0, 0, 0, .32)
    transform: translateY(-1px)

  &:focus-visible
    outline: 2px solid #fff
    outline-offset: 2px

.card-container
  margin-top: 10px

.no-overflow
  height: 100vh
  overflow: hidden
</style>
