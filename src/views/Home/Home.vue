<template>
  <div :class="{ 'no-overflow': fullScreenMode }">
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
        <new-feature-card />
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

        <icon-text-card :icon="icons.faRadio" text="Jukebox" link="jukebox" />

        <icon-text-card :icon="icons.faCalculator"
                        text="GPA Calculator"
                        link="gpaCalculator"
                        :link-props="{ type: 'a' }"
                        :invert="true" />

        <icon-text-card :icon="icons.faDroplet" text="Switch Theme" @click="themeEditorOpen = !themeEditorOpen" />

        <icon-text-card :icon="icons.faHourglass" text="Timer" link="tools" :invert="true" />

        <icon-text-card :icon="icons.faFileLines" text="Documents" link="documents" />

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
} from "@fortawesome/free-solid-svg-icons";
import { mapActions } from "pinia";
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
import Confetti from "@/components/cards/ConfettiCard.vue";
import CountdownCard from "@/components/cards/CountdownCard.vue";
import useClockStore from "@/stores/clock";
import useThemeStore from "@/stores/themes";
import ScheduleHeader from "./Header.vue";
import ThemeEditor from "@/views/Theme/Theme.vue";

export default {
  components: {
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
    Confetti,
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

      },
      fullScreenMode: false,
      themeEditorOpen: false,
    };
  },
  methods: {
    ...mapActions(useClockStore, ["startClock"]),
  },
  created() {
    // Sometimes the interval used in Header.vue stops when the tab leaves focus
    // so updating the date when focus returns is necessary
    window.addEventListener("focus", () => {
      this.startClock();
    });
  },
};
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.no-overflow
  height: 100vh
  overflow: hidden
</style>
