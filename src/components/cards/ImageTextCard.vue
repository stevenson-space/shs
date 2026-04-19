<template>
  <card ref="card" class="card">
    <custom-link :href="link" v-bind="linkProps">
      <img class="image" alt="" :src="image" @load="setHeight">
      <div class="text-group text">{{ text }}</div>
      <div class="text-group desc">{{ desc }}</div>
    </custom-link>
    <slot name="actions" />
  </card>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue';
import Card from '@/components/Card.vue';
import CustomLink from '@/components/CustomLink.vue';

const { image, text, desc, link, linkProps = {} } = defineProps<{
  image: string;
  text: string;
  desc?: string;
  link: string | Record<string, any>;
  linkProps?: Record<string, any>;
}>();

const cardRef = useTemplateRef<{ setHeight:() => void }>('card');

function setHeight(): void {
  cardRef.value?.setHeight();
}
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.card
  cursor: pointer
  background-color: black !important
  +animate-fade-up
  .image
    width: 100%
    display: block
    opacity: .5
    transition: opacity .2s

  .text-group
    font-weight: bold
    color: white
    position: absolute
    height: 100%
    width: 95%
    left: 2.5%
    top: 0
    display: flex
    justify-content: center
    align-items: center
    text-align: center

  .text
    font-size: 2em

  .desc
    position: absolute
    font-size: 15px
    top: 40px

  &:hover
    .image
      opacity: 1

    .text,.desc
      display: none

</style>
