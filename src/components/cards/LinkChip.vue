<template>
  <a class="link-chip" :href="href" target="_blank" :style="{ backgroundColor: background }">
    <img :src="faviconUrl" :alt="alt || 'favicon'" />
    <span>{{ label }}</span>
  </a>
</template>

<script>
export default {
  name: "LinkChip",
  props: {
    href: { type: String, required: true },
    label: { type: String, required: true },
    favicon: { type: String, required: false },
    background: { type: String, default: "#fff" },
    alt: { type: String, default: "" }
  },
  computed: {
    faviconUrl() {
      return (
        this.favicon ||
        `https://www.google.com/s2/favicons?sz=64&domain_url=${this.href}`
      );
    }
  }
};
</script>

<style lang="sass" scoped>
.link-chip
  display: inline-flex
  align-items: center
  gap: 8px
  padding: 6px 12px
  border-radius: 999px
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15)
  font-size: 0.85em
  color: #333
  text-decoration: none
  font-weight: 500
  transition: box-shadow 0.2s ease, transform 0.2s ease

  &:hover
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2)
    transform: translateY(-1px)

  img
    width: 16px
    height: 16px
    border-radius: 3px
</style>
