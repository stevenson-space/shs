<template>
  <div class="clubs-page">
    <plain-header title="Clubs" />

    <div class="content">
      <section class="intro-card">
        <p class="section-kicker">Club Directory</p>
        <h2>Browse Clubs</h2>
        <p class="intro-copy">
          Search by club name, room, pseudonym, or email, then filter by meeting day.
        </p>
      </section>

      <section class="panel">
        <div class="panel-head">
          <div>
            <p class="panel-label">Today</p>
            <h3>{{ selectedWeekday }}</h3>
          </div>
        </div>

        <div v-if="isSchoolDay && todaysClubs.length" class="today-grid">
          <card-container class="today-grid">
            <card
              v-for="club in displayedTodaysClubs"
              :key="club.id"
              class="club-card"
              :wrapperStyle="{ overflow: 'visible' }"
            >
              <div class="club-card-content">
                <div class="club-header">
                  <a
                    v-if="club.more && isExternalLink(club.more)"
                    class="club-title-link"
                    :href="club.more"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <h4>{{ club.clubName }}</h4>
                  </a>
                  <h4 v-else>{{ club.clubName }}</h4>
                  <p v-if="club.pseudonym" class="club-pseudonym">AKA: {{ club.pseudonym }}</p>
                </div>
                <div class="club-details">
                  <p class="club-detail">
                    <span class="club-detail-label">Room</span>
                    <span class="club-room">{{ club.room }}</span>
                  </p>
                  <p class="club-detail">
                    <span class="club-detail-label">Day</span>
                    <span class="club-time">{{ formatClubDays(club.day) }}</span>
                  </p>
                  <p class="club-detail">
                    <span class="club-detail-label">Time</span>
                    <span>{{ club.time }}</span>
                  </p>
                </div>
                <p v-if="club.additionalDescription" class="club-description">{{ club.additionalDescription }}</p>
                <p v-else-if="club.more && !isExternalLink(club.more)" class="club-more">{{ club.more }}</p>
                <div v-if="club.emails.length || (club.more && isExternalLink(club.more))" class="club-actions">
                  <a
                    v-if="club.emails.length"
                    class="club-action-button"
                    :href="`mailto:${club.emails.join(',')}`"
                  >
                    Contact
                  </a>
                  <a
                    v-if="club.more && isExternalLink(club.more)"
                    class="club-action-button secondary"
                    :href="club.more"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Club Page
                  </a>
                </div>
              </div>
            </card>
          </card-container>
        </div>
        <button
          v-if="isSchoolDay && todaysClubs.length > todayClubLimit"
          type="button"
          class="view-more-button"
          @click="showAllTodaysClubs = !showAllTodaysClubs"
        >
          {{ showAllTodaysClubs ? 'Show Less' : `View ${todaysClubs.length - todayClubLimit} More` }}
        </button>
        <p v-else class="empty-text">
          {{ isSchoolDay ? `No clubs are listed for ${selectedWeekday.toLowerCase()}.` : 'No school today' }}
        </p>
      </section>

      <section class="panel">
        <div class="filter-row">
          <input
            v-model.trim="searchQuery"
            class="shared-input"
            type="text"
            placeholder="Search clubs, rooms, pseudonyms, or emails"
          >
        </div>

        <div class="day-filter-row">
          <button
            v-for="day in filterDays"
            :key="day"
            type="button"
            class="day-filter"
            :class="{ active: selectedDayFilter === day }"
            @click="selectedDayFilter = day"
          >
            {{ day }}
          </button>
        </div>

        <div class="results-row">
          <p class="results-text">{{ filteredClubs.length }} club{{ filteredClubs.length === 1 ? '' : 's' }} shown</p>
        </div>

        <card-container class="club-grid">
          <card
            v-for="club in filteredClubs"
            :key="club.id"
            class="club-card"
            :wrapperStyle="{ overflow: 'visible' }"
          >
            <div class="club-card-content">
              <div class="club-header">
                <a
                  v-if="club.more && isExternalLink(club.more)"
                  class="club-title-link"
                  :href="club.more"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <h4>{{ club.clubName }}</h4>
                </a>
                <h4 v-else>{{ club.clubName }}</h4>
                <p v-if="club.pseudonym" class="club-pseudonym">{{ club.pseudonym }}</p>
              </div>
              <div class="club-details">
                <p class="club-detail">
                  <span class="club-detail-label">Room</span>
                  <span class="club-room">{{ club.room }}</span>
                </p>
                <p class="club-detail">
                  <span class="club-detail-label">Day</span>
                  <span class="club-time">{{ formatClubDays(club.day) }}</span>
                </p>
                <p class="club-detail">
                  <span class="club-detail-label">Time</span>
                  <span>{{ club.time }}</span>
                </p>
              </div>

              <p v-if="club.more && !isExternalLink(club.more)" class="club-more">{{ club.more }}</p>
              <p v-if="club.additionalDescription" class="club-description">{{ club.additionalDescription }}</p>
              <div v-if="club.emails.length || (club.more && isExternalLink(club.more))" class="club-actions">
                <a
                  v-if="club.emails.length"
                  class="club-action-button"
                  :href="`mailto:${club.emails.join(',')}`"
                >
                  Contact
                </a>
                <a
                  v-if="club.more && isExternalLink(club.more)"
                  class="club-action-button secondary"
                  :href="club.more"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Club Page
                </a>
              </div>
            </div>
          </card>
        </card-container>

        <p v-if="filteredClubs.length === 0" class="empty-text">
          No clubs match that search and day filter.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Card from '@/components/Card.vue';
import CardContainer from '@/components/CardContainer.vue';
import PlainHeader from '@/components/PlainHeader.vue';
import useClockStore from '@/stores/clock';
import { clubs, formatClubDays } from '@/utils/clubs';

const clockStore = useClockStore();
const searchQuery = ref('');
const selectedDayFilter = ref('All Days');
const showAllTodaysClubs = ref(false);
const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const filterDays = ['All Days', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const todayClubLimit = 10;

const selectedWeekday = computed(() => weekdayNames[new Date(clockStore.date).getDay()]);
const allClubs = clubs;
const isSchoolDay = computed(() => Boolean(clockStore.bell?.isSchoolDay && clockStore.bell?.type !== 'Summer'));

const todaysClubs = computed(() => {
  return allClubs.filter((club) => club.day.includes(selectedWeekday.value));
});

const displayedTodaysClubs = computed(() => {
  return showAllTodaysClubs.value ? todaysClubs.value : todaysClubs.value.slice(0, todayClubLimit);
});

const filteredClubs = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return allClubs.filter((club) => {
    const matchesDay = selectedDayFilter.value === 'All Days'
      || club.day.includes(selectedDayFilter.value);

    const searchableText = [
      club.clubName,
      club.room,
      club.pseudonym || '',
      club.more || '',
      club.additionalDescription || '',
      club.emails.join(' '),
      formatClubDays(club.day),
    ].join(' ').toLowerCase();

    const matchesSearch = !query || searchableText.includes(query);
    return matchesDay && matchesSearch;
  });
});

/** Detects whether a club's `more` field should be rendered as an external link. */
function isExternalLink(value: string): boolean {
  return /^https?:\/\//i.test(value.trim());
}
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.clubs-page
  padding-bottom: 40px

.content
  max-width: $content-width
  margin: 0 auto
  padding: 0 16px 24px

.intro-card,
.panel
  margin-top: 18px
  padding: 20px
  border-radius: 20px
  background: var(--secondaryBackground)
  +shadow-light

.section-kicker,
.panel-label
  margin: 0 0 10px
  text-transform: uppercase
  letter-spacing: 0.08em
  font-size: 12px
  color: var(--accent)

h2
  margin: 0
  font-size: clamp(1.8rem, 3vw, 2.6rem)
  line-height: 1.15

.intro-copy
  margin: 12px 0 0
  color: var(--secondary)
  line-height: 1.55

.panel-head
  display: flex
  justify-content: space-between
  align-items: end
  gap: 16px
  flex-wrap: wrap

  h3
    margin: 0
    font-size: 28px

.today-count
  margin: 0
  color: var(--secondary)

.filter-row
  display: flex

.shared-input
  width: 100%
  box-sizing: border-box
  padding: 12px 14px
  border-radius: 12px
  border: 1px solid var(--accent)
  background-color: var(--background)
  color: var(--primary)
  font: inherit
  outline: none

.day-filter-row
  display: flex
  flex-wrap: wrap
  gap: 10px
  margin-top: 16px

.day-filter
  border: 1px solid var(--accent)
  background: transparent
  color: var(--accent)
  border-radius: 999px
  padding: 8px 14px
  cursor: pointer
  font: inherit

  &.active
    background-color: var(--accent)
    color: var(--background)

.results-row
  margin-top: 16px

.results-text,
.empty-text
  margin: 0
  color: var(--secondary)

.view-more-button
  margin-top: 18px
  border: 1px solid var(--accent)
  background: transparent
  color: var(--accent)
  border-radius: 999px
  padding: 10px 16px
  cursor: pointer
  font: inherit
  font-weight: 700

.today-grid,
.club-grid
  margin-top: 18px

.club-card
  background: var(--background)
  border: 1px solid rgba(128, 128, 128, 0.12)

.club-card-content
  padding: 18px
  min-width: 0
  display: flex
  flex-direction: column
  gap: 12px

.club-header
  min-width: 0

  h4
    margin: 0
    font-size: 22px
    line-height: 1.15
    overflow-wrap: anywhere
    color: var(--accent)

.club-title-link
  color: inherit
  text-decoration: underline
  text-decoration-thickness: 2px
  text-underline-offset: 3px

.club-pseudonym
  margin: 4px 0 0
  color: var(--secondary)
  font-size: 14px
  overflow-wrap: anywhere

.club-details
  display: grid
  gap: 10px

.club-detail
  margin: 0
  display: grid
  gap: 4px
  line-height: 1.45

.club-detail-label
  font-size: 11px
  letter-spacing: 0.08em
  text-transform: uppercase
  color: var(--secondary)
  font-weight: 700

.club-room
  color: var(--primary)
  overflow-wrap: anywhere
  word-break: break-word

.club-time,
.club-emails,
.club-more,
.club-description
  margin: 0
  line-height: 1.5
  overflow-wrap: anywhere

.club-time
  color: var(--accent)
  font-weight: 700

.club-emails,
.club-description
  color: var(--secondary)

.club-actions
  margin-top: auto
  display: flex
  flex-wrap: wrap
  gap: 10px
  padding-top: 4px

.club-action-button
  display: inline-flex
  align-items: center
  justify-content: center
  min-height: 40px
  padding: 0 14px
  border-radius: 12px
  background: var(--accent)
  color: var(--background)
  text-decoration: none
  font-weight: 700
  border: 1px solid var(--accent)

  &.secondary
    background: transparent
    color: var(--accent)
</style>
