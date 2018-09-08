<template>
  <div>
    <div class="header">
      <home-link class="home-link"/>
      <span class="title">Links</span>
    </div>
    <card-container class="container">
      <image-text-card
        v-for="link in links"
        :image="`images/links/${link.name}.png`"
        :text="link.name"
        :link="link.url"
        :key="link.url"/>
    </card-container>
  </div>
</template>

<script>
import CardContainer from 'common/CardContainer.vue';
import ImageTextCard from 'common/cards/ImageTextCard.vue';
import HomeLink from 'common/HomeLink.vue';

export default {
  data() {
    return {
      links: [
        { name: 'D125', url: 'https://www.d125.org/' },
        { name: 'Patriot Dollars', url: 'https://d125-sp.blackboard.com/eaccounts/%28S%28r2hohbnbliid2we2awrnv4hq%29%29/AnonymousHome.aspx' },
        { name: 'Infinite Campus', url: 'https://infinitecampus.d125.org/campus/portal/aes.jsp' },
        { name: 'Powerschool Learning', url: 'https://d125.learning.powerschool.com/do/account/login' },
        { name: 'Tableau', url: 'http://tableau.d125.org/#/signin?destination=%2F' },
        { name: 'Testing Center', url: 'https://docs.google.com/forms/d/e/1FAIpQLSdMoby5m1oNCMi_VgINPE-FDqPqjH5XlvgdDXUFxS4lJbb4Ng/viewform' },
        { name: 'Naviance', url: 'https://student.naviance.com/aeshs' },
        { name: 'Google Classroom', url: 'https://classroom.google.com/' },
      ]
    }
  },
  components: {
    CardContainer,
    ImageTextCard,
    HomeLink,
  },
}
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.header
  max-width: $content-width
  margin: auto
  position: relative
  margin-top: 10px
  color: var(--color)
  +mobile
    text-align: center

  .title
    line-height: 125px
    font-size: 4em  
    font-weight: bold
    margin-left: 50px
    +mobile
      margin-left: 0
  
  .home-link
    position: absolute
    top: 10px
    right: 10px
    +mobile-small
      top: 0
      right: 5px

</style>
