<template>
  <div class="switch-by-device">
    <div class="thing" :class="defaultThingClasses"><slot/></div>
    <div class="thing mobile"><slot name="mobile"/></div>
    <div class="thing tablet"><slot name="tablet"/></div>
    <div class="thing desktop"><slot name="desktop"/></div>
  </div>
</template>

<script>
export default {
  computed: {
    defaultThingClasses() {
      const classes = ['mobile', 'tablet', 'desktop'];

      Object.keys(this.$slots).forEach(slotName => {
        const index = classes.indexOf(slotName);
        if (index > -1) {
          classes.splice(index, 1); // remove that class
        }
      });

      return classes;
    }
  }
}
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.thing
  display: none

  &.mobile
    +mobile
      display: initial

  &.tablet
    +tablet
      display: initial

  &.desktop
    +desktop
      display: initial

</style>

