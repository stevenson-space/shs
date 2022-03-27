<template>
  <div :class="{ 'no-overflow': fullScreenMode }">
    <schedule-header
      :full-screen-mode="fullScreenMode"
      @toggle-fullscreen="fullScreenMode = !fullScreenMode"
    />

    <card-container>
      <contribute-card />
      <new-theme-card />
      <holiday-card />
      <schedule-card />
      <lunch-card />
      <upcoming-events-card />

      <icon-text-card :icon="icons.faBell" text="Bell Schedules" link="bellschedules" />

      <icon-text-card :icon="icons.faLink" text="Links" link="links" :invert="true" />

      <icon-text-card :icon="icons.faCalendarDays" text="Calendar" link="calendar" />

      <icon-text-card
        :icon="icons.faCalculator"
        text="GPA Calculator"
        link="gpaCalculator"
        :link-props="{ type: 'a' }"
        :invert="true"
      />

      <icon-text-card :icon="icons.faDroplet" text="Switch Colors" link="colors" />

      <icon-text-card :icon="icons.faHourglass" text="Timer" link="tools" :invert="true" />

      <icon-text-card :icon="icons.faFileLines" text="Documents" link="documents" />

      <icon-text-card
        :icon="icons.faGear"
        text="Settings"
        link="settings"
        :invert="true"
      />
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
} from '@fortawesome/free-solid-svg-icons';

import CardContainer from '@/components/CardContainer.vue';
import UpcomingEventsCard from '@/components/cards/UpcomingEventsCard.vue';
import IconTextCard from '@/components/cards/IconTextCard.vue';
import ScheduleCard from '@/components/cards/ScheduleCard.vue';
import HolidayCard from '@/components/cards/HolidayCard.vue';
import ContributeCard from '@/components/cards/ContributeCard.vue';
import LunchCard from '@/components/cards/LunchCard.vue';
import NewThemeCard from '@/components/cards/NewThemeCard.vue';
import ScheduleHeader from './Header.vue';

export default {
  components: {
    ScheduleHeader,
    CardContainer,
    UpcomingEventsCard,
    LunchCard,
    IconTextCard,
    ScheduleCard,
    HolidayCard,
    ContributeCard,
    NewThemeCard,
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
      },
      fullScreenMode: false,
    };
  },
  created() {
    // Sometimes the interval used in Header.vue stops when the tab leaves focus
    // so updating the date when focus returns is necessary
    window.addEventListener('focus', () => {
      this.$store.commit('setCurrentTime');
    });
  },
};
</script>

<style lang="sass" scoped>
.no-overflow
  height: 100vh
  overflow: hidden
</style>
