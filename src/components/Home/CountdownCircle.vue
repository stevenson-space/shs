<template>
  <div class="circle" :class="{ 'full-screen': fullScreenMode }">
    <img src="images/patriot.png" class="logo">

    <div class="countdown" v-if="mode === 'current'">
      {{ countdown }}
    </div>
    <div class="range" v-else>
      {{ range }}
    </div>

    <div class="type" v-if="inSchool || mode === 'day'">{{ scheduleType }}</div>
    <div class="next-day" v-else>{{ nextDay }}</div>
  </div>
</template>

<script>
export default {
  props: {
    mode: { type: String, required: true },
    inSchool: { type: Boolean, required: true },
    countdown: { type: String, required: true },
    range: { type: String, required: true },
    nextDay: { type: String, required: true },
    scheduleType: { type: String, required: true },
    fullScreenMode: { type: Boolean, default: false },
  }
}
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.circle
  --circle-diameter: 285px
  --logo-width: 100px
  +mobile-small
    --circle-diameter: 230px
    --logo-width: 70px
  
  // +shadow
  background-color: white
  width: var(--circle-diameter)
  height: var(--circle-diameter)
  border-radius: 2000px
  font-weight: bold
  color: #333
  transition: width .2s, height .2s

  .logo
    width: var(--logo-width)
    margin: 0 calc((var(--circle-diameter) - var(--logo-width)) / 2)
    margin-top: 15px
    transition: margin .2s, width .2s
  
  .countdown
    transition: margin-top .2s, font-size .2s
    font-size: 3.5em
    line-height: 1em
    +mobile-small
      font-size: 3em

  .range
    transition: margin-top .2s, font-size .2s
    font-size: 2.5em
    +mobile-small
      font-size: 2em

  .type
    transition: margin-top .2s, font-size .2s
    margin-top: 12px
    font-size: 1.2em
    +mobile-small
      font-size: 1em
  
  .next-day
    transition: margin-top .2s, font-size .2s
    font-size: .85em
    margin: auto
    height: 75px
    display: flex
    align-items: center
    justify-content: center
    white-space: pre
    font-weight: normal
    +mobile-small
      font-size: .8em
      height: 65px
  
  &.full-screen
    --circle-diameter: 70vh
    --logo-width: 20vh

    // doing everything in terms of vh since circle-diameter is based on vh
    // and everyting else depends on it for proper alignment
    .countdown
      font-size: 12.5vh
      margin-top: 2vh

    .range
      font-size: 9vh
      margin-top: 10px

    .type
      font-size: 5vh
      margin-top: 35px
    
    .next-day
      font-size: 4vh
      margin-top: 6vh

</style>
