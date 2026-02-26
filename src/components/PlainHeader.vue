<template>
  <div class="plain-header">
    <home-link class="home-link" />
    <span class="title">{{ title }}</span>
  </div>
</template>

<script setup lang="ts">
import HomeLink from './HomeLink.vue';

defineProps<{ title: string }>();
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.plain-header
  max-width: $content-width
  margin: auto
  position: relative
  margin-top: 10px
  color: var(--accent)
  +mobile
    text-align: center

  .title
    line-height: 120px
    font-size: 3.5em
    font-weight: bold
    margin-left: 10px
    +mobile
      margin-left: 0

  .home-link
    position: absolute
    top: 10px
    right: 15px
    +mobile-small
      top: 0
      right: 5px

</style>
