<template>
  <div class="schedule-column">
    <div class="title">{{ name }}</div>

    <rounded-button class="add-period-button" :icon="icons.faPlus" text="Add Period" @click="$emit('add-period')" />

    <checkbox :modelValue="isEnabled" @update:modelValue="$emit($event ? 'enable' : 'disable')">
      <span class="enable-checkbox-text">This schedule applies on days of type "{{ name }}"</span>
    </checkbox>

    <schedule-column-period
      v-for="(period, i) in periods"
      v-show="isEnabled"
      :key="period.name"
      class="period"
      v-bind="period"
      @pick-time="$emit('pick-time', { period: i, time: $event })"
      @update-name="$emit('update-name', { name: $event.name, updateOthers: $event.updateOthers, period: i })"
      @delete-period="$emit('delete-period', { period: i, deleteOthers: $event })"
    />

    <div class="space" />
  </div>
</template>

<script>
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import Checkbox from '@/components/Checkbox.vue';
import RoundedButton from '@/components/RoundedButton.vue';
import ScheduleColumnPeriod from './ScheduleColumnPeriod.vue';

export default {
  components: {
    ScheduleColumnPeriod,
    Checkbox,
    RoundedButton,
  },
  props: {
    name: { type: String, required: true },
    isEnabled: { type: Boolean, required: true },
    periods: { type: Array, required: true },
  },
  data() {
    return {
      icons: {
        faPlus,
      },
    };
  },
};
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
    font-size: .85em

  .enable-checkbox-text
    font-size: .95em

  .period
    margin: 15px 40px

  .space
    flex: 1

</style>
