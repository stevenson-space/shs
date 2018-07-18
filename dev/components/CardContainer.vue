<template>
  <div class="card-container">
    <slot/>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="sass" scoped>
@import '../styles/style.sass'

.card-container
    // width: 100%
    max-width: $content-width
    margin: auto
    display: flex
    flex-flow: row wrap
    justify-content: center
    align-items: center
    
</style>
