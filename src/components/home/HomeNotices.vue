<template>
  <div class="notices home-surface">
    <ThemeSuggestion />

    <!--
      Dated announcements. Each card shows itself only inside its own date
      range, so most of the year this block is empty. To post a new
      announcement, add or re-date a card here the same way as before.
    -->
    <div class="cards">
      <end-of-year-card />
      <countdown-card until-date="May 23, 2025" message="🌴 Summer Countdown 🐬" />
      <new-feature-card />
      <contribute-card />
      <april-fools-card />
      <shs-hacks-card />
      <holiday-card />
    </div>
  </div>
</template>

<script setup lang="ts">
import ThemeSuggestion from './ThemeSuggestion.vue';
import EndOfYearCard from '@/components/cards/EndOfYearCard.vue';
import CountdownCard from '@/components/cards/CountdownCard.vue';
import NewFeatureCard from '@/components/cards/NewFeatureCard.vue';
import ContributeCard from '@/components/cards/ContributeCard.vue';
import AprilFoolsCard from '@/components/cards/AprilFoolsCard.vue';
import ShsHacksCard from '@/components/cards/ShsHacksCard.vue';
import HolidayCard from '@/components/cards/HolidayCard.vue';
</script>

<style scoped>
.notices {
  box-sizing: border-box;
  max-width: 1900px;
  margin: 0 auto;
  padding: 0 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.notices > :first-child {
  margin-top: 16px;
}

.cards {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

/* the announcement cards are the site's older card component; match them to the widgets */
.cards :deep(.card) {
  flex: 0 1 340px;
  margin: 14px 7px 0 !important;
  border: 1px solid var(--w-line);
  border-radius: var(--w-radius);
  box-shadow: var(--w-shadow) !important;
}
</style>
