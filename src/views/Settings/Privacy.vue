<template>
  <settings-section title="Privacy Policy">
    <div class="iframe-container">
      <iframe
        title="Privacy Policy"
        src="https://www.iubenda.com/privacy-policy/40291148"
        frameBorder="0"
      ></iframe>
    </div>
  </settings-section>
</template>

<script>
import SettingsSection from './SettingsSection.vue';

export default {
  components: { SettingsSection },
  data() {
    return {};
  },
};
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.iframe-container
  display: flex
  justify-content: center
  width: 100%
  iframe
    margin-top: 15px
    margin-right: 10px
    border-radius: 10px
    +shadow-light

iframe
   height: 800px
   width: 100%
   overflow: hidden
   ::-webkit-scrollbar
    width: 0px
    height: 0px
</style>
