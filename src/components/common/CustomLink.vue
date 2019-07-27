<template>
  <a v-if="linkType === 'a'" class="link" :href="href" :target="target">
    <slot />
  </a>
  <router-link v-else-if="linkType === 'router-link'" class="link" :to="href" :target="target">
    <slot />
  </router-link>
  <div v-else>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    href: { type: [String, Object], required: true },
    type: { type: String, default: '' },
    newTab: { type: Boolean, default: false },
  },
  computed: {
    linkType() {
      if (this.type) {
        return this.type;
      }

      // router-link will be used if href is an object or a non URL string
      // a will be used if href is a URL string (starting with http)
      // otherwise a plain div will be used
      const { href } = this;
      if (href) {
        return typeof href === 'object' || href.indexOf('http') !== 0 ? 'router-link' : 'a';
      }

      return 'none';
    },
    target() {
      return this.newTab ? '_blank' : '_self';
    },
  },
};
</script>

<style lang="sass" scoped>
.link
  text-decoration: none
  display: block
  overflow: auto
  color: inherit

</style>
