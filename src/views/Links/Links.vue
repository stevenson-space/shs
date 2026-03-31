<template>
  <div>
    <plain-header title="Links" />

    <div class="section-title">Your Links</div>
    <card-container class="container" v-if="customLinks.length">
      <icon-text-card
        v-for="(link, index) in customLinks"
        :key="link.id"
        :style="{ 'animation-delay': index * .045 + 's'}"
        :icon="icons.faLink"
        :text="link.name"
        :link="link.url"
        :link-props="{ newTab: true }"
        :invert="index % 2 === 1"
      />
    </card-container>
    <div v-else class="empty-links">
      No personal links yet. Add some in Settings > Quick Links.
    </div>

    <div class="section-title">School Links</div>
    <card-container class="container">
      <image-text-card
        v-for="(link, index) in links"
        :key="link.url"
        :style="{ 'animation-delay': index * .045 + 's'}"
        :image="link.image"
        :text="link.name"
        :desc="link.desc"
        :link="link.url"
        :link-props="{ newTab: true }"
      />
    </card-container>
  </div>
</template>

<script>
import { mapState } from 'pinia';
import CardContainer from '@/components/CardContainer.vue';
import ImageTextCard from '@/components/cards/ImageTextCard.vue';
import IconTextCard from '@/components/cards/IconTextCard.vue';
import PlainHeader from '@/components/PlainHeader.vue';
import useUserSettingsStore from '@/stores/user-settings';
import { faLink } from '@fortawesome/free-solid-svg-icons';

// I've spent way too much time on trying to dynamically import images, this will have to work for the time being
import D125 from '@/assets/links/D125.png';
import IRC from '@/assets/links/IRC.png';
import InfiniteCampus from '@/assets/links/Infinite Campus.png';
import Naviance from '@/assets/links/Naviance.png';
import PeerTutors from '@/assets/links/Peer Tutors.png';
import PatriotDollars from '@/assets/links/Patriot Dollars.png';
import Canvas from '@/assets/links/Canvas.png';
import SHSMaps from '@/assets/links/SHSMaps.png';
import GiveAThon from '@/assets/links/GiveAThon.png';
import StevensonClubs from '@/assets/links/StevensonClubs.png';
import PatriotPalooza from '@/assets/links/PatriotPalooza.png';

export default {
  components: {
    CardContainer,
    ImageTextCard,
    IconTextCard,
    PlainHeader,
  },
  data() {
    return {
      icons: {
        faLink,
      },
      links: [ /* eslint-disable max-len */
        { name: 'D125', url: 'https://www.d125.org/', image: D125 },
        { name: 'Canvas', desc: 'Must be logged in using school Google account', url: 'https://d125.instructure.com/login/saml', image: Canvas },
        { name: 'IRC', desc: 'Must be logged in using school Google account', url: 'https://irc.d125.org/login', image: IRC },
        { name: 'Infinite Campus', url: 'https://infinitecampus.d125.org/campus/portal/aes.jsp', image: InfiniteCampus },
        { name: 'Naviance', url: 'https://student.naviance.com/aeshs', image: Naviance },
        { name: 'SHSMaps', url: 'https://shsmaps.com', image: SHSMaps },
        { name: 'GiveAThon', url: 'https://shsgiveathon.com/', image: GiveAThon },
        { name: 'Peer Tutors', desc: 'Must be logged in using school Google account', url: 'https://sites.google.com/d125.org/peer-tutors/content-database', image: PeerTutors },
        { name: 'Patriot Dollars', url: 'https://get.cbord.com/d125/full/login.php', image: PatriotDollars },
        { name: 'Activities Database', url: 'https://stevensonclubs.space/database', image: StevensonClubs },
        { name: 'Patriot Palooza', url: 'https://patriotpalooza.netlify.app/', image: PatriotPalooza },
      ],
    };
  },
  computed: {
    ...mapState(useUserSettingsStore, ['customLinks']),
  },
};
</script>

<style lang="sass" scoped>
.section-title
  max-width: 1200px
  margin: 12px auto 6px auto
  padding: 0 12px
  font-size: 1.3em
  color: var(--secondary)
  font-weight: 700

.empty-links
  max-width: 1200px
  margin: 0 auto 10px auto
  padding: 0 12px
  color: var(--secondary)
</style>
