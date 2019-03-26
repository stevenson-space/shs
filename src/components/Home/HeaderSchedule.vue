<template>
  <div class="schedule" :class="{ 'full-screen': fullScreenMode }">
    <div class="container">

      <!-- This dropdown is just here for alignment purposes and is not displayed -->
      <dropdown
        v-show="scheduleModes.length > 1"
        class="schedule-select hidden"
        :options="scheduleModes"
        :value="scheduleModes.indexOf(bell.mode)"/>

      <div class="center">
        <template v-if="mode === 'current'">
          <div class="range">{{ range }}</div>

          <div class="period" v-if="inSchool">
            {{ period }}
          </div>
          <div class="type" v-else>
            {{ scheduleType }}
          </div>
        </template>

        <router-link class="button" to="/" v-else>
          Go Back Live
        </router-link>
      </div>

      <dropdown
        v-show="scheduleModes.length > 1"
        class="schedule-select"
        :options="scheduleModes"
        :value="scheduleModes.indexOf(bell.mode)"
        @input="$store.commit('setScheduleMode', scheduleModes[$event])"
        :direction="fullScreenMode ? 'up' : 'down'"/>
    </div>
  </div>
</template>

<script>
import Dropdown from 'src/components/common/Dropdown.vue';
import { mapState, mapGetters } from 'vuex';

export default {
  props: {
    inSchool: { type: Boolean, required: true },
    range: { type: String, required: true },
    period: { type: String, required: true },
    scheduleType: { type: String, required: true },
    scheduleModes: { type: Array, required: true },
    fullScreenMode: { type: Boolean, default: false },
  },
  computed: {
    ...mapState([
      'mode',
    ]),
    ...mapGetters([
      'bell'
    ]),
  },
  components: { Dropdown },
}
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
      font-size: 1.1em

    .type, .period
      font-size: .9em

    .button
      +shadow
      text-decoration: none
      color: white
      border-radius: 8px
      padding: 8px
      margin: 4px
      display: inline-block
      font-weight: normal
      background-color: var(--color)

</style>
