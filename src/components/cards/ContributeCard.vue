<template>
  <timed-card startTime="May 22, 2022" endTime="May 27, 2022" style="padding: 5px">
     <div class="icon">
      <font-awesome-icon :icon="icons.faFilm" />
     </div>
    <div class="message">Interested in how stevenson.space has changed over the years? Checkout <b><a class="learn-more-link" href="https://vimeo.com/712696114">Then VS Now</a></b> - a short film showing the progress of the open-source project.</div>
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
