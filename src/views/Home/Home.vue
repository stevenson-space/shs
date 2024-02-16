<template>
  <div :class="{ 'no-overflow': fullScreenMode }">
    <schedule-header
      :full-screen-mode="fullScreenMode"
      @toggle-fullscreen="fullScreenMode = !fullScreenMode"
    />

    <card-container class="card-container">
        <end-of-year-card />
        <!-- <countdown-card
      v-show="themeName === 'Summer'"
      untilDate="May 27, 2023"
      message="🌴 Summer Countdown 🐬"
    /> -->
        <new-feature-card />
        <new-theme-card />
        <!-- <april-fools-card /> -->
        <shs-hacks-card/>
        <holiday-card />
        <schedule-card />
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

        <icon-text-card :icon="icons.faDroplet" text="Switch Theme" link="colors" />

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
// import AprilFoolsCard from '@/components/cards/AprilFoolsCard.vue';
import NewFeatureCard from "@/components/cards/NewFeatureCard.vue";
import EndOfYearCard from "@/components/cards/EndOfYearCard.vue";
import Confetti from "@/components/cards/ConfettiCard.vue";
import CountdownCard from "@/components/cards/CountdownCard.vue";
import useScheduleStore from "@/stores/schedules";
import useThemeStore from "@/stores/themes";
import ScheduleHeader from "./Header.vue";

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
    // AprilFoolsCard,
    NewFeatureCard,
    EndOfYearCard,
    Confetti,
    CountdownCard,
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
      themeName: useThemeStore().theme.name,
    };
  },
  methods: {
    ...mapActions(useScheduleStore, ["setCurrentTime"]),
  },
  created() {
    // Sometimes the interval used in Header.vue stops when the tab leaves focus
    // so updating the date when focus returns is necessary
    window.addEventListener("focus", () => {
      this.setCurrentTime();
    });
  },
};
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.no-overflow
  height: 100vh
  overflow: hidden

// @for $i from 1 to 15
//   .card-container .card:nth-child(#{$i})
//     +animate-fade-up
//     animation-delay: $i * 0.011s
</style>
