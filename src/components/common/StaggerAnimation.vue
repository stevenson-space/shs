<template>
  <div class="stagger-animation">
    <slot/>
  </div>
</template>

<script>
export default {
  props: {
    duration: { type: Number, required: true },
    shiftAmount: { type: Number, required: true },
    numberOfSlots: { type: Number, default: 0 }, // used if slots will be changed after initial render
    direction: {
      validator: str => (str === 'up' || str === 'down'),
      required: true,
    }
  },
  data() {
    return {
      tempTransition: '',
    }
  },
  computed: {
    shiftDistance() {
      // reverse the direction of shiftAmount if the direction is up
      const directions = { 'down': 1, 'up': -1 };
      const shiftAmount = (directions[this.direction] || 0) * this.shiftAmount;
      return shiftAmount;
    },
    slotCount() {
      return this.numberOfSlots || (this.$slots.default || []).length;
    },
    staggerDuration() {
      return (this.duration / this.slotCount) / 2;
    }
  },
  methods: {
    setShifts(elements, value, start = 0) {
      // sets the y shift of each element in the elements array after start index 
      elements.slice(start).forEach(element => {
        element.style.transform = `translateY(${value}px)`;
      })
    },
    stagger(func) {
      if (this.slotCount > 0) {
        const elements = this.$slots.default.map(vnode => vnode.elm);

        elements.forEach((_, i) => {
          setTimeout(() => {
            func(elements, i);
          }, this.staggerDuration * i);
        });
      }
    },
    setOpacity(value) {
      if (this.slotCount > 0) {
        this.$slots.default.forEach(vnode => {
          vnode.elm.style.opacity = value;
        });
      }
    },
    open(instantly = false) {
      const { shiftDistance } = this;

      this.setOpacity(1);
      return this.stagger((elements, i) => {
        this.setShifts(elements, shiftDistance * i + shiftDistance, i);
      });
    },
    close(instantly = false) {
      const { shiftDistance } = this;

      this.setOpacity(0);
      return this.stagger((elements, i) => {
        // Need to go in the reverse direction when closing (last element animates first)
        // so calculate the ith element from the end
        const j = elements.length - i - 1;
        this.setShifts(elements, shiftDistance * j, j);
      });
    },
    setSlotStyles() {
      // The following is super dirty, but necessary for animations

      // wait until slots render before setting styles
      this.$nextTick(() => {
        if (this.slotCount > 0) {

          let prefix = '';

          // if the transition property already contains a value, we want to keep the existing transitions
          // in addition to adding the new transform and opacity transitions
          let currentTransition = getComputedStyle(this.$slots.default[0].elm).transition;
          if (currentTransition && currentTransition !== 'all 0s ease 0s') {
            prefix = `${currentTransition}, `;
          }

          const duration = this.duration / 1000;
          const transition = `${prefix}transform ${duration}s, opacity ${duration}s linear`;


          this.$slots.default.forEach((vnode, i) => {
            vnode.elm.style.transition = transition;
            vnode.elm.classList.add('slotElement');

            // later elements should stack underneath prior ones
            // and add the existing z-index in case these elements should go above some other element (determined by parent)
            vnode.elm.style.zIndex = (this.$slots.default.length - i) + (Number(getComputedStyle(vnode.elm).zIndex) || 0);
          });
        }
      });
    }
  },
  mounted() {
    const { duration } = this;
    this.setSlotStyles();
  },
  watch: {
    numberOfSlots() {
      this.setSlotStyles();
    }
  }
}
</script>

<style lang="sass" scoped>

.slotElement
  position: absolute
  top: 0
  opacity: 0

</style>
