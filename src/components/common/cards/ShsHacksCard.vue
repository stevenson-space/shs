<template>
  <card>
    <a class="main-link" href="https://shshacks.io" target="_blank">
      <img class="logo" src="static/shsHacks.png">
      <div class="register">
        Free-to-attend virtual hackathon,
        register by <span class="color">11:59pm</span> on Saturday (4/17)! &nbsp;
        <font-awesome-icon :icon="faExternalLinkAlt" class="link-icon" />
      </div>
    </a>
  </card>
</template>

<script>
import Card from 'common/Card.vue';
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

export default {
  components: { Card, FontAwesomeIcon },
  data() {
    return {
      faExternalLinkAlt,
    };
  },
};
</script>

<style lang="sass" scoped>
.main-link
  display: flex
  align-items: center
  text-decoration: none
  color: black
  justify-content: center
  flex-direction: column

  .logo
    height: 100px
    padding: 10px 5px

  .register
    font-size: .85em
    text-align: left
    padding-bottom: 10px
    margin: 0 20px
    line-height: 1.6em
    text-align: center
    .color
      color: var(--color)
      font-weight: bold

    .link-icon
      font-size: 1.1em
      color: var(--color)


</style>
