<template>
  <div :class="{ 'no-overflow': fullScreenMode }">
    <schedule-header
      :full-screen-mode="fullScreenMode"
      @toggle-fullscreen="fullScreenMode = !fullScreenMode"
    />
    <theme-editor :open="themeEditorOpen" @close="themeEditorOpen = false" />

    <draggable
      v-model="gradesStore.cardsLayout"
      item-key="id"
      class="card-container"
      handle=".drag-handle"
      :animation="200"
      @end="gradesStore.saveLayout()"
    >
      <template #item="{ element }">
        <component
          :is="element.component"
          :key="element.id"
          v-bind="getProps(element)"
          :cardId="element.id"
          :cardTitle="element.props?.text || getFallbackTitle(element.component)"
          @open-theme-editor="themeEditorOpen = true"
          @click="handleCardClick(element.id)"
        />
      </template>
    </draggable>
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
import { mapActions, mapStores } from "pinia";
import draggable from "vuedraggable";
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
import useUserSettings from "@/stores/user-settings";
import ScheduleHeader from "./Header.vue";
import ThemeEditor from "@/views/Theme/Theme.vue";

export default {
  components: {
    ScheduleHeader,
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
    draggable,
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
  computed: {
    ...mapStores(useUserSettings),
  },
  methods: {
    ...mapActions(useClockStore, ["startClock"]),
    getProps(element) {
      if (!element.props) return {};
      const { iconName, ...rest } = element.props;
      if (iconName && this.icons[iconName]) {
        rest.icon = this.icons[iconName];
      }
      return rest;
    },
    getFallbackTitle(component) {
      const titles = {
        EndOfYearCard: 'End of Year',
        CountdownCard: 'Countdown',
        NewFeatureCard: 'New Features',
        NewThemeCard: 'New Themes',
        ContributeCard: 'Contribute',
        AprilFoolsCard: 'April Fools',
        ShsHacksCard: 'SHS Hacks',
        HolidayCard: 'Happy Holidays',
        ScheduleCard: 'Schedule',
        WeatherCard: 'Weather',
        PwcCard: 'PWC Schedule',
        LunchCard: 'Lunch',
        UpcomingEventsCard: 'Upcoming Events'
      };
      return titles[component] || component;
    },
    handleCardClick(id) {
      if (id === 'theme-switch') {
        this.themeEditorOpen = !this.themeEditorOpen;
      }
    }
  },
  created() {
    this.gradesStore.initializeLayout();
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

.card-container
  margin-top: 10px

.no-overflow
  height: 100vh
  overflow: hidden

.card-container
  max-width: $content-width
  margin: 10px auto
  display: grid
  padding: 0 5px
  grid-auto-rows: 5px

  :deep(.sortable-ghost)
    opacity: 0.4
    
  :deep(.sortable-drag)
    opacity: 0.8
  grid-template-columns: 1fr
  +tablet-small
    grid-template-columns: 1fr 1fr
  +desktop
    grid-template-columns: 1fr 1fr 1fr
</style>
