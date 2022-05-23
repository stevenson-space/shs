<template>
  <timed-card startTime="May 22, 2023" endTime="May 31, 2022">
     <div class="icon">
     </div>
  </timed-card>
</template>

<script>
import { faFilm } from '@fortawesome/free-solid-svg-icons';
import TimedCard from './TimedCard.vue';

export default {
  components: { TimedCard },
  data() {
    return {
      hidden: false,
      icons: {
        faFilm,
      },
    };
  },
  methods: {
    hide() {
      this.hidden = true;
    },
  },
};
</script>

<style lang="sass" scoped>
.icon
  font-size: 40px
  display: flex
  justify-content: center
  padding: 10px
  color: var(--color)

.learn-more-link
  color: var(--color)

.logo
  display: block
  margin-left: auto
  margin-right: auto
  height: 110px
  padding: 10px 5px

.message
  font-size: .9em
  text-align: center
  padding-bottom: 10px
</style>
