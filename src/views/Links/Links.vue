<template>
  <div>
    <plain-header title="Links" />
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
import CardContainer from '@/components/CardContainer.vue';
import ImageTextCard from '@/components/cards/ImageTextCard.vue';
import PlainHeader from '@/components/PlainHeader.vue';

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

export default {
  components: {
    CardContainer,
    ImageTextCard,
    PlainHeader,
  },
  data() {
    return {
      links: [ /* eslint-disable max-len */
        { name: 'D125', url: 'https://www.d125.org/', image: D125 },
        { name: 'Canvas', desc: 'Must be logged in using school Google account', url: 'https://d125.instructure.com/', image: Canvas },
        { name: 'IRC', desc: 'Must be logged in using school Google account', url: 'https://irc.d125.org/login', image: IRC },
        { name: 'Infinite Campus', url: 'https://infinitecampus.d125.org/campus/portal/aes.jsp', image: InfiniteCampus },
        { name: 'Naviance', url: 'https://student.naviance.com/aeshs', image: Naviance },
        { name: 'SHSMaps', url: 'https://shsmaps.com', image: SHSMaps },
        { name: 'GiveAThon', url: 'https://shsgiveathon.com/', image: GiveAThon },
        { name: 'Peer Tutors', desc: 'Must be logged in using school Google account', url: 'https://sites.google.com/d125.org/peer-tutors/content-database', image: PeerTutors },
        { name: 'Patriot Dollars', url: 'https://get.cbord.com/d125/full/login.php', image: PatriotDollars },
      ],
    };
  },
};
</script>
