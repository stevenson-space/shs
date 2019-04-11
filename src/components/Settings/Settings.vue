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

      <a v-for="item in sidenavLinks" class="link" :href="item.link">
        <font-awesome-icon :icon="item.icon" class="icon"/>
        <span class="text">{{ item.text }}</span>
      </a>
    </div>

    <div class="main">
      <home-link class="home-link"/>

      <div class="schedule">
        <a id="schedule"></a>

        <div class="section-heading">
          <div class="title">Schedules</div>
          <rounded-button @click="restoreSchedules" text="Restore to Defaults" :icon="icons.faHistory"/>
        </div>

        <div class="schedule-cards">
          <schedule-card
            v-for="schedule in scheduleModes"
            class="card"
            :schedule="schedule"
            :title="schedule.name"
            :key="schedule.name">
              <div class="actions">
                <div class="action" @click="deleteSchedule(schedule.name)">
                  <font-awesome-icon :icon="icons.faTrashAlt"/> Delete
                </div>
                
                <div class="action" @click="editSchedule(schedule.name)">
                  <font-awesome-icon :icon="icons.faPencilAlt"/> Edit
                </div>
              </div>
          </schedule-card>

          <card>
            <div class="add-new-card" @click="$router.push('/add-schedule')">
              <font-awesome-icon :icon="icons.faPlus"/>
              <div class="text">Add Custom</div>
            </div>
          </card>
        </div>
      </div>
    </div>

    <confirm-popup ref="confirm-popup"/>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import { faCog, faListAlt, faPlus, faPencilAlt, faTrashAlt, faHistory, faBars, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { mapState } from "vuex";

import Bell from 'src/js/bell.js';
import Card from 'common/Card.vue';
import ScheduleCard from 'common/cards/ScheduleCard.vue';
import ConfirmPopup from 'common/ConfirmPopup.vue';
import RoundedButton from 'common/RoundedButton.vue';
import HomeLink from 'common/HomeLink.vue';

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
        faPencilAlt,
        faTrashAlt,
        faHistory,
        faBars,
        faArrowLeft,
      },
      sidenavLinks,
      showSidenav: false,
    }
  },
  computed: {
    ...mapState([
      'schedules',
    ]),
    scheduleModes() {
      const scheduleModes = [];
      const addedModeNames = new Set();

      // filtering out multiday schedules for now (too complex...), and no school days (indicated by modes.length === 0)
      const filteredSchedules = this.schedules.filter(schedule => 
        schedule.modes.length > 0 && !Bell.isMultiDay(schedule.modes[0])
      );

      filteredSchedules.forEach(schedule => {
        schedule.modes.forEach(mode => {
          if (!addedModeNames.has(mode.name)) {
            scheduleModes.push(mode);
            addedModeNames.add(mode.name);
          }
        });
      });

      return scheduleModes;
    }
  },
  methods: {
    deleteSchedule(name) {
      this.$refs['confirm-popup'].displayPopup(`Are you sure you want to delete the schedule '${name}'`)
        .then(() => {
          this.$store.commit('removeScheduleMode', { scheduleToRemove: name });
        }, () => {
          // don't need to do anything if the user cancels
        })
    },
    editSchedule(name) {
      this.$router.push({ name: 'editSchedules', params: { scheduleToEdit: name } });
    },
    restoreSchedules() {
      this.$refs['confirm-popup'].displayPopup('Are you sure you want to erase your changes')
        .then(() => {
          this.$store.commit('resetSchedules');
        }, () => {});
    }
  },
  components: {
    FontAwesomeIcon,
    Card,
    ScheduleCard,
    ConfirmPopup,
    RoundedButton,
    HomeLink,
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
      transform: translateX(calc(-1 * var(--sidenav-width)))
      &.show
        transform: translateX(0)

    .close-arrow
      color: white
      font-size: 1.5em
      padding: 10px 15px
      cursor: pointer

    .title
      color: white
      text-align: center
      font-size: 2.25em
      font-weight: bold
      letter-spacing: 1px
      margin-bottom: 50px
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

      .icon
        font-size: 1.3em

      .text
        font-size: 1.2em
        margin-left: 25px

  .main
    display: flex
    margin-left: var(--sidenav-width)
    +mobile
      margin-left: 0

    .home-link
      position: absolute
      right: 20px
      top: 10px

    .schedule
      margin-top: 100px
      width: 100%
      padding-left: 150px
      +tablet
        padding-left: 50px
      +mobile
        padding-left: 20px

      .section-heading
        border-bottom: #555 3px solid
        display: flex
        justify-content: space-between
        align-items: center
        padding-right: 10px

        .title
          font-size: 2.75em
          // margin-left: 150px
          font-weight: bold
          // color: var(--color)
          // border-bottom: var(--color) 3px solid
          color: #555
          +mobile
            font-size: 2em

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

          .actions
            display: flex
            padding: 10px 0 5px 0
            border-top: 1.5px solid var(--color)
            // margin-top: 5px

            .action
              flex: 1
              text-align: center
              font-size: 1.25em
              color: var(--color)
              font-weight: bold
              cursor: pointer
        
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
