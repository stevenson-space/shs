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
        <div id="qr-code" :class="{ 'show' : showQR }">
           <QRCodeVue3
          :key="componentKey"
          :image="require('@/assets/QRCodeLogo.png')"
          :width="options.width"
          :margin="options.margin"
          :height="options.height"
          :value="options.data"
          :qrOptions="options.qrOptions"
          :imageOptions="options.imageOptions"
          :dotsOptions="options.dotsOptions"
          :backgroundOptions="{ color: '#ffffff' }"
          :cornersSquareOptions="{ type: 'extra-rounded', color: options.dotsOptions.color }"
          :cornersDotOptions="{ type: 'circle', color:  options.dotsOptions.color }"
          fileExt="png"
          myclass="my-qur"
          imgclass="img-qr"
        />
        </div>
        <br>
        <p><b>To save: drag-and-drop the image or tap and hold (on mobile)</b></p>
        <form @submit.prevent @submit="generateQR()">
          <input v-model='enteredQRCode' class="link-input" placeholder="Enter A Valid Link" />
        </form>
        <div class="input-tip" v-if="enteredQRCode.length > 40">Tip: For very long links, consider using <a href="https://bitly.com/" target='_blank'>Bitly</a> for a more aesthetic code</div>
        <div class="input-tip" v-if="errorMessage.length > 0">{{ errorMessage }}</div>
        <div class="btn-row">
          <rounded-button v-if="isValidLink()" class="button" @click="generateQR" :text="showQR && options.data != enteredQRCode ? 'Re-Generate' : 'Generate'" :circular="false"/>
          <!-- <rounded-button v-if="showQR" class="button"  @click='download' text="Download" :circular="false"/> -->
        </div>
      </div>
    </card>
  </div>
</template>

<script>
import colors from '@/data/QRColors.json';
import PlainHeader from '@/components/PlainHeader.vue';
import QRCodeVue3 from 'space-vue3-qrcode';
import Card from '@/components/Card.vue';
import RoundedButton from '@/components/RoundedButton.vue';
import ColorSelector from '@/views/Colors/ColorSelector.vue';

export default {
  components: {
    PlainHeader,
    Card,
    RoundedButton,
    ColorSelector,
    QRCodeVue3,
  },
  data: () => {
    const options = {
      width: 800,
      height: 800,
      type: 'jpeg',
      margin: 27,
      data: '',
      image: 'static/QRCodeLogo.png',
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: 'Q',
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4,
      },
      dotsOptions: {
        type: 'dots',
        color: '#1F5D39',
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
      componentKey: 0,
      enteredQRCode: '',
      errorMessage: '',
    };
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') {
      this.enteredQRCode = 'https://test.com';
    }
    this.color = this.defaultColor;
    this.setQRColor(this.defaultColor);
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
        this.showQR = false;
        this.options.data = this.enteredQRCode;
        this.showQR = true;
      }
    },
    // download() {
    // const fileName = `QR-${this.options.data.replace('http://', '').replace('https://', '').replace('www.', '').substring(0, 12)}`;
    // this.qrCode.download({ extension: this.options.type, name: fileName });
    // },
    setQRColor() {
      const { options, color } = this;
      options.dotsOptions.color = color;
      options.cornersSquareOptions.color = color;
      options.cornersDotOptions.color = color;
      this.generateQR(false);
      this.componentKey += 1;
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
    transform: scale(.35)
    padding: 12px
    height: 800px
    background: white
    border-radius: 40px
    margin-top: -250px
    margin-bottom: -260px
.qr-card
  max-width: 972px
  padding: 20px
  +desktop
    margin: 0px auto !important
  .input-tip
    font-size: 14px
    a
      color: var(--color)
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
        color: var(--primary)
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
