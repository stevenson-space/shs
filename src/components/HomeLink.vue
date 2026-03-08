<template>
  <div @click="goHome" class="home-link">
    <div class="home" :class="{ invert }">
      <font-awesome-icon class="icon" :icon="faHouse" fixed-width />
      <span class="text">Home</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { faHouse } from '@fortawesome/free-solid-svg-icons';

const { invert = true } = defineProps<{ invert?: boolean }>();

const router = useRouter();

function goHome(e: PointerEvent): void {
  if (e.pointerType === 'touch') {
    // if touched, show animation first before going home (computers will see animation on hover)
    setTimeout(() => router.push('/'), 130);
  } else {
    router.push('/');
  }
}
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.home-link
  .home
    color: var(--secondary)
    border-radius: 100px
    padding: 7px
    transition: box-shadow .2s
    text-decoration: none
    display: flex
    align-items: center
    background-color: var(--background)
    z-index: 1
    transition: background-color .2s, color .2s

    .icon
      font-size: 1.5em

    .text
      display: block
      max-width: 0
      overflow: hidden
      transition: max-width .2s
      font-size: 1.1em

    &:hover
      +shadow

      .text
        max-width: 60px
        margin: 0 5px

    &.invert:hover
      color: white
      background-color: var(--accent)

</style>
