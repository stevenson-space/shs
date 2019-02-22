<template>
  <card>
    <a class="main-link" href="https://shshacks.io" target="_blank">
      <img class="logo" src="images/shsHacks.png">
      <div class="text">
        <div class="name">shsHacks</div>
        <div class="register">Deadline: 8:59pm</div>
      </div>
      <font-awesome-icon :icon="faExternalLinkAlt" class="link-icon"/>
    </a>

    <div class="line"/>

    <div class="deregister">Please click <a class="emphasize" href="https://goo.gl/forms/K0f8b5yYHJqYiRHz1" target="_blank">here</a> if you registered but can <span class="emphasize">NOT</span> attend</div>
  </card>
</template>

<script>
import Card from 'common/Card.vue';
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

export default {
  data() {
    return { 
      faExternalLinkAlt
    }
  },
  components: { Card, FontAwesomeIcon },
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
      font-size: .75em

  .link-icon
    margin-right: 15px
    font-size: 1.25em
    color: var(--color)

.line
  height: 2px
  background-color: var(--color)
  width: 100%

.deregister
  font-size: .7em
  text-align: center
  margin: 7px 0

  .emphasize
    color: var(--color)
    font-weight: bold
    font-size: 1.25em

</style>

