<template>
  <popup :show="show || showAlt" @close="cancel">
    <slot/>
    <div class="text" v-show="text">{{ text }}</div>
    <div class="buttons">
      <div class="button" @click="cancel">{{ cancelText }}</div>
      <div class="button inverse" @click="ok">{{ okText }}</div>
    </div>
  </popup>
</template>

<script>
import Popup from 'common/Popup.vue';

// 2 ways to use this component:
//   - Method 1: use the 'show' prop to display and hide,
//               use the slot to control content
//               use the 'cancel' and 'ok' events to do something based on user action
//   - Method 2: use a reference to this component and call the 'displayPopup' method with the text as the parameter,
//               which returns a Promise (success or fail depending on user action)

export default {
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
    }
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
    }
  },
  components: {
    Popup,
  }
}
</script>

<style lang="sass" scoped>

.text
  max-width: 300px
  padding: 20px 35px
  font-size: 1.2em
  text-align: center
  font-weight: bold

.buttons
  display: flex
  justify-content: flex-end
  margin: 0 10px
  margin-bottom: 10px

  .button
    border: var(--color) 1.5px solid
    border-radius: 7px
    padding: 5px 15px
    margin: 0 10px
    // background-color: var(--color)
    // color: white
    // font-size: 1.1em
    font-weight: bold
    cursor: pointer
    color: var(--color)

    &.inverse
      // border: none
      background-color: var(--color)
      color: white

</style>

