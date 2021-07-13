<template>
  <div class="calendar-navigation">
    <div class="mobile-row">
      <dropdown
        v-show="filterCategories.length > 1"
        class="filter-dropdown"
        :options="filterCategories"
        :value="selectedFilter"
        :show-selected-as-option="false"
        align="left"
        @input="selectFilter($event)"
      />

      <home-link class="home" />
    </div>
    <div class="main">
      <dropdown
        v-show="filterCategories.length > 1"
        class="filter-dropdown"
        :options="filterCategories"
        :value="selectedFilter"
        :show-selected-as-option="false"
        align="left"
        @input="selectFilter($event)"
      />

      <font-awesome-icon class="icon" :icon="icons.faChevronLeft" @click="$emit('previous-month')" />

      <div class="text">
        <div class="month">{{ month }}</div>
        <div class="year">{{ year }}</div>
      </div>

      <font-awesome-icon class="icon" :icon="icons.faChevronRight" @click="$emit('next-month')" />

      <home-link class="home" />
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import HomeLink from '@/components/HomeLink.vue';
import Dropdown from '@/components/Dropdown.vue';

export default {
  components: { FontAwesomeIcon, HomeLink, Dropdown },
  props: {
    month: { type: String, required: true },
    year: { type: Number, required: true },
    filterCategories: { type: Array, default: () => [] },
  },
  data() {
    return {
      icons: {
        faChevronLeft,
        faChevronRight,
      },
      selectedFilter: 0,
    };
  },
  watch: {
    month() { this.selectFilter(0); },
    year() { this.selectFilter(0); },
  },
  methods: {
    selectFilter(index) {
      this.selectedFilter = index;
      this.$emit('filter-selected', this.filterCategories[index]);
    },
  },
};
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.calendar-navigation
  .filter-dropdown
    position: absolute
    left: 10px
    color: #444
    font-weight: bold
    +mobile
      top: 6px

  .home
    position: absolute
    right: 5px

  .mobile-row
    height: 40px
    display: none
    +mobile
      display: block

  .main
    display: flex
    align-items: center
    justify-content: center
    color: var(--color)

    .filter-dropdown, .home
      +mobile
        display: none

    .icon
      cursor: pointer
      width: 50px
      font-size: 1.5em

    .text
      text-align: center
      background-color: var(--background)
      font-weight: bold
      padding: 5px 15px
      user-select: none
      width: 275px

      .month
        font-size: 1.2em
        letter-spacing: 2px

      .year
        font-size: .7em

</style>
