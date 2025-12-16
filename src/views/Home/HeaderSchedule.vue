<template>
  <div class="schedule" :class="{ 'full-screen': fullScreenMode }">
    <div class="container" :class="{ 'full-screen': fullScreenMode }">
      <!-- This dropdown is just here for alignment purposes and is not displayed -->
      <dropdown
        v-show="scheduleModes.length > 1"
        class="schedule-select hidden"
        :options="scheduleModes"
        :modelValue="scheduleModes.indexOf(bell.mode)"
      />

      <div class="center">
        <template v-if="clockMode === 'current'">
          <div class="range">{{ range }}</div>

          <div v-if="inSchool" class="period">
            {{ period }}
          </div>

          <div v-else class="type">
            {{ scheduleType }}
          </div>
        </template>

        <router-link v-else to="/">
          <rounded-button
            class="button"
            text="Go Back Live"
            :circular="false"
            :invert="true"
          />
        </router-link>
      </div>

      <dropdown
        v-show="scheduleModes.length > 1"
        class="schedule-select"
        :class="{ 'full-screen': fullScreenMode }"
        :options="scheduleModes"
        :modelValue="scheduleModes.indexOf(bell.mode)"
        :direction="fullScreenMode ? 'up' : 'down'"
        @update:modelValue="setScheduleMode(scheduleModes[$event])"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import Dropdown from '@/components/Dropdown.vue';
import RoundedButton from '@/components/RoundedButton.vue';
import useScheduleStore from '@/stores/schedules';
import useClockStore from '@/stores/clock';

export default {
  components: { Dropdown, RoundedButton },
  props: {
    inSchool: { type: Boolean, required: true },
    range: { type: String, required: true },
    period: { type: String, required: true },
    scheduleType: { type: String, required: true },
    scheduleModes: { type: Array, required: true },
    fullScreenMode: { type: Boolean, default: false },
  },
  computed: {
    ...mapState(useClockStore, ['clockMode', 'bell']),
  },
  methods: {
    ...mapActions(useScheduleStore, ['setScheduleMode']),
  },
};
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.schedule
  margin-top: -10px !important
  color: var(--secondary)
  letter-spacing: 1px
  &.full-screen
    font-size: 2.75vh
    margin-top: -40px !important

  .container
    max-width: min(#{$content-width+0-20}, calc(100% - 44px))
    background: var(--background)
    border-radius: 22px 22px 0 0 
    position: relative
    top: 15px
    padding: 12px 12px
    display: flex
    margin: auto
    &.full-screen
      max-width: 100%
      border-radius: 30px 30px 0px 0px 
      align-items: center
      top: 0px

  .schedule-select
    &.hidden
      visibility: hidden
    &.full-screen
      margin-right: 10px
    +mobile-small
      display: none

  .center
    flex-grow: 1

    .range
      font-size: 1.2em

    .type, .period
      font-size: .99em

    .button
      +shadow
      text-decoration: none
      display: inline-block
</style>
