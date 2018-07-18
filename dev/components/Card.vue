<template>
  <div class="card">
    <slot/>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="sass" scoped>
@import '../styles/style.sass'

.card
  width: 95%
  @include tablet
    width: 45%
  @include desktop
    width: 30%
  // height: 350px
  // background-color: #EEEEEE//#86B3D9
  background-color: white
  border-radius: 15px
  margin: 15px
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)
  position: relative

</style>
