<template>
  <div class="settings">
    <div class="sidenav">
      <div class="title"><font-awesome-icon :icon="icons.faCog"/> Settings</div>
      <a v-for="item in sidenavLinks" class="link" :href="item.link">
        <font-awesome-icon :icon="item.icon" class="icon"/>
        <span class="text">{{ item.text }}</span>
      </a>
    </div>

    <div class="main">
      <div class="schedule">
        <a id="schedule"></a>
        <div class="title">Schedules</div>
        <div class="schedule-cards">
          <schedule-card
            v-for="schedule in schedules[0].modes"
            class="card"
            :schedule="schedule"
            :title="schedule.name"
            :key="schedule.name"/>
          <card>
            <div class="add-new-card">
              <font-awesome-icon :icon="icons.faPlus"/>
              <div class="text">Add Custom</div>
            </div>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import { faCog, faListAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { mapState } from "vuex";

import Card from 'common/Card.vue';
import ScheduleCard from 'common/cards/ScheduleCard.vue';

const sidenavLinks = [
  { text: 'Schedules', link: '#schedules', icon: faListAlt },
  // { text: '', link: '' },
  // { text: '', link: '' },
  // { text: '', link: '' },
  // { text: '', link: '' },
]

export default {
  data() {
    return {
      icons: {
        faCog,
        faPlus,
      },
      sidenavLinks,
    }
  },
  computed: mapState([
    'schedules',
  ]),
  components: {
    FontAwesomeIcon,
    Card,
    ScheduleCard
  }
}
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.settings
  // --sidenav-width: 20%
  --sidenav-width: 325px
  +tablet
    --sidenav-width: 250px

  .sidenav
    width: var(--sidenav-width)
    height: 100vh
    background-color: #333
    position: fixed
    background-color: var(--color)

    .title
      color: white
      line-height: 100px
      text-align: center
      font-size: 2.25em
      font-weight: bold
      letter-spacing: 1px
      margin-bottom: 50px
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

      .icon
        font-size: 1.3em

      .text
        font-size: 1.2em
        margin-left: 25px

  .main
    display: flex
    margin-left: var(--sidenav-width)

    .schedule
      margin-top: 100px
      width: 100%
      padding-left: 150px
      +tablet
        padding-left: 50px

      .title
        font-size: 2.75em
        // margin-left: 150px
        font-weight: bold
        // color: var(--color)
        border-bottom: #555 3px solid
        // border-bottom: var(--color) 3px solid
        color: #555

      .schedule-cards
        // display: flex
        // flex-wrap: wrap
        display: grid
        grid-template-columns: 1fr 1fr 1fr 1fr
        @media screen and (max-width: 1535px)
          grid-template-columns: 1fr 1fr 1fr
        @media screen and (max-width: 1150px)
          grid-template-columns: 1fr 1fr

        .card
          // width: 23%
          // flex: 1
          // min-width: 250px
          zoom: .8
        
        .add-new-card
          height: 200px
          display: flex
          justify-content: center
          align-items: center
          flex-direction: column
          font-size: 2.8em
          color: var(--color)
          cursor: pointer
          
          .text
            margin-top: 15px
            font-weight: bold
            font-size: .75em


</style>
