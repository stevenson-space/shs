<template>
  <TransitionGroup
    class='transition-group'
    tag="div"
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @leave="onLeave"
    :style="{ 'align-items': align == 'left' ? 'flex-start' : (align == 'right' ? 'flex-end' : (align == 'center' ? 'center': 'flex-start')) }"
  >
    <slot />
  </TransitionGroup>
</template>

<script>
import gsap from 'gsap';

export default {
  props: {
    isColorSelector: { type: Boolean, required: false },
    align: {
      validator: (str) => str === 'left' || str === 'right' || str === 'center',
      default: 'right',
    },
    numberOfSlots: { type: Number, default: 0 }, // used if slots will be changed after initial render
    direction: {
      validator: (str) => (str === 'up' || str === 'down'),
      required: true,
    },
  },
  methods: {
    onBeforeEnter(el) {
      el.style.opacity = 0;
    },
    onEnter(el, done) {
      gsap.to(el, {
        opacity: 1,
        height: this.isColorSelector ? '30px' : 'auto',
        marginBottom: this.isColorSelector ? '0px' : '8px',
        textAlign: 'left',
        delay: el.dataset.index * 0.01,
        onComplete: done,
        duration: this.numberOfSlots * 0.05,
      });
    },
    onLeave(el, done) {
      gsap.to(el, {
        opacity: 0,
        duration: this.isColorSelector ? 0 : 0.2,
        delay: ((this.numberOfSlots - 1) - el.dataset.index) * 0.02,
        onComplete: done,
      });
    },
  },
};
</script>

<style lang="sass" scoped>
.transition-group
  position: absolute
  display: flex
  flex-direction: column
  width: 100%
  margin-top: 10px
</style>
