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
          <p class="today-count">
            {{ isSchoolDay
              ? `${todaysClubs.length} ${todaysClubs.length === 1 ? 'club meets today' : 'clubs meet today'}`
              : 'No school today' }}
          </p>
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
                  <div>
                    <h4>{{ club.clubName }}</h4>
                    <p v-if="club.pseudonym" class="club-pseudonym">{{ club.pseudonym }}</p>
                  </div>
                  <span class="club-room">{{ club.room }}</span>
                </div>
                <p class="club-time">{{ formatClubDays(club.day) }} • {{ club.time }}</p>
                <a
                  v-if="club.more && isExternalLink(club.more)"
                  class="club-link"
                  :href="club.more"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit club page
                </a>
                <p v-else-if="club.more" class="club-more">{{ club.more }}</p>
                <p v-if="club.additionalDescription" class="club-description">{{ club.additionalDescription }}</p>
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
          {{ isSchoolDay ? `No clubs are listed for ${selectedWeekday.toLowerCase()}.` : 'Today clubs are hidden on no school days.' }}
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
                <div>
                  <h4>{{ club.clubName }}</h4>
                  <p v-if="club.pseudonym" class="club-pseudonym">{{ club.pseudonym }}</p>
                </div>
                <span class="club-room">{{ club.room }}</span>
              </div>
              <p class="club-time">{{ formatClubDays(club.day) }} • {{ club.time }}</p>
              <p class="club-emails">{{ club.emails.join(' • ') }}</p>
              <a
                v-if="club.more && isExternalLink(club.more)"
                class="club-link"
                :href="club.more"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit club page
              </a>
              <p v-else-if="club.more" class="club-more">{{ club.more }}</p>
              <p v-if="club.additionalDescription" class="club-description">{{ club.additionalDescription }}</p>
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

.club-header
  display: flex
  justify-content: space-between
  align-items: start
  gap: 12px

  h4
    margin: 0
    font-size: 22px
    line-height: 1.15

.club-pseudonym
  margin: 6px 0 0
  color: var(--secondary)
  font-size: 14px

.club-room
  padding: 6px 10px
  border-radius: 999px
  background: var(--secondaryBackground)
  color: var(--accent)
  font-size: 13px
  font-weight: 700
  white-space: nowrap

.club-time,
.club-emails,
.club-link,
.club-more,
.club-description
  margin: 10px 0 0
  line-height: 1.5

.club-time
  color: var(--accent)
  font-weight: 700

.club-link
  display: inline-block
  color: var(--accent)
  font-weight: 700
  text-decoration: underline

.club-emails,
.club-description
  color: var(--secondary)
</style>
