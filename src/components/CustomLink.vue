<template>
  <a v-if="linkType === 'a'" class="link" :href="href" :target="target" :rel="rel">
    <slot />
  </a>
  <router-link v-else-if="linkType === 'router-link'" class="link" :to="href" :target="target">
    <slot />
  </router-link>
  <div v-else>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const { href, type = '', newTab = false } = defineProps<{
  href: string | object
  type?: string
  newTab?: boolean
}>();

const linkType = computed((): string => {
  if (type) return type;
  // router-link will be used if href is an object or a non URL string
  // a will be used if href is a URL string (starting with http)
  // otherwise a plain div will be used
  if (href) {
    return typeof href === 'object' || !/^[A-Za-z][A-Za-z0-9+.-]*:/.test(href as string) ? 'router-link' : 'a';
  }
  return 'none';
});

const target = computed(() => (newTab ? '_blank' : '_self'));
const rel = computed(() => (target.value === '_blank' ? 'noopener noreferrer' : undefined));
</script>

<style lang="sass" scoped>
.link
  text-decoration: none
  display: block
  overflow: auto
  color: inherit

</style>
