<template>
  <div id="sitebar">
    <img class="logo" :src="logo"></div>
  </div>
</template>

<script>
export default {
  props: {
    logo: { type: String, required: true },
  },
}
</script>

<style lang="sass" scoped>
#sitebar
    height: 350px
    width: 95%
    //background-color: tomato
    
    display: flex
    flex-flow: row nowrap
    justify-content: space-between
    align-items: center

    .logo
        //width: 15%
        height: 90%

</style>
