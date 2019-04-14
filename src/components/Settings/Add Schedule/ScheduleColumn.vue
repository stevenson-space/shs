<template>
  <div class="schedule-column">
    <div class="title">{{ name }}</div>

    <div class="add-period-button" @click="$emit('add-period')">
      <font-awesome-icon class="icon" :icon="icons.faPlus"/>
      Add Period
    </div>

    <checkbox :value="isEnabled" @input="$emit($event ? 'enable' : 'disable')">
      <span class="enable-checkbox-text">This schedule applies on days of type "{{name}}"</span>
    </checkbox>

    <schedule-column-period
      v-show="isEnabled"
      v-for="(period, i) in periods"
      class="period"
      v-bind="period"
      @pick-time="$emit('pick-time', { period: i, time: $event })"
      @update-name="$emit('update-name', { name: $event.name, updateOthers: $event.updateOthers, period: i })"
      @delete-period="$emit('delete-period', { period: i, deleteOthers: $event })"
      :key="period.name"/>

    <div class="space"/>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import ScheduleColumnPeriod from './ScheduleColumnPeriod.vue';
import Checkbox from 'common/Checkbox.vue';

export default {
  props: {
    name: { type: String, required: true },
    isEnabled: { type: Boolean, required: true },
    periods: { type: Array, required: true },
  },
  data() {
    return {
      icons: {
        faPlus
      }
    }
  },
  components: {
    FontAwesomeIcon,
    ScheduleColumnPeriod,
    Checkbox,
  }
}
</script>

<style lang="sass" scoped>

.schedule-column
  min-width: 400px
  display: flex
  flex-direction: column
  align-items: center

  .title
    font-size: 1.5em
    text-align: center
    margin-bottom: 10px

  .add-period-button
    border-radius: 100px
    padding: 5px 10px
    cursor: pointer
    font-weight: bold
    user-select: none
    margin: auto
    font-size: .85em
    border: var(--color) 1.5px solid
    color: var(--color)
    display: flex
    align-items: center

    .icon
      font-size: .85em
      margin-right: 5px

  .enable-checkbox-text
    font-size: .95em

  .period
    margin: 15px 40px

  .space
    flex: 1

</style>

