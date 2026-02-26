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

<script setup lang="ts">
import gsap from 'gsap';

const {
  isColorSelector = false,
  align = 'right',
  numberOfSlots = 0,
  direction,
} = defineProps<{
  isColorSelector?: boolean // if it's coming the color selector component
  align?: 'left' | 'right' | 'center'
  numberOfSlots?: number   // used if slots will be changed after initial render
  direction: 'up' | 'down'
}>();

function onBeforeEnter(el: Element): void {
  (el as HTMLElement).style.opacity = '0';
}

function onEnter(el: Element, done: () => void): void {
  const { height } = el.getBoundingClientRect();
  gsap.to(el, {
    opacity: 1,
    y: direction === 'down' ? 0 : (-1 * (height + 7.7) * numberOfSlots - (height + 15)),
    height: isColorSelector ? '30px' : 'auto',
    marginBottom: isColorSelector ? '0px' : '8px',
    textAlign: 'left',
    delay: (el as HTMLElement).dataset.index * 0.01,
    onComplete: done,
    duration: numberOfSlots * 0.05,
  });
}

function onLeave(el: Element, done: () => void): void {
  gsap.to(el, {
    opacity: 0,
    duration: isColorSelector ? 0 : 0.2,
    delay: isColorSelector ? 0 : ((numberOfSlots - 1) - (el as HTMLElement).dataset.index) * (0.2 / numberOfSlots),
    onComplete: done,
  });
}
</script>

<style lang="sass" scoped>
.transition-group
  position: absolute
  display: flex
  flex-direction: column
  width: 100%
  margin-top: 10px
</style>
