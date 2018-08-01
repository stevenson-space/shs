<template>
  <a class="link" :href="href" target="_blank" v-if="type === 'a'">
    <slot/>
  </a>
  <router-link class="link" :to="href" v-else-if="type === 'router-link'">
    <slot/>
  </router-link>
  <div v-else>
    <slot/>
  </div>
</template>

<script>
export default {
  props: {
    href: { type: [String, Object], required: true },
  },
  computed: {
    type() {
      // router-link will be used if href is an object or a non URL string
      // a will be used if href is a URL string (starting with http)
      // otherwise a plain div will be used
      const { href } = this;
      if (href) {
        return typeof href === 'object' || href.indexOf('http') !== 0 ? 'router-link' : 'a';
      } else {
        return 'none';
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.link
  text-decoration: none
  display: block
  overflow: auto
  color: inherit

</style>
