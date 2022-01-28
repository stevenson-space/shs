<template>
  <div>
    <transition name="fade">
      <div v-if="true" class="modal" @click="closeModal()">
        <div class="modal-content" @click.stop="">
          <div class="title"><b>Select Background</b></div>
          <div class="divider" />
          <!-- <p>{{backgroundImages}}</p> -->
          <div v-for="collection in backgroundImages" :key="collection.title" class="image-collection">
            <div class="title">{{collection.title}}</div>
            <div class="image-row">
              <div v-for="image in collection.images" :key="image.id">
                <!-- <div class="description">{{image.description}}</div> -->
                <img class="preview-image" :src="image.url" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState(['backgroundImages']),
  },
  methods: {
    ...mapActions([
      'fetchBackgroundImages',
    ]),
    closeModal() {
      this.$emit('close');
    },
  },
  created() {
    this.fetchBackgroundImages();
  },
};
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.image-collection
  .title
    text-align: left
    font-size: 20px !important
    margin-top: 5px
    font-weight: 600

  .image-row
    display: flex
    flex-flow: row wrap
    gap: 10px
    .preview-image
      +shadow-light
      width: 150px
      border-radius: 8px

.fade-enter-active, .fade-leave-active
  transition: all 0.20s
.fade-enter, .fade-leave-to
  opacity: 0

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
    max-width: 800px
    font-size: 1rem
    font-weight: normal
    text-align: center
    letter-spacing: .5px
    .title
      font-size: 1.25em
      padding: 5px 0px
</style>
