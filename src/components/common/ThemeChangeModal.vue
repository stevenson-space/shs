<template>
  <div>
    <transition name="fade">
      <div v-if="showModal" class="modal" @click="closeModal()">
        <div class="modal-content" @click.stop="">
          <div class="title"><b>Color Conflict</b></div>
          <div class="divider" />
          <p>Do you want to override your current selection to the suggested color for the {{ newTheme["name"] }} theme?</p>
          <div class="btn-row">
            <div class="color-circle" :style="{ background: color }"></div>
             <font-awesome-icon
            class="arrow"
            :icon="icons.faArrowRight"
          />
            <div
              class="color-circle"
              :style="{ background: newTheme['suggestedColor'] }"
            ></div>
          </div>
          <br />
          <div class="btn-row">
            <rounded-button class="button" text="Yes" @click="$emit('yes')" :circular="false" />
            <rounded-button class="button" text="No" @click="$emit('no')" :circular="false" />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
import { faArrowRight,faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import RoundedButton from "common/RoundedButton.vue";
import { mapState } from "vuex";

export default {
  components: { FontAwesomeIcon, RoundedButton },
  props: {
    newTheme: { type: Object, required: true },
    showModal: { type: Boolean, required: true },
  },
  computed: {
    ...mapState(["color"]),
  },
  data() {
    return {
      icons: {
        faQuestionCircle,
        faArrowRight,
      },
    };
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
  },
};
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'
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
.fade-enter-active, .fade-leave-active
  transition: all 0.20s

.fade-enter, .fade-leave-to
  opacity: 0

.info-circle
  color: var(--color)
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
