<template>
  <popup :show="show || showAlt" @close="cancel">
    <slot />
    <div v-show="text" class="text">{{ text }}</div>
    <div class="buttons">
      <rounded-button v-if="cancelText" class="button" :text="cancelText" :circular="false" @click="cancel" />
      <rounded-button v-if="okText" class="button" :text="okText" :circular="false" :invert="true" @click="ok" />
    </div>
  </popup>
</template>

<script>
import Popup from 'common/Popup.vue';
import RoundedButton from 'common/RoundedButton.vue';

// 2 ways to use this component:
//   - Method 1: use the 'show' prop to display and hide,
//               use the slot to control content
//               use the 'cancel' and 'ok' events to do something based on user action
//   - Method 2: use a reference to this component and call the 'displayPopup' method with the text as the parameter,
//               which returns a Promise (success or fail depending on user action)

export default {
  components: {
    Popup,
    RoundedButton,
  },
  props: {
    show: { type: Boolean, default: false },
    okText: { type: String, default: 'OK' },
    cancelText: { type: String, default: 'Cancel' },
  },
  data() {
    return {
      showAlt: false,
      text: '',
      promiseResolve: () => {},
      promiseReject: () => {},
    };
  },
  methods: {
    ok() {
      this.$emit('ok');
      this.promiseResolve();
      this.reset();
    },
    cancel() {
      this.$emit('cancel');
      this.promiseReject('Canceled');
      this.reset();
    },
    reset() {
      this.promiseResolve = () => {};
      this.promiseReject = () => {};
      this.showAlt = false;
      this.text = '';
    },
    displayPopup(text) {
      return new Promise((resolve, reject) => {
        this.text = text;
        this.promiseResolve = resolve;
        this.promiseReject = reject;

        this.showAlt = true;
      });
    },
  },
};
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.text
  max-width: 400px
  padding: 20px 30px
  font-size: 1.2em
  text-align: center
  font-weight: bold
  box-sizing: border-box
  overflow-wrap: break-word
  +mobile-small
    max-width: calc(100vw - 40px)

.buttons
  display: flex
  justify-content: flex-end
  margin: 0 10px
  margin-bottom: 10px

  .button
    margin: 0 10px

</style>
