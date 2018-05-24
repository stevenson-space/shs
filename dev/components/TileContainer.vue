<template>
  <div class="tile-container">
    <slot/>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="sass" scoped>
.tile-container
    width: 100%
    display: flex
    flex-flow: column nowrap
    justify-content: center
    align-items: center

</style>
