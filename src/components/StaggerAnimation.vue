<template>
  <TransitionGroup
    class='transition-group'
    tag="ul"
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @leave="onLeave"
  >
    <slot />
  </TransitionGroup>
</template>

<script>
import gsap from 'gsap';

export default {
  props: {
    // duration: { type: Number, required: true }, // duration is in milliseconds
    shiftAmount: { type: Number, required: true },
    numberOfSlots: { type: Number, default: 0 }, // used if slots will be changed after initial render
    direction: {
      validator: (str) => (str === 'up' || str === 'down'),
      required: true,
    },
  },
  data() {
    return {
      duration: 100,
    };
  },
  computed: {
    staggerDuration() {
      return (this.duration / this.slotCount) / 2;
    },
  },
  methods: {
    onBeforeEnter(el) {
      el.style.opacity = 0;
      el.style.height = 0;
    },
    onEnter(el, done) {
      gsap.to(el, {
        opacity: 1,
        height: 'auto',
        marginBottom: '5px',
        textAlign: 'left',
        // delay: el.dataset.index * 1,
        onComplete: done,
      });
    },
    onLeave(el, done) {
      gsap.to(el, {
        opacity: 0,
        height: 0,
        // delay: el.dataset.index * 1,
        onComplete: done,
      });
    },
    open() {

    },
    close() {
      // const { shiftDistance } = this;
      // // this.setOpacity(0);
      // return this.stagger((elements, i) => {
      //   // Need to go in the reverse direction when closing (last element animates first)
      //   // so calculate the ith element from the end
      //   const j = elements.length - i - 1;
      //   this.setShifts(elements, shiftDistance * j, j);
      // });
    },
  },
};
</script>

<style lang="sass" scoped>
.transition-group
  position: absolute
</style>
