<template>
  <div>
    <plain-header title="Links" />
    <card-container class="container">
      <image-text-card
        v-for="link in links"
        :key="link.url"
        :image="`static/links/${link.name}.png`"
        :text="link.name"
        :desc="link.desc"
        :link="link.url"
        :link-props="{ newTab: true }"
      />
    </card-container>
  </div>
</template>

<script>
import CardContainer from 'common/CardContainer.vue';
import ImageTextCard from 'common/cards/ImageTextCard.vue';
import PlainHeader from 'common/PlainHeader.vue';

export default {
  components: {
    CardContainer,
    ImageTextCard,
    PlainHeader,
  },
  data() {
    return {
      links: [ /* eslint-disable max-len */
        { name: 'Health Check', url: 'https://www.admittance.app/org/d125.org' },
        { name: 'D125', url: 'https://www.d125.org/' },
        { name: 'Canvas', desc: 'Must be logged in using school google account', url: 'https://d125.instructure.com/' },
        { name: 'IRC', url: 'https://irc.d125.org' },
        { name: 'Infinite Campus', url: 'https://infinitecampus.d125.org/campus/portal/aes.jsp' },
        { name: 'Naviance', url: 'https://student.naviance.com/aeshs' },
        { name: 'Peer Tutors', desc: 'Must be logged in using school google account', url: 'https://sites.google.com/d125.org/peer-tutors/home' },
        // { name: 'Testing Center', url: 'https://docs.google.com/forms/d/e/1FAIpQLSdMoby5m1oNCMi_VgINPE-FDqPqjH5XlvgdDXUFxS4lJbb4Ng/viewform' },
        { name: 'Patriot Dollars', url: 'https://d125-sp.transactcampus.com/eaccounts/%28S%28hpb5gh0sgji4hrhmx2ymnvot%29%29/AnonymousHome.aspx' }      ], /* eslint-enable max-len */
    };
  },
};
</script>

<style lang="sass" scoped>

</style>
