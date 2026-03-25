<template>
  <div>
    <plain-header title="Links" />
    <div class="custom-links-shell">
      <div class="custom-links-card">
        <div class="custom-links-copy">
          <h2>Custom Links</h2>
          <p>Pin your own frequently used sites so they live alongside the default Stevenson shortcuts.</p>
        </div>
        <div class="custom-links-form">
          <input
            v-model.trim="newLink.name"
            type="text"
            placeholder="Link name"
          >
          <input
            v-model.trim="newLink.url"
            type="url"
            placeholder="https://example.com"
          >
          <input
            v-model.trim="newLink.desc"
            type="text"
            maxlength="80"
            placeholder="Short description (optional)"
          >
          <div class="form-actions">
            <button type="button" class="primary-action" @click="addCustomLink">Add link</button>
            <button v-if="customLinks.length" type="button" class="secondary-action" @click="clearCustomLinks">Clear all</button>
          </div>
          <p v-if="error" class="form-error">{{ error }}</p>
        </div>
      </div>
    </div>
    <card-container class="container">
      <image-text-card
        v-for="(link, index) in customLinks"
        :key="`custom-${link.url}`"
        :style="{ 'animation-delay': `${index * .045}s` }"
        image="/favicon.ico"
        :text="link.name"
        :desc="link.desc || 'Custom shortcut'"
        :link="link.url"
        :link-props="{ newTab: true }"
      >
        <template #actions>
          <button type="button" class="delete-link" @click.stop.prevent="removeCustomLink(link.url)">Remove</button>
        </template>
      </image-text-card>
      <image-text-card
        v-for="(link, index) in links"
        :key="link.url"
        :style="{ 'animation-delay': `${(index + customLinks.length) * .045}s` }"
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
import StevensonClubs from '@/assets/links/StevensonClubs.png';
import PatriotPalooza from '@/assets/links/PatriotPalooza.png';

export default {
  components: {
    CardContainer,
    ImageTextCard,
    PlainHeader,
  },
  data() {
    return {
      storageKey: 'customLinks',
      newLink: {
        name: '',
        url: '',
        desc: '',
      },
      customLinks: [],
      error: '',
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
  mounted() {
    const savedLinks = localStorage.getItem(this.storageKey);
    if (!savedLinks) return;

    try {
      this.customLinks = JSON.parse(savedLinks);
    } catch {
      this.customLinks = [];
    }
  },
  methods: {
    saveCustomLinks() {
      localStorage.setItem(this.storageKey, JSON.stringify(this.customLinks));
    },
    addCustomLink() {
      const urlPattern = /^https?:\/\/.+/i;
      if (!this.newLink.name || !this.newLink.url) {
        this.error = 'Add both a name and a full URL.';
        return;
      }

      if (!urlPattern.test(this.newLink.url)) {
        this.error = 'Use a full URL starting with http:// or https://.';
        return;
      }

      if (this.customLinks.some((link) => link.url === this.newLink.url)) {
        this.error = 'That link is already saved.';
        return;
      }

      this.customLinks.unshift({
        name: this.newLink.name,
        url: this.newLink.url,
        desc: this.newLink.desc,
      });
      this.saveCustomLinks();
      this.newLink = { name: '', url: '', desc: '' };
      this.error = '';
    },
    removeCustomLink(url) {
      this.customLinks = this.customLinks.filter((link) => link.url !== url);
      this.saveCustomLinks();
    },
    clearCustomLinks() {
      this.customLinks = [];
      this.saveCustomLinks();
    },
  },
};
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.custom-links-shell
  max-width: $content-width
  margin: 0 auto
  padding: 0 10px

.custom-links-card
  background: linear-gradient(135deg, rgba(31, 93, 57, 0.12), rgba(31, 93, 57, 0.04))
  border: 1px solid rgba(31, 93, 57, 0.18)
  border-radius: 18px
  padding: 20px
  margin-bottom: 12px
  display: grid
  gap: 18px

  +desktop
    grid-template-columns: 1.1fr 1fr

.custom-links-copy
  h2
    margin: 0 0 8px 0

  p
    margin: 0
    color: var(--secondary)

.custom-links-form
  display: grid
  gap: 10px

  input
    border: 1px solid rgba(128, 128, 128, 0.25)
    border-radius: 12px
    padding: 12px 14px
    background: var(--background)
    color: var(--primary)

.form-actions
  display: flex
  flex-wrap: wrap
  gap: 10px

.primary-action, .secondary-action, .delete-link
  border: none
  border-radius: 999px
  padding: 10px 16px
  font-weight: bold
  cursor: pointer

.primary-action
  background: var(--accent)
  color: var(--background)

.secondary-action
  background: var(--secondaryBackground)
  color: var(--primary)

.delete-link
  position: absolute
  right: 12px
  bottom: 12px
  background: rgba(255, 255, 255, 0.95)
  color: #8b1e1e

.form-error
  margin: 0
  color: #8b1e1e
  font-weight: bold
</style>
