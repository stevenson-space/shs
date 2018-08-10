<template>
  <div class="schedule">
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
</template>

<script>
export default {
  props: {
    mode: { type: String, required: true },
    inSchool: { type: Boolean, required: true },
    range: { type: String, required: true },
    period: { type: String, required: true },
    scheduleType: { type: String, required: true },
  }
}
</script>

<style lang="sass" scoped>
@import '../styles/style.sass'

.schedule
  padding: 5px
  color: #333
  letter-spacing: 1px

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
