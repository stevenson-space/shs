<template>
  <timed-card startTime="September 29, 2024" endTime="October 13, 2024">
      <div class="icon">
        <font-awesome-icon :icon="icons.faCode" />
      </div>
    <div class="message"><b>For people interested in becoming a dedicated contributor of stevenson.space, the form is due by Oct. 13. <a class="learn-more-link" href="https://github.com/stevenson-space/shs/blob/main/Contribute.md" target="_blank">Learn More</a></b></div>
  </timed-card>
</template>

<script>
import { faCode } from '@fortawesome/free-solid-svg-icons';
import TimedCard from './TimedCard.vue';

export default {
  components: { TimedCard },
  data() {
    return {
      hidden: false,
      icons: {
        faCode,
      },
    };
  },
};
</script>

<style lang="sass" scoped>
.icon
  font-size: 30px
  display: flex
  justify-content: center
  padding-top: 15px
  color: var(--accent)

.learn-more-link
  color: var(--accent)

.logo
  display: block
  margin-left: auto
  margin-right: auto
  height: 110px
  padding: 10px 5px

.message
  font-size: .85em
  text-align: center
  padding: 10px
</style>
