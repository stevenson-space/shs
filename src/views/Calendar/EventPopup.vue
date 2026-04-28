<template>
  <popup :show="show" @close="$emit('close')">
    <div class="event-details">
      <div class="date">{{ formatDate(event.timing) }}</div>

      <div class="title">{{ event.title }}</div>

      <div class="time">
        <font-awesome-icon class="icon" :icon="icons.faClock" fixed-width />&nbsp;

        <span v-if="event.timing.allDay">All Day</span>

        <span v-else-if="event.timing.end && event.timing.start !== event.timing.end">
          {{ formatTime(event.timing.start) }}&nbsp; – &nbsp;{{ formatTime(event.timing.end) }}
        </span>

        <span v-else>{{ formatTime(event.timing.start) }}</span>
      </div>

      <div v-show="event.location" class="location">
        <font-awesome-icon class="icon" :icon="icons.faLocationDot" fixed-width />
        &nbsp;{{ event.location }}
      </div>

      <div class="description">{{ event.description }}</div>
    </div>
  </popup>
</template>

<script>
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import Popup from '@/components/Popup.vue';

export default {
  components: {
    Popup,
  },
  props: {
    event: { type: Object, required: true },
    show: { type: Boolean, default: true },
  },
  data() {
    return {
      icons: {
        faLocationDot,
        faClock,
      },
    };
  },
  methods: {
    formatTime(dateOrStr) {
      return new Date(dateOrStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    },
    formatDate(timing) {
      const date = timing.allDay
        ? (() => { const [y, m, d] = timing.date.split('-').map(Number); return new Date(y, m - 1, d); })()
        : new Date(timing.start);
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
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
  -webkit-overflow-scrolling: touch

  .date
    font-size: .9em
    font-weight: bold
    color: var(--accent)

  .title
    font-size: 1.4em
    font-weight: bold
    color: var(--secondary)
    margin-top: 3px

  .time
    font-size: 1.05em
    margin-top: 15px
    display: flex
    align-items: center

  .location
    margin-top: 20px
    display: flex
    align-items: center

  .icon
    color: var(--accent)
    font-size: 1.25em
    margin-right: 5px

  .description
    margin-top: 15px
    font-size: .9em
    white-space: pre-line
</style>
