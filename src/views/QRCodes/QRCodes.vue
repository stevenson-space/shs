<template>
  <div>
    <plain-header title='QR Codes' />
    <card class="qr-card">
      <color-selector
      :colors="colors"
      :backgroundShade="1"
      :current-color="color"
      @color-selected="colorSelected"
      />
      <div class="center" >
        <rounded-button v-if="color != defaultColor" class="reset-button"  @click='resetColor()' text="Reset Color" :circular="true"/>
        <div id="qr-code" :class="{ 'show' : showQR }" ref="qrCode"></div>
        <br>
        <p>For iOS devices, use Safari for the download feature</p>
        <form @submit.prevent @submit="generateQR()">
          <input v-model='enteredQRCode' placeholder="Enter A Valid Link" />
        </form>
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
import colors from '@/data/QRColors.json';
import PlainHeader from '@/components/PlainHeader.vue';
import QRCodeStyling from 'qr-code-styling';
import Card from '@/components/Card.vue';
import RoundedButton from '@/components/RoundedButton.vue';
import ColorSelector from '@/views/Colors/ColorSelector.vue';

export default {
  components: {
    PlainHeader,
    Card,
    RoundedButton,
    ColorSelector,
  },
  data: () => {
    const options = {
      width: 500,
      height: 500,
      margin: 20,
      type: 'jpeg',
      data: '',
      image: 'static/QRCodeLogo.png',
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
        color: '',
        type: 'rounded',
      },
      backgroundOptions: {
        color: '#ffffff',
      },
      cornersSquareOptions: {
        color: '',
        type: 'extra-rounded',
      },
      cornersDotOptions: {
        color: '',
        type: 'dot',
      },
    };
    return {
      defaultColor: '#1F5D39',
      color: '',
      colors,
      showQR: false,
      options,
      enteredQRCode: '',
      errorMessage: '',
      qrCode: new QRCodeStyling(options),
    };
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') {
      this.enteredQRCode = 'https://test.com';
    }
    const { defaultColor } = this;
    this.color = defaultColor;
    this.setQRColor(defaultColor);
    this.qrCode.append(this.$refs.qrCode);
  },
  methods: {
    resetColor() {
      this.color = this.defaultColor;
      this.setQRColor();
    },
    colorSelected(color) {
      this.color = color;
      this.setQRColor();
    },
    isValidLink(checkDifferentURL = true) { // checkDifferentURL means whether the url entered previously has to be different than the current one to validate true. For the color picker, it should skip this check.
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
      if (!checkDifferentURL) return isNonEmptyURL;
      return this.options.data !== enteredQRCode && isNonEmptyURL;
    },
    generateQR(checkDifferentURL = true) {
      if (this.isValidLink(checkDifferentURL)) {
        this.options.data = this.enteredQRCode;
        this.qrCode.update(this.options);
        this.showQR = true;
      }
    },
    download() {
      const fileName = `QR-${this.options.data.replace('http://', '').replace('https://', '').replace('www.', '').substring(0, 12)}`;
      this.qrCode.download({ extension: this.options.type, name: fileName });
    },
    setQRColor() {
      const { options, color } = this;
      options.dotsOptions.color = color;
      options.cornersSquareOptions.color = color;
      options.cornersDotOptions.color = color;
      this.generateQR(false);
    },
  },
};
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'
.reset-button
  width: 100px
  margin-top: 12px
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
    form
      display: flex
      justify-content: center
      width: 100%
      input
        background: none
        text-align: center
        border: none
        font-size: 17px
        width: 90%
        max-width: 650px
        padding: 10px
        border-radius: 7px
        margin-bottom: 10px
        border: 1px solid var(--color)
        +shadow-light
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
