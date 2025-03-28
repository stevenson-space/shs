<template>
  <div class="card-container">
    <slot />
  </div>
</template>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.card-container
  max-width: $content-width
  margin: 8px auto

  // the following creates lots of rows, each with 5px of height
  // the card will then decide how many rows to span based on its height
  // this allows for arbitrarily tall cards while still filling all the space (masonry layout)
  display: grid
  padding: 0 5px
  grid-auto-rows: 5px

  grid-template-columns: 1fr
  +tablet-small
    grid-template-columns: 1fr 1fr
  +desktop
    grid-template-columns: 1fr 1fr 1fr

</style>
