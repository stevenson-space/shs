<template>
  <timed-card startTime="Jan 7, 2022" endTime="January 15, 2022">
     <div class="icon">
      <font-awesome-icon :icon="icons.faCode" />
     </div>
    <div class="message"><b>stevenson.space is open source and looking <br> for developers to help maintain the site!<br><a class="learn-more-link" href="https://github.com/stevenson-space/shs/blob/gh-pages/Contribute.md" target="_blank">Learn More</a></b></div>
  </timed-card>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import TimedCard from './TimedCard.vue';

export default {
  components: { TimedCard, FontAwesomeIcon },
  data() {
    return {
      icons: {
        faCode,
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
