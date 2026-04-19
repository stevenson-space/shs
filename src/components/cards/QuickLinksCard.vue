<template>
  <card v-if="pinnedLinks.length" class="card" :ignoreStyleMutations="true">
    <div class="title">{{ title }}</div>
    <div class="links" :style="{ maxHeight: maxHeight || undefined }">
      <custom-link
        v-for="(link, index) in pinnedLinks"
        :key="link.id"
        class="link-row"
        :href="link.url"
        :new-tab="true"
      >
        <div class="circle">{{ index + 1 }}</div>
        <div class="content">
          <div class="name">{{ link.name }}</div>
          <div class="host">{{ getHostname(link.url) }}</div>
        </div>
        <font-awesome-icon :icon="icons.faArrowUpRightFromSquare" class="icon" />
      </custom-link>
    </div>
  </card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import useUserSettingsStore from '@/stores/user-settings';
import Card from '@/components/Card.vue';
import CustomLink from '@/components/CustomLink.vue';

const { title = 'Quick Links', maxHeight = '270px' } = defineProps<{
  title?: string;
  maxHeight?: string;
}>();

const userSettingsStore = useUserSettingsStore();

const pinnedLinks = computed(() => (
  userSettingsStore.customLinks.filter((link) => link.pinnedToHome)
));

const icons = {
  faArrowUpRightFromSquare,
};

function getHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch (e) {
    return url;
  }
}
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.card
  padding: 0 8px 6px

  .title
    text-align: center
    font-size: 1.5em
    margin: 15px 0

.links
  padding: 8px
  display: flex
  flex-direction: column
  gap: 8px
  overflow-y: auto
  scrollbar-width: none
  -webkit-overflow-scrolling: touch

.link-row
  +shadow
  min-width: 225px
  min-height: 37px
  border-radius: 100px
  background-color: var(--secondaryBackground)
  border: var(--accent) 1px solid
  display: flex
  align-items: center
  justify-content: space-between
  padding: 2px
  margin: 0
  width: auto
  transition: transform .15s ease

  &:hover
    transform: scale(1.01)

  .circle
    min-width: 15px
    height: 15px
    line-height: 15px
    border-radius: 15px
    background-color: rgba(0, 0, 0, 0.06)
    text-align: center
    font-weight: bold
    color: var(--accent)
    margin: 5px
    padding: 8px

  .content
    flex-grow: 1
    text-align: center
    min-width: 0
    color: var(--primary)
    line-height: 1.15

    .name
      font-weight: 700
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
      padding: 0 8px

    .host
      margin-top: 2px
      font-size: .78em
      color: var(--secondary)
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
      padding: 0 8px

  .icon
    color: var(--accent)
    font-size: .85em
    margin-right: 12px
    margin-left: 4px
</style>
