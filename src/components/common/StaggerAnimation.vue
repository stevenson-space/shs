<template>
  <div class="stagger-animation">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    duration: { type: Number, required: true }, // duration is in milliseconds
    shiftAmount: { type: Number, required: true },
    numberOfSlots: { type: Number, default: 0 }, // used if slots will be changed after initial render
    direction: {
      validator: str => (str === 'up' || str === 'down'),
      required: true,
    },
  },
  data() {
    return {
      tempTransition: '',
    };
  },
  computed: {
    shiftDistance() {
      // reverse the direction of shiftAmount if the direction is up
      const directions = { down: 1, up: -1 };
      const shiftAmount = (directions[this.direction] || 0) * this.shiftAmount;
      return shiftAmount;
    },
    slotCount() {
      return this.numberOfSlots || (this.$slots.default || []).length;
    },
    staggerDuration() {
      return (this.duration / this.slotCount) / 2;
    },
  },
  watch: {
    numberOfSlots() {
      this.setSlotStyles();
    },
  },
  mounted() {
    this.setSlotStyles();
  },
  methods: {
    setShifts(elements, value, start = 0) {
      // sets the y shift of each element in the elements array after start index
      elements.slice(start).forEach((element) => {
        // If the translateY is not already set, add it to any existing transforms
        // Otherwise, replace the existing translateY value with the new one
        const { transform } = element.style;
        if (transform.indexOf('translateY(') === -1) {
          element.style.transform += ` translateY(${value}px)`;
        } else {
          element.style.transform = transform.replace(/^(.*translateY\()-?\d+(px\).*)$/, `$1${value}$2`);
        }
      });
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
        this.$slots.default.forEach((vnode) => {
          vnode.elm.style.opacity = value;
        });
      }
    },
    open() {
      const { shiftDistance } = this;

      this.setOpacity(1);
      return this.stagger((elements, i) => {
        this.setShifts(elements, shiftDistance * i + shiftDistance, i);
      });
    },
    close() {
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
      this.$nextTick(() => { // wait until slots render before setting styles
        if (this.slotCount > 0) {
          // The following gets rid of any existing transitions, so if parent needs to transition something, use containers
          const durationSeconds = this.duration / 1000;
          const transition = `transform ${durationSeconds}s, opacity ${durationSeconds}s linear`;

          this.$slots.default.forEach((vnode, i) => {
            vnode.elm.style.transition = transition;
            vnode.elm.classList.add('slot-element');

            // later elements should stack underneath prior ones
            vnode.elm.style.zIndex = (this.$slots.default.length - i);
          });
        }
      });
    },
  },
};
</script>

<style lang="sass" scoped>

.slot-element
  position: absolute
  top: 0
  opacity: 0

</style>
