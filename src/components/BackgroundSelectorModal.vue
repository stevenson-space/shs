<template>
  <div>
    <transition name="fade">
      <div v-if="true" class="modal" @click="closeModal()">
        <div class="modal-content" @click.stop="">
          <div class="modal-header">
          <div class="title"><b>Select Background</b></div>
           <rounded-button class="button" text="Remove Background" />
          </div>
          <div v-for="collection in backgroundImages" :key="collection.title" class="image-collection">
          <div class="divider" />
            <div class="title">{{collection.title}}</div>
            <div class="image-row">
              <div v-for="image in collection.images" :key="image.id">
                <img class="preview-image" :src="image.url + '?w=150&h=85&fit=fill&f=center&r=7&q=50'" alt="">
                <div class="description">{{image.description}}</div>
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
import RoundedButton from '@/components/RoundedButton.vue';

export default {
  computed: {
    ...mapState(['backgroundImages']),
  },
  components: {
    RoundedButton,
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
  padding: 5px
  border-radius: 10px
  .title
    text-align: left
    font-size: 25px !important
    margin: 5px 0

  .image-row
    display: flex
    flex-flow: row wrap
    gap: 10px
    .preview-image
      +shadow-light

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
    max-width: 1200px
    max-height: 70%
    overflow: auto
    text-align: center
    letter-spacing: .5px
    .modal-header
      padding-top: 8px
      display: flex
      justify-content: space-between
      .title
        font-size: 25px
    .divider
      width: 100%
      height: 1px
      margin-top: 5px
      background: #E5E7E9
    .button
      width: 180px
    .title
      font-size: 1.25em
      padding: 5px 0px
</style>
