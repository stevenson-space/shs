<template>
  <card class="card" :class="{ invert }">
    <component
      :is="link ? CustomLink : 'div'"
      v-bind="link ? { href: link, ...linkProps } : { tabindex: '0', role: 'button' }"
      @click="handleClick"
      @keydown="handleKeydown"
    >
      <div class="icon">
        <font-awesome-icon class="boxIcon" :icon="icon" size="5x" v-bind="iconProps" />
      </div>
      <div class="text">{{ text }}</div>
    </component>
  </card>
</template>

<script setup lang="ts">
import Card from '@/components/Card.vue';
import CustomLink from '@/components/CustomLink.vue';

const { icon, text, link = '', linkProps = {}, invert = false, iconProps = {} } = defineProps<{
  icon: Record<string, any>;
  text: string;
  link?: string | Record<string, any>;
  linkProps?: Record<string, any>;
  invert?: boolean;
  iconProps?: Record<string, any>;
}>();

const emit = defineEmits<{ click: [] }>();

function handleClick(): void {
  if (!link) {
    emit('click');
  }
}

function handleKeydown(event: KeyboardEvent): void {
  if (!link && (event.key === 'Enter' || event.key === ' ')) {
    if (event.key === ' ') event.preventDefault();
    emit('click');
  }
}
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.card
  background: var(--accent) !important
  color: var(--iconCardsRegular)
  transition: transform .4s
  &.invert
    background-color: var(--secondaryBackground) !important
    color: var(--iconCardsInvert)
  &:hover
    transform: scale(1.03)

  .icon
    display: flex
    justify-content: center
    align-items: center
    margin-top: 40px
    margin-bottom: 15px

  .text
    font-weight: bold
    letter-spacing: 1.5px
    text-align: center
    font-size: 1.5em
    margin-bottom: 45px

  .boxIcon
    height: 65px
    +desktop
      height: 75px
</style>
