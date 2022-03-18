<template>
  <div>
    <plain-header title='QR Codes' />
    <card class="qr-card">
      <div class="center" >
      <div id='qr-code' ref='qrCode'></div>
      <br>
      <input v-model='enteredQRCode' placeholder='Enter Link' />
      <div class="btn-row">
        <rounded-button v-if="isValidLink" class="button" @click="generateQR" :text="showQR && options.data != enteredQRCode ? 'Re-Generate' : 'Generate'" :circular="false"/>
        <rounded-button v-if="showQR" class="button"  @click='download' text='Download' :circular="false"/>
      </div>
      </div>
    </card>
  </div>
</template>

<script>
import PlainHeader from '@/components/PlainHeader.vue';
import QRCodeStyling from 'qr-code-styling';
import Card from '@/components/Card.vue';
import RoundedButton from '@/components/RoundedButton.vue';

export default {
  components: {
    PlainHeader,
    Card,
    RoundedButton,
  },
  data: () => {
    const options = {
      width: 300,
      height: 300,
      type: 'png',
      data: '',
      image: 'static/QRCodeLogo.svg',
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: 'H',
      },
      imageOptions: {
        hideBackgroundDots: false,
        imageSize: 0.3,
      },
      dotsOptions: {
        color: '#1F5D39',
        type: 'rounded',
      },
      backgroundOptions: {
        color: '#ffffff',
      },
      cornersSquareOptions: {
        color: '#1F5D39',
        type: 'extra-rounded',
      },
      cornersDotOptions: {
        color: '#1F5D39',
        type: 'dot',
      },
    };
    return {
      showQR: false,
      options,
      enteredQRCode: '',
      qrCode: new QRCodeStyling(options),
    };
  },
  mounted() {
    this.qrCode.append(this.$refs.qrCode);
  },
  computed: {
    isValidLink() {
      const { enteredQRCode } = this;
      const linkExpression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
      const linkValidator = new RegExp(linkExpression);
      return this.options.data !== enteredQRCode && enteredQRCode.length > 0 && enteredQRCode.match(linkValidator);
    },
  },
  methods: {
    generateQR() {
      if (this.isValidLink) {
        console.log('generating new qr code');
        this.options.data = this.enteredQRCode;
        this.qrCode.update(this.options);
        this.showQR = true;
      }
    },
    download() {
      this.qrCode.download({ extension: this.extension, name: `QR-${this.options.data.substring(0, 10)}` });
    },
  },
};
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'
.qr-card
  max-width: 972px
  padding: 20px
  +desktop
    margin: 0px auto !important
  .center
    display: flex
    flex-direction: column
    align-items: center
    input
      font-size: 17px
      text-align: center
      background: none
      width: 100%
      max-width: 650px
      border: none
      padding: 10px
      border-radius: 7px
      margin-bottom: 10px
      +shadow
      &:focus
        outline: none
    .button
      width: 110px
      margin: auto
  .btn-row
    display: flex
    gap: 5px
</style>
