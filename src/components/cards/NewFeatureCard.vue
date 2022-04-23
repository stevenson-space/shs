<template>
  <timed-card startTime="March 23, 2022" endTime="April 3, 2022">
     <div class="icon">
      <font-awesome-icon :icon="icons.faQrcode" />
     </div>
    <div class="message"><b>Introducing Stevenson.Space QR Codes 🎉</b><p>Styled with Stevenson colors and logo</p><a href="/qr">Try It Out</a></div>
  </timed-card>
</template>

<script>
import { faQrcode } from '@fortawesome/free-solid-svg-icons';
import TimedCard from './TimedCard.vue';

export default {
  components: { TimedCard },
  data() {
    return {
      icons: {
        faQrcode,
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
.message
  text-align: center
  font-size: .9em
  padding-bottom: 10px
  line-height: 6px
</style>
