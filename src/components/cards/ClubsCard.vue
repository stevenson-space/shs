<template>
  <card class="clubs-card">
    <div class="title-row">
      <p class="title">Clubs</p>
      <custom-link class="view-link" :href="{ name: 'clubs' }">Browse All</custom-link>
    </div>
    <div class="green-line"></div>

    <div class="summary-block">
      <p class="summary-label">Meeting {{ selectedWeekday.toLowerCase() }}</p>
      <p class="summary-name">{{ todaysClubs.length }} {{ todaysClubs.length === 1 ? 'club' : 'clubs' }}</p>
    </div>

    <div v-if="todaysClubs.length" class="club-list">
      <div v-for="club in todaysClubs.slice(0, 3)" :key="club.id" class="club-item">
        <p class="club-name">{{ club.clubName }}</p>
        <p class="club-meta">{{ formatClubDays(club.day) }} • {{ club.time }} • {{ club.room }}</p>
      </div>
      <p v-if="todaysClubs.length > 3" class="more-note">
        +{{ todaysClubs.length - 3 }} more club{{ todaysClubs.length - 3 === 1 ? '' : 's' }}
      </p>
    </div>
    <p v-else class="empty-text">No clubs are listed for this day.</p>
  </card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Card from '@/components/Card.vue';
import CustomLink from '@/components/CustomLink.vue';
import useClockStore from '@/stores/clock';
import { clubs, formatClubDays } from '@/utils/clubs';

const clockStore = useClockStore();
const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const selectedWeekday = computed(() => weekdayNames[new Date(clockStore.date).getDay()]);

const todaysClubs = computed(() => {
  return clubs.filter((club) => club.day.includes(selectedWeekday.value));
});
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.clubs-card
  padding: 0 8px 12px

.title-row
  display: flex
  justify-content: space-between
  align-items: center
  gap: 12px
  margin: 15px 0

.title
  margin: 0
  font-size: 20px

.view-link
  color: var(--accent)
  font-size: 13px
  font-weight: 700

.green-line
  width: 100%
  height: 1px
  background-color: var(--accent)
  margin-bottom: 14px

.summary-block
  text-align: center
  padding: 4px 0 10px

.summary-label
  margin: 0
  font-size: 12px
  text-transform: uppercase
  letter-spacing: 0.08em
  color: var(--secondary)

.summary-name
  margin: 8px 0 0
  font-size: 22px
  font-weight: 700

.club-list
  padding: 0 6px 2px

.club-item
  padding: 10px 0
  border-top: 1px solid rgba(128, 128, 128, 0.14)

.club-name
  margin: 0
  font-size: 16px
  font-weight: 700
  text-align: center

.club-meta
  margin: 4px 0 0
  text-align: center
  color: var(--secondary)
  font-size: 13px

.more-note,
.empty-text
  margin: 10px 0 0
  text-align: center
  color: var(--secondary)
</style>
