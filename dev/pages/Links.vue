<template>
  <div>
    <div class="title">
      <span>Links</span>
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
import CardContainer from '../components/CardContainer.vue';
import ImageTextCard from '../components/ImageTextCard.vue';

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
  components: { CardContainer, ImageTextCard },
}
</script>

<style lang="sass" scoped>
@import '../styles/style.sass'

.title
  max-width: 1000px
  margin: auto
  font-size: 4em
  line-height: 125px
  // margin-top: 10px
  font-weight: bold
  color: $color
  // padding-left: 200px
  // margin-right: 300px
  // text-align: center
  // text-decoration: underline
  // border-bottom: $color 5px solid
  +mobile
    text-align: center

  span
    margin-left: 50px
    +mobile
      margin-left: 0

.container
  // +shadow
  // width: 95%
  // border-radius: 15px
  // padding: 10px 0

</style>
