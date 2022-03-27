<template>
  <timed-card startTime="March 23, 2022" endTime="April 3, 2022">
     <div class="icon">
      <font-awesome-icon :icon="icons.faQrcode" />
     </div>
    <div class="message"><b>Introducing Stevenson.Space QR Codes 🎉 </b><a href="/qr-codes">Try</a> them now</div>
  </timed-card>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import { faQrcode } from '@fortawesome/free-solid-svg-icons';
import TimedCard from './TimedCard.vue';

export default {
  components: { TimedCard, FontAwesomeIcon },
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
  font-size: .9em
  text-align: center
  padding-bottom: 10px
</style>
