<template>
  <div class="settings">
    <div class="hamburger-menu" @click="showSidenav = true">
      <font-awesome-icon :icon="icons.faBars"/>
    </div>

    <div class="sidenav-background" :class="{ show: showSidenav }" @click="showSidenav = false"/>
    <div class="sidenav" :class="{ show: showSidenav }">
      <div class="close-arrow" @click="showSidenav = false">
        <font-awesome-icon :icon="icons.faArrowLeft"/>
      </div>

      <div class="title"><font-awesome-icon :icon="icons.faCog"/> Settings</div>

      <a v-for="item in sidenavLinks" class="link" :href="item.link" @click="showSidenav = false">
        <font-awesome-icon :icon="item.icon" class="icon"/>
        <span class="text">{{ item.text }}</span>
      </a>
    </div>

    <div class="main">
      <home-link class="home-link"/>

      <schedules id="schedules"/>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import { faCog, faBars, faArrowLeft, faListAlt } from '@fortawesome/free-solid-svg-icons';

import HomeLink from 'common/HomeLink.vue';
import Schedules from './Schedules.vue';

const sidenavLinks = [
  { text: 'Schedules', link: '#schedules', icon: faListAlt },
]

export default {
  data() {
    return {
      icons: {
        faCog,
        faBars,
        faArrowLeft,
      },
      sidenavLinks,
      showSidenav: false,
    }
  },
  components: {
    FontAwesomeIcon,
    HomeLink,
    Schedules,
  }
}
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.settings
  --sidenav-width: 325px
  +tablet
    --sidenav-width: 250px
  +mobile
    --sidenav-width: 275px

  .hamburger-menu
    cursor: pointer
    font-size: 1.5em
    padding: 10px
    position: absolute
    left: 10px
    color: var(--color)

  .sidenav-background
    background-color: rgb(0, 0, 0)
    position: fixed
    top: 0
    left: 0
    width: 100vw
    height: 100vh
    opacity: 0
    z-index: -1
    &.show
      opacity: .65
      z-index: 2

  .sidenav
    width: var(--sidenav-width)
    height: 100vh
    background-color: #333
    position: fixed
    background-color: var(--color)
    transition: transform .2s
    z-index: 5
    +mobile
      transform: translateX(calc(-1 * var(--sidenav-width) - 5px))
      &.show
        transform: translateX(0)

    .close-arrow
      color: white
      font-size: 1.5em
      padding: 10px 15px
      cursor: pointer
      display: none
      +mobile
        display: inline-block

    .title
      color: white
      text-align: center
      font-size: 2.25em
      font-weight: bold
      letter-spacing: 1px
      margin-bottom: 50px
      margin-top: 30px
      +mobile
        margin-top: 10px
      // border-bottom: 3px solid white

    .link
      text-decoration: none
      color: white
      padding: 15px
      padding-left: 70px
      display: block
      background-color: rgba(255, 255, 255, .2)
      +tablet
        padding-left: 35px
      +mobile
        padding-left: 50px

      .icon
        font-size: 1.3em

      .text
        font-size: 1.2em
        margin-left: 25px

  .main
    margin-left: var(--sidenav-width)
    padding-top: 100px
    +mobile
      margin-left: 0

    .home-link
      position: absolute
      right: 20px
      top: 10px
      +mobile
        right: 10px

</style>
