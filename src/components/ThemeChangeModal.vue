<template>
    <div v-if="showModal">
      <div class="modal" @click="closeModal()">
        <div class="modal-content" @click.stop="">
          <div class="title"><b>Color Conflict</b></div>
          <div class="divider" />
          <p>Do you want to override your current color selection to the suggested color for the {{ newTheme["name"] }} theme?</p>
          <div class="btn-row">
            <div class="color-circle" :style="{ background: themeStore.color }"></div>
             <font-awesome-icon
            class="arrow"
            :icon="faArrowRight"
          />
            <div
              class="color-circle"
              :style="{ background: newTheme['suggestedColor'] }"
            ></div>
          </div>
          <br />
          <div class="btn-row">
            <rounded-button class="button" :showColor="false" text="No" @click="$emit('false')" :circular="false" />
            <rounded-button class="button" :showColor="false" text="Yes" @click="$emit('true')" :circular="false" />
          </div>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import useThemeStore from '@/stores/themes'
import RoundedButton from '@/components/RoundedButton.vue'

const { newTheme, showModal } = defineProps<{
  newTheme: Record<string, any>
  showModal: boolean
}>()

const emit = defineEmits<{
  'false': []
  'true': []
  close: []
}>()

const themeStore = useThemeStore()

function closeModal(): void {
  emit('close')
}
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'
.btn-row
  display: flex
  justify-content: center
  align-items: center
.color-circle
  height: 50px
  width: 50px
  border-radius: 50px
.arrow
  padding: 10px 20px
.button
  margin: 4px
.info-circle
  color: var(--accent)
  cursor: pointer
.modal
  +animate-fade-up
  position: fixed
  z-index: 100
  left: 0
  top: -50px
  width: 100%
  height: calc(100vh + 50px)
  overflow: auto
  background-color: rgba(0, 0, 0, 0.4)
  .modal-content
    border-radius: 15px
    background-color: var(--background)
    margin: 100px auto
    padding: 5px 10px 5px 15px
    width: 80%
    max-width: 500px
    font-size: 1rem
    font-weight: normal
    text-align: center
    letter-spacing: .5px
    .title
      font-size: 1.25em
      padding: 5px 0px
    .divider
      width: 100%
      height: 1px
      background: #E5E7E9
</style>
