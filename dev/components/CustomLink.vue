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
