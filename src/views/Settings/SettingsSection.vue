<template>
  <div class="settings-section">
    <div class="heading">
      <div class="title">{{ title }}</div>
      <slot name="heading-content" />
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, required: true },
  },
};
</script>

<style lang="sass" scoped>

@import '@/styles/style.sass'

.settings-section
  width: 100%
  padding-left: 100px
  box-sizing: border-box
  margin-bottom: 50px
  +tablet
    padding-left: 50px
  +mobile
    padding-left: 20px

  .heading
    border-bottom: var(--tertiary) 3px solid
    display: flex
    justify-content: space-between
    align-items: center
    padding-right: 10px

    .title
      font-size: 2.75em
      font-weight: bold
      color: var(--tertiary)
      +mobile
        font-size: 2em

</style>
