<template>
  <card>
    <a class="main-link" href="https://shshacks.io" target="_blank">
      <img class="logo" src="images/shsHacks.png">
      <div class="text">
        <div class="name">shsHacks</div>
        <div class="register">Register by 8:59pm today!</div>
      </div>
    </a>

    <div class="line"/>

    <div class="deregister">Please click <a class="link" href="https://goo.gl/forms/K0f8b5yYHJqYiRHz1" target="_blank">here</a> if you registered but can't attend</div>
  </card>
</template>

<script>
import Card from 'common/Card.vue';

export default {
  components: { Card },
}
</script>

<style lang="sass" scoped>
.main-link
  display: flex
  align-items: center
  text-decoration: none
  color: black

  .logo
    height: 55px
    margin: 5px 0

  .text
    flex: 1

    .name
      color: #275D38
      font-weight: bold
      font-size: 1.4em

    .register
      font-size: .85em

.line
  height: 2px
  background-color: var(--color)
  width: 100%

.deregister
  font-size: .75em
  text-align: center
  margin: 7px 0

  .link
    color: var(--color)
    font-weight: bold

</style>

