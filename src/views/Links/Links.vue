<template>
  <div>
    <plain-header title="Links" />
    <div class="your-links">
      <div class="your-links-header">
        <div class="section-title">Your Links</div>
        <button class="manage-button" @click="managerOpen = true">Edit / Manage</button>
      </div>

      <div v-if="customLinks.length" class="quick-link-cards">
        <a
          v-for="link in customLinks"
          :key="link.id"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="quick-link-card"
        >
          <div class="quick-link-name">{{ link.name }}</div>
          <div class="quick-link-url">{{ link.url }}</div>
        </a>
      </div>
      <div v-else class="empty-links">
        No personal links yet. Click Edit / Manage to add one.
      </div>
    </div>

    <popup :show="managerOpen" @close="managerOpen = false">
      <div class="manager-popup">
        <div class="manager-header">
          <div class="manager-title">Manage Quick Links</div>
          <button class="manage-button close" @click="managerOpen = false">Close</button>
        </div>
        <quick-links-manager :hide-header="true" :embedded="true" />
      </div>
    </popup>

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
import PlainHeader from '@/components/PlainHeader.vue';
import QuickLinksManager from '@/components/QuickLinksManager.vue';
import Popup from '@/components/Popup.vue';
import useUserSettingsStore from '@/stores/user-settings';

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
    Popup,
    QuickLinksManager,
    PlainHeader,
  },
  data() {
    return {
      managerOpen: false,
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

.your-links
  max-width: 1200px
  margin: 0 auto 16px auto
  padding: 0 12px

.your-links-header
  display: flex
  justify-content: space-between
  align-items: center
  gap: 12px
  flex-wrap: wrap

.manage-button
  border: 1px solid rgba(128, 128, 128, .35)
  border-radius: 999px
  background: var(--background)
  color: var(--secondary)
  font-weight: 700
  padding: 8px 12px
  cursor: pointer
  font-size: .85em
  white-space: nowrap

  &.close
    padding: 7px 11px

.quick-link-cards
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr))
  gap: 10px
  margin-top: 8px

.quick-link-card
  border: 1px solid rgba(128, 128, 128, .3)
  border-radius: 12px
  padding: 10px 12px
  text-decoration: none
  background: rgba(128, 128, 128, .05)
  transition: transform .15s ease

  &:hover
    transform: translateY(-1px)

.quick-link-name
  color: var(--accent)
  font-weight: 700

.quick-link-url
  color: var(--secondary)
  margin-top: 4px
  font-size: .83em
  word-break: break-all

.empty-links
  color: var(--secondary)
  margin-top: 6px

.manager-popup
  width: min(760px, calc(100vw - 24px))
  max-height: 85vh
  overflow-y: auto
  padding: 16px
  box-sizing: border-box

.manager-header
  display: flex
  justify-content: space-between
  align-items: center
  gap: 10px
  margin-bottom: 10px

.manager-title
  font-size: 1.2em
  font-weight: 700
  color: var(--secondary)
</style>
