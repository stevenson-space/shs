<template>
  <div class="schedule" :class="{ 'full-screen': fullScreenMode }">
    <div class="container">
      <!-- This dropdown is just here for alignment purposes and is not displayed -->
      <dropdown
        v-show="scheduleModes.length > 1"
        class="schedule-select hidden"
        :options="scheduleModes"
        :value="scheduleModes.indexOf(bell.mode)"
      />

      <div class="center">
        <template v-if="mode === 'current'">
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
        :options="scheduleModes"
        :value="scheduleModes.indexOf(bell.mode)"
        :direction="fullScreenMode ? 'up' : 'down'"
        @input="$store.commit('setScheduleMode', scheduleModes[$event])"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Dropdown from '@/components/Dropdown.vue';
import RoundedButton from '@/components/RoundedButton.vue';

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
    ...mapState(['mode']),
    ...mapGetters(['bell']),
  },
};
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.schedule
  padding: 5px
  width: calc(100% - 10px) // subtract 2 * 5px (padding)
  color: #333
  letter-spacing: 1px
  background-color: white
  &.full-screen
    font-size: 2.75vh

  .container
    display: flex
    align-items: center
    max-width: $content-width
    margin: auto

  .schedule-select
    &.hidden
      visibility: hidden
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
