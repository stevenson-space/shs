<template>
  <div class="settings-section">
    <div class="heading">
      <div class="title">{{ title }}</div>
      <slot name="heading-content"/>
    </div>

    <slot/>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, required: true },
  }
}
</script>

<style lang="sass" scoped>

@import 'src/styles/style.sass'

.settings-section
  width: 100%
  padding-left: 100px
  box-sizing: border-box
  +tablet
    padding-left: 50px
  +mobile
    padding-left: 20px
  
  .heading
    border-bottom: #555 3px solid
    display: flex
    justify-content: space-between
    align-items: center
    padding-right: 10px

    .title
      font-size: 2.75em
      font-weight: bold
      color: #555
      +mobile
        font-size: 2em

</style>
