<template>
  <div class="quick-links-manager" :class="{ embedded }">
    <div v-if="!hideHeader" class="section-title">Your Links</div>
    <div v-if="!hideHeader" class="subtitle">
      Add personal links for quick access. Pin links to show them on your Home page card.
    </div>

    <form class="link-form" @submit.prevent="saveLink">
      <div class="input-group">
        <label for="quick-link-name">Name</label>
        <input
          id="quick-link-name"
          v-model="name"
          maxlength="24"
          placeholder="Example: Math Notes"
        >
      </div>

      <div class="input-group">
        <label for="quick-link-url">URL</label>
        <input
          id="quick-link-url"
          v-model="url"
          maxlength="200"
          placeholder="https://example.com"
        >
      </div>

      <checkbox v-model="pinnedToHome" label-size=".95em">
        Pin to Home
      </checkbox>

      <div class="error" v-if="errorMessage">{{ errorMessage }}</div>

      <div class="form-actions">
        <button type="submit" class="action-button primary">
          {{ editingId ? 'Save Changes' : 'Add Link' }}
        </button>
        <button v-if="editingId" type="button" class="action-button" @click="cancelEdit">
          Cancel
        </button>
      </div>

      <div class="count">{{ customLinks.length }} / 10 links used</div>
    </form>

    <div v-if="customLinks.length" class="links-list">
      <div v-for="link in customLinks" :key="link.id" class="link-item">
        <div class="link-info">
          <a :href="link.url" target="_blank" rel="noopener noreferrer" class="link-name">
            {{ link.name }}
          </a>
          <div class="link-url">{{ link.url }}</div>
          <div v-if="link.pinnedToHome" class="pinned">Pinned to Home</div>
        </div>

        <div class="link-actions">
          <button type="button" class="action-button" @click="startEdit(link)">Edit</button>
          <button type="button" class="action-button" @click="removeLink(link.id)">Delete</button>
          <button
            type="button"
            class="action-button"
            @click="togglePinned(link)"
          >
            {{ link.pinnedToHome ? 'Unpin from Home' : 'Pin to Home' }}
          </button>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      No personal links yet.
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapState } from 'pinia';
import Checkbox from '@/components/Checkbox.vue';
import useUserSettingsStore from '@/stores/user-settings';
import { MapStateToComputed, UserQuickLink } from '@/utils/types';

type UserSettingsStoreState = {
  customLinks: UserQuickLink[];
}

export default defineComponent({
  props: {
    hideHeader: {
      type: Boolean,
      default: false,
    },
    embedded: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Checkbox,
  },
  data() {
    return {
      name: '',
      url: '',
      pinnedToHome: false,
      editingId: '',
      errorMessage: '',
    };
  },
  computed: {
    ...(mapState(useUserSettingsStore, ['customLinks']) as MapStateToComputed<UserSettingsStoreState>),
  },
  methods: {
    ...mapActions(useUserSettingsStore, ['addCustomLink', 'updateCustomLink', 'removeCustomLink']),

    isValidHttpUrl(link: string): boolean {
      try {
        const parsed = new URL(link);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
      } catch (e) {
        return false;
      }
    },

    validateForm(): string {
      const trimmedName = this.name.trim();
      const trimmedUrl = this.url.trim();

      if (!trimmedName) return 'Please enter a link name.';
      if (trimmedName.length > 24) return 'Name must be 24 characters or less.';
      if (!trimmedUrl) return 'Please enter a link URL.';
      if (trimmedUrl.length > 200) return 'URL must be 200 characters or less.';
      if (!this.isValidHttpUrl(trimmedUrl)) return 'URL must start with http:// or https://.';
      if (!this.editingId && this.customLinks.length >= 10) return 'You can only save up to 10 links.';

      return '';
    },

    saveLink(): void {
      const validationMessage = this.validateForm();
      if (validationMessage) {
        this.errorMessage = validationMessage;
        return;
      }

      if (this.editingId) {
        this.updateCustomLink({
          id: this.editingId,
          name: this.name,
          url: this.url,
          pinnedToHome: this.pinnedToHome,
        });
      } else {
        this.addCustomLink({
          name: this.name,
          url: this.url,
          pinnedToHome: this.pinnedToHome,
        });
      }

      this.cancelEdit();
    },

    startEdit(link: UserQuickLink): void {
      this.name = link.name;
      this.url = link.url;
      this.pinnedToHome = link.pinnedToHome;
      this.editingId = link.id;
      this.errorMessage = '';
    },

    cancelEdit(): void {
      this.name = '';
      this.url = '';
      this.pinnedToHome = false;
      this.editingId = '';
      this.errorMessage = '';
    },

    removeLink(id: string): void {
      this.removeCustomLink(id);
      if (this.editingId === id) {
        this.cancelEdit();
      }
    },

    togglePinned(link: UserQuickLink): void {
      this.updateCustomLink({
        id: link.id,
        name: link.name,
        url: link.url,
        pinnedToHome: !link.pinnedToHome,
      });
    },
  },
});
</script>

<style lang="sass" scoped>
.quick-links-manager
  max-width: 1200px
  margin: 0 auto 10px auto
  padding: 0 12px
  &.embedded
    max-width: 100%
    margin: 0
    padding: 0

    .link-form, .links-list
      max-width: 100%

.section-title
  margin: 12px 0 6px 0
  font-size: 1.3em
  color: var(--secondary)
  font-weight: 700

.subtitle
  margin: 0 0 16px 0
  color: var(--secondary)
  max-width: 700px

.link-form
  margin: 0 0 25px 0
  max-width: 700px
  padding: 16px
  border-radius: 12px
  border: 1px solid rgba(128, 128, 128, .25)
  background-color: rgba(128, 128, 128, .06)

.input-group
  display: flex
  flex-direction: column
  margin-bottom: 14px

  label
    color: var(--secondary)
    margin-bottom: 6px
    font-size: .9em
    font-weight: 600

  input
    border-radius: 8px
    border: 1px solid rgba(128, 128, 128, .35)
    padding: 9px 10px
    font-size: .95em
    background: var(--background)
    color: var(--primary)

.form-actions
  display: flex
  gap: 10px
  margin-top: 12px
  flex-wrap: wrap

.count
  margin-top: 12px
  color: var(--secondary)
  font-size: .9em

.error
  margin-top: 10px
  color: #ef4444
  font-size: .9em

.links-list
  max-width: 900px
  display: flex
  flex-direction: column
  gap: 10px

.link-item
  border-radius: 12px
  border: 1px solid rgba(128, 128, 128, .25)
  padding: 12px
  display: flex
  justify-content: space-between
  gap: 16px
  flex-wrap: wrap

.link-info
  min-width: 250px

.link-name
  color: var(--accent)
  font-weight: 700
  text-decoration: none

  &:hover
    text-decoration: underline

.link-url
  margin-top: 4px
  color: var(--secondary)
  font-size: .87em
  word-break: break-all

.pinned
  margin-top: 7px
  color: var(--accent)
  font-size: .85em
  font-weight: 600

.link-actions
  display: flex
  gap: 8px
  flex-wrap: wrap
  align-items: center

.action-button
  border: 1px solid rgba(128, 128, 128, .35)
  border-radius: 999px
  background: var(--background)
  color: var(--secondary)
  font-weight: 600
  padding: 7px 11px
  cursor: pointer
  font-size: .85em

  &.primary
    background: var(--accent)
    color: var(--background)
    border-color: var(--accent)

.empty-state
  color: var(--secondary)
  font-size: .95em
</style>
