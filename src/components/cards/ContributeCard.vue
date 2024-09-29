<template>
  <timed-card startTime="September 29, 2024" endTime="October 13, 2024">
      <div class="icon">
        <font-awesome-icon :icon="icons.faCode" />
      </div>
    <div class="message"><b>stevenson.space is open source and looking <br> for new developers to help maintain the site!<br><a href="https://github.com/stevenson-space/shs/blob/main/Contribute.md" target="_blank">Learn More.</a></b></div>
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
  font-size: .85em
  text-align: center
  padding: 10px
</style>
