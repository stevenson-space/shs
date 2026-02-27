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

<script setup lang="ts">
// 2 ways to use this component:
//   - Method 1: use the 'show' prop to display and hide,
//               use the slot to control content
//               use the 'cancel' and 'ok' events to do something based on user action
//   - Method 2: use a reference to this component and call the 'displayPopup' method with the text as the parameter,
//               which returns a Promise (success or fail depending on user action)

import { ref } from 'vue';
import Popup from '@/components/Popup.vue';
import RoundedButton from '@/components/RoundedButton.vue';

const { show = false, okText = 'OK', cancelText = 'Cancel' } = defineProps<{
  show?: boolean
  okText?: string
  cancelText?: string
}>();

const emit = defineEmits<{ ok: [], cancel: [] }>();

const showAlt = ref(false);
const text = ref('');
let promiseResolve: () => void = () => {};
let promiseReject: (reason?: unknown) => void = () => {};

function ok(): void {
  emit('ok');
  promiseResolve();
  reset();
}

function cancel(): void {
  emit('cancel');
  promiseReject('Canceled');
  reset();
}

function reset(): void {
  promiseResolve = () => {};
  promiseReject = () => {};
  showAlt.value = false;
  text.value = '';
}

function displayPopup(message: string): Promise<void> {
  if (showAlt.value) {
    promiseReject(new Error('popup replaced'));
    promiseResolve = () => {};
    promiseReject = () => {};
  }
  return new Promise((resolve, reject) => {
    text.value = message;
    promiseResolve = resolve;
    promiseReject = reject;
    showAlt.value = true;
  });
}

defineExpose({ displayPopup });
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

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
  margin: 0 0px
  margin-bottom: 10px

  .button
    margin-right: 10px

</style>
