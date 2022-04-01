<template>
  <timed-card startTime="April 1, 2022" endTime="April 2, 2022">
    <div class="row">
      <div class="description">We are sad to announce that due to high server costs, and operational upkeep, <b>stevenson.space will be terminating service at the end of the school year.</b>
      &nbsp;<a class="link" href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noreferrer">Read more... <font-awesome-icon :icon="faArrowUpRightFromSquare" class="link-icon" /></a></div>
    </div>
  </timed-card>
</template>

<script>
import TimedCard from '@/components/cards/TimedCard.vue';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

export default {
  components: { TimedCard },
  data() {
    return { faArrowUpRightFromSquare };
  },
};
</script>

<style lang="sass" scoped>
.row
  display: flex
  justify-content: center
  align-items: center
  margin: 10px
.description
  text-align: center
  font-size: .9em
  padding: 5px
.link
    text-decoration: none
    color: var(--color)
    font-weight: bold
.link-icon
    font-size: 1.1em
    color: var(--color)
</style>
