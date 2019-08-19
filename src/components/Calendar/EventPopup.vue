<template>
  <popup :show="show" @close="$emit('close')">
    <div class="event-details">
      <div class="date">{{ formatDate(event.start) }}</div>

      <div class="title">{{ event.name }}</div>

      <div class="time">
        <font-awesome-icon class="icon" :icon="icons.faClock" fixed-width />&nbsp;

        <span v-if="event.allDay">All Day</span>

        <span v-else-if="event.start && event.end">
          {{ formatTime(event.start) }}&nbsp; – &nbsp;{{ formatTime(event.end) }}
        </span>

        <span v-else>{{ formatTime(event.start) }}</span>
      </div>

      <div v-show="event.location" class="location">
        <font-awesome-icon class="icon" :icon="icons.faMapMarkerAlt" fixed-width />
        &nbsp;{{ event.location }}
      </div>

      <div class="description">{{ event.description }}</div>
    </div>
  </popup>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';

import Popup from 'common/Popup.vue';

export default {
  components: {
    FontAwesomeIcon,
    Popup,
  },
  props: {
    event: { type: Object, required: true },
    show: { type: Boolean, default: true },
  },
  data() {
    return {
      icons: {
        faMapMarkerAlt,
        faClock,
      },
    };
  },
  methods: {
    formatTime(ms) {
      return (new Date(ms)).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    },
    formatDate(ms) {
      return (new Date(ms)).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    },
  },
};
</script>

<style lang="sass" scoped>
.event-details
  max-width: 500px
  padding: 20px 30px
  box-sizing: border-box
  user-select: text
  width: calc(100vw - 40px)
  max-height: calc(100vh - 100px)
  overflow: auto
  -webkit-overflow-scrolling: touch;

  .date
    font-size: .9em
    font-weight: bold
    color: var(--color)

  .title
    font-size: 1.4em
    font-weight: bold
    color: #333
    margin-top: 3px

  .time
    font-size: 1.05em
    margin-top: 15px

  .location
    margin-top: 20px

  .icon
    color: var(--color)
    font-size: 1.25em

  .description
    margin-top: 15px
    font-size: .9em
    white-space: pre-line

</style>
