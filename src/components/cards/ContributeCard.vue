<template>
  <timed-card startTime="May 22, 2022" endTime="May 31, 2022">
     <div class="icon">
      <font-awesome-icon :icon="icons.faFilm" />
     </div>
    <div class="message">Interested in how stevenson.space has changed over the years? Checkout <b><a class="learn-more-link" href="https://vimeo.com/712696114">Then VS Now</a></b> - a short film celebreating the progress of the open-source project.</div>
    <div style="padding:63.45% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/712696114?h=4a6000f65f&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;" title="stevenson.space: Then VS Now"></iframe></div>
  </timed-card>
</template>

<script>
import { faFilm } from '@fortawesome/free-solid-svg-icons';
import TimedCard from './TimedCard.vue';

export default {
  components: { TimedCard },
  data() {
    return {
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
