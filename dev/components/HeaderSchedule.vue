<template>
  <div class="schedule">
    <dropdown
      v-show="scheduleModes.length > 1"
      class="schedule-select hidden"
      :options="scheduleModes"
      :value="scheduleMode"/>

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
      :value="scheduleMode"
      @input="$emit('schedule-mode-change', $event)"/>
  </div>
</template>

<script>
import Dropdown from './Dropdown.vue';

export default {
  props: {
    mode: { type: String, required: true },
    inSchool: { type: Boolean, required: true },
    range: { type: String, required: true },
    period: { type: String, required: true },
    scheduleType: { type: String, required: true },
    scheduleModes: { type: Array, required: true },
    scheduleMode: { type: Number, required: true },
  },
  components: { Dropdown },
}
</script>

<style lang="sass" scoped>
@import '../styles/style.sass'

.schedule
  padding: 5px
  color: #333
  letter-spacing: 1px
  display: flex
  align-items: center
  max-width: $content-width
  margin: auto

  .schedule-select
    &.hidden
      visibility: hidden
    +mobile
      display: none

  .center
    flex-grow: 1
    // +mobile
    //   flex-grow: 0

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
      background-color: $color

</style>
