<template>
  <div>
    <plain-header title='QR Codes' />
    <div id='qr-code' ref='qrCode'></div>
    <label>
      <input v-model='options.data' placeholder='Add data' />
      <button v-on:click='download'>Download</button>
    </label>
  </div>
</template>

<script>
import PlainHeader from '@/components/PlainHeader.vue';
import QRCodeStyling from 'qr-code-styling';

export default {
  components: {
    PlainHeader,
  },
  data: () => {
    const options = {
      width: 300,
      height: 300,
      type: 'png',
      data: 'https://www.youtube.com/watch?v=QtBDL8EiNZo&t=5s&ab_channel=%D9%B4',
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
      options,
      qrCode: new QRCodeStyling(options),
    };
  },
  mounted() {
    this.qrCode.append(this.$refs.qrCode);
  },
  methods: {
    download() {
      this.qrCode.download({ extension: this.extension, name: 'QR-Code' });
    },
  },
};
</script>
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
