<template>
  <div>
    <plain-header title='QR Codes' />
    <card class="qr-card">
      <div class="center" >
      <div id="qr-code" :class="{ 'show' : showQR }" ref="qrCode"></div>
      <br>
      <p>For iOS devices, use Safari for the download feature</p>
      <input v-model='enteredQRCode' placeholder="Enter A Valid Link" />
      <div class="input-tip"  v-if="enteredQRCode.length > 40">Tip: For very long links, consider using <a href="https://bitly.com/" target='_blank'>Bitly</a> for a more aesthetic code</div>
      <div class="input-tip"  v-if="errorMessage.length > 0">{{ errorMessage }}</div>
      <div class="btn-row">
        <rounded-button v-if="isValidLink()" class="button" @click="generateQR" :text="showQR && options.data != enteredQRCode ? 'Re-Generate' : 'Generate'" :circular="false"/>
        <rounded-button v-if="showQR" class="button"  @click='download' text="Download" :circular="false"/>
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
      width: 500,
      height: 500,
      type: 'jpeg',
      data: '', // the link
      image: 'static/QRCodeLogo.svg',
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: 'Q',
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.35,
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
      errorMessage: '',
      qrCode: new QRCodeStyling(options),
    };
  },
  mounted() {
    this.qrCode.append(this.$refs.qrCode);
  },
  methods: {
    isValidLink() {
      const { enteredQRCode } = this;
      const linkExpression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
      const linkValidator = new RegExp(linkExpression);
      const isNonEmptyURL = this.enteredQRCode.length > 0;
      if (!enteredQRCode.match(linkValidator)) {
        this.errorMessage = isNonEmptyURL ? 'Invalid Link Format (Example: https://stevenson.space)' : '';
        return false;
      } if (enteredQRCode.length > 120) {
        this.errorMessage = isNonEmptyURL ? 'Link too long' : '';
        return false;
      }
      this.errorMessage = '';
      return this.options.data !== enteredQRCode && isNonEmptyURL;
    },
    generateQR() {
      if (this.isValidLink) {
        console.log('generating new qr code');
        this.options.data = this.enteredQRCode;
        this.qrCode.update(this.options);
        this.showQR = true;
      }
    },
    download() {
      const fileName = `QR-${this.options.data.replace('http://', '').replace('https://', '').replace('www.', '').substring(0, 12)}`;
      this.qrCode.download({ extension: this.extension, name: fileName });
    },
  },
};
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'
#qr-code
  &.show
    +shadow
    transform: scale(.5)
    padding: 20px
    border-radius: 50px
    margin-top: -110px
    margin-bottom: -110px
.qr-card
  max-width: 972px
  padding: 20px
  +desktop
    margin: 0px auto !important
  .input-tip
    font-size: 14px
    a
      color: black
  .center
    display: flex
    flex-direction: column
    align-items: center
    input
      background: none
      text-align: center
      border: none
      font-size: 17px
      width: 100%
      max-width: 650px
      padding: 10px
      border-radius: 7px
      margin-bottom: 10px
      +shadow-light
      border: 1px solid var(--color)
      &:focus
        outline: none
    .button
      margin: auto
      width: 110px
  .btn-row
    display: flex
    margin-top: 8px
    gap: 5px
</style>
