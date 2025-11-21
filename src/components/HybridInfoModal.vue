<template>
  <div v-if="scheduleType === 'Patriot Hybrid' || scheduleType === 'Remote Learning'">
    <div class="info-circle" @click="openModal()">
      <font-awesome-icon :icon="icons.faQuestionCircle" fixed-width />
    </div>

    <transition name="fade">
      <div v-if="showModal" class="modal" @click="closeModal()">
        <div class="modal-content" @click.stop="">
          <div class="title"> <b>Schedules change next week to the standard schedule for optional in-person learning</b></div>
          <div class="divider" />
          <p>
            There will no longer be color groups. There will also be two almost identical schedules for in-person and remote learning. The only difference between the schedules is passing period length.
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

export default {
  props: {
    scheduleType: { type: String, required: true },
  },
  data() {
    return {
      showModal: false,
      icons: {
        faQuestionCircle,
      },
    };
  },
  methods: {
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
  },
};
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.fade-enter-active, .fade-leave-active
  transition: all 0.20s

.fade-enter, .fade-leave-to
  opacity: 0

.info-circle
  color: var(--accent)
  cursor: pointer

.modal
  position: fixed
  z-index: 100
  left: 0
  top: 0
  width: 100%
  height: 100%
  overflow: auto
  background-color: rgba(0, 0, 0, 0.4)

  .modal-content
    transition: 1s all ease-in-out
    border-radius: 15px
    background-color: white
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
