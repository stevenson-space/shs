<template>
  <div class="nutrition-page">
    <plain-header title="Nutrition" />

    <div class="content">
      <section class="intro section">
        <div class="intro-heading">
          <p class="section-kicker">Food Menus</p>
          <h2>Nutrition information for food, drinks, specials, and bake sale dates.</h2>
        </div>
        <p class="intro-copy">
          Search foods, compare prices, preview rotating specials, browse milkshakes, and check future dates.
        </p>
        <div class="overview-grid">
          <div class="overview-card">
            <p class="panel-label">Selected Date</p>
            <input v-model="selectedDate" class="shared-input" type="date">
            <p class="panel-title">{{ featuredSpecial?.name || 'No rotating special' }}</p>
            <p class="panel-meta" v-if="featuredSpecial">
              {{ featuredSpecial.weekday }} • {{ featuredSpecial.location }}
            </p>
          </div>
          <div class="overview-card">
            <p class="panel-label">Next Bake Sale</p>
            <p class="panel-title">{{ nextBakeSaleLabel }}</p>
            <p class="panel-desc">PPA bake sale dates are listed below for quick planning.</p>
          </div>
        </div>
      </section>

      <nav class="section-nav" aria-label="Nutrition sections">
        <a href="#menus" @click.prevent="scrollToSection('menus')">Menus</a>
        <a href="#specials" @click.prevent="scrollToSection('specials')">Rotating Foods</a>
        <a href="#milkshakes" @click.prevent="scrollToSection('milkshakes')">Milkshakes</a>
        <a href="#bake-sales" @click.prevent="scrollToSection('bake-sales')">Bake Sales</a>
        <a href="#locations" @click.prevent="scrollToSection('locations')">Locations</a>
      </nav>

      <div id="menus" class="section">
        <collapsible-section v-model="openSections.menus" title="Food Menus">
          <nutrition-menu-browser :item-limit="10" :show-view-more-button="true" />
        </collapsible-section>
      </div>

      <div id="specials" class="section">
        <collapsible-section v-model="openSections.specials" title="Rotating Foods">
          <div class="special-grid">
            <article
              v-for="special in nutritionData.rotatingSpecials"
              :key="special.weekday"
              class="special-card"
              :class="{ featured: special.weekday === selectedWeekday }"
            >
              <img :src="special.imagePath" :alt="special.name">
              <div>
                <p class="special-day">{{ special.weekday }}</p>
                <h3>{{ special.name }}</h3>
                <p>{{ special.description }}</p>
                <span class="special-location">{{ special.location }}</span>
              </div>
            </article>
          </div>
        </collapsible-section>
      </div>

      <div id="milkshakes" class="section">
        <collapsible-section v-model="openSections.milkshakes" title="Milkshakes">
          <div class="milkshake-grid">
            <article v-for="shake in nutritionData.lowerGlassCommonsMilkshakes" :key="shake.name" class="milkshake-card">
              <img :src="shake.imagePath" :alt="shake.name">
              <div>
                <div class="milkshake-head">
                  <h3>{{ shake.name }}</h3>
                  <span>${{ shake.price.toFixed(2) }}</span>
                </div>
                <p>{{ shake.description }}</p>
                <div class="chip-row">
                  <span class="meta-chip">{{ shake.calories }} cal</span>
                  <span class="meta-chip">{{ shake.sugarsGrams }}g sugar</span>
                  <span v-for="allergen in shake.allergens" :key="allergen" class="meta-chip danger">{{ allergen }}</span>
                </div>
              </div>
            </article>
          </div>
        </collapsible-section>
      </div>

      <div id="bake-sales" class="section">
        <collapsible-section v-model="openSections.bakeSales" title="PPA Bake Sale Dates">
          <div class="date-grid">
            <div v-for="date in nutritionData.bakeSaleDates" :key="date" class="date-card">
              <p class="date-label">{{ formatDate(date) }}</p>
              <p class="date-subtitle">Glass Commons and Wood Commons</p>
            </div>
          </div>
        </collapsible-section>
      </div>

      <div id="locations" class="section">
        <collapsible-section v-model="openSections.locations" title="Locations">
          <div class="location-grid">
            <article v-for="location in nutritionData.locations" :key="location.name" class="location-card">
              <h3>{{ location.name }}</h3>
              <p class="location-type">{{ location.type }}</p>
              <p>{{ location.description }}</p>
            </article>
          </div>
        </collapsible-section>
      </div>

      <div class="section report-section">
        <collapsible-section v-model="openSections.report" title="Feedback">
          <p class="report-copy">
            If menu data, allergens, or nutrition details look wrong, let the team know so the placeholder information can be corrected.
          </p>
          <a class="report-button" href="mailto:cbreen@d125.org?subject=Nutrition%20Info%20Correction">
            Report incorrect information
          </a>
        </collapsible-section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref } from 'vue';
import CollapsibleSection from '@/components/CollapsibleSection.vue';
import NutritionMenuBrowser from '@/components/nutrition/NutritionMenuBrowser.vue';
import PlainHeader from '@/components/PlainHeader.vue';
import nutritionData from '@/data/nutrition.json';

const today = new Date();
const selectedDate = ref(today.toISOString().slice(0, 10));
const openSections = reactive({
  menus: true,
  specials: false,
  milkshakes: false,
  bakeSales: false,
  locations: false,
  report: false,
});

const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const selectedWeekday = computed(() => {
  const parsed = new Date(`${selectedDate.value}T12:00:00`);
  return weekdayNames[parsed.getDay()];
});

const featuredSpecial = computed(() => {
  return nutritionData.rotatingSpecials.find((item) => item.weekday === selectedWeekday.value);
});

const nextBakeSaleLabel = computed(() => {
  const current = new Date(`${selectedDate.value}T00:00:00`);
  const next = nutritionData.bakeSaleDates.find((date) => new Date(`${date}T00:00:00`) >= current);
  return next ? formatDate(next) : 'No upcoming date listed';
});

function formatDate(dateString: string): string {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

async function scrollToSection(sectionId: 'menus' | 'specials' | 'milkshakes' | 'bake-sales' | 'locations'): Promise<void> {
  const sectionMap = {
    menus: 'menus',
    specials: 'specials',
    milkshakes: 'milkshakes',
    'bake-sales': 'bakeSales',
    locations: 'locations',
  } as const;

  const stateKey = sectionMap[sectionId];
  openSections[stateKey] = true;

  await nextTick();
  window.setTimeout(() => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 50);
}
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.nutrition-page
  padding-bottom: 40px

.content
  max-width: $content-width
  margin: 0 auto
  padding: 0 16px 24px

.section
  margin-top: 18px
  background: var(--secondaryBackground)
  border-radius: 20px
  +shadow-light
  scroll-margin-top: 20px

.section :deep(.collapsible-group)
  margin-bottom: 0
  border-radius: 20px
  border: none

.section :deep(.collapsible-header)
  background: transparent

.section :deep(.header-content)
  padding: 16px 20px

.section :deep(.group-title)
  color: var(--accent)
  font-size: 15px
  font-weight: 700
  text-transform: uppercase
  letter-spacing: 0.06em

.section :deep(.collapsible-content)
  padding: 0 20px 20px

.section-kicker, .panel-label
  margin: 0 0 10px
  text-transform: uppercase
  letter-spacing: 0.08em
  font-size: 12px
  color: var(--accent)

.intro
  padding: 20px
  margin-top: 8px

.intro-heading h2
  max-width: 38rem
  font-size: clamp(1.8rem, 3vw, 2.6rem)
  line-height: 1.15
  margin: 0

.intro-copy
  margin: 0
  font-size: 16px
  line-height: 1.55
  color: var(--secondary)

.overview-grid
  display: grid
  grid-template-columns: repeat(2, minmax(0, 1fr))
  gap: 18px
  margin-top: 18px
  +mobile
    grid-template-columns: 1fr

.overview-card
  padding: 18px
  border-radius: 16px
  border: 1px solid rgba(128, 128, 128, 0.12)
  background: rgba(128, 128, 128, 0.04)

.panel-title
  margin: 4px 0
  font-size: 24px
  font-weight: 700

.panel-meta, .panel-desc
  margin: 0
  color: var(--secondary)
  line-height: 1.45

.shared-input
  width: 100%
  height: 46px
  box-sizing: border-box
  border-radius: 12px
  border: 1px solid rgba(128, 128, 128, 0.22)
  padding: 0 12px
  font: inherit
  color: inherit
  background: transparent

.section-nav
  display: flex
  justify-content: center
  flex-wrap: wrap
  gap: 10px
  padding: 14px 0 2px
  margin-top: 18px

.section-nav a
  color: var(--accent)
  text-decoration: none
  border: 1px solid rgba(128, 128, 128, 0.18)
  border-radius: 999px
  padding: 8px 14px
  font-weight: 600

.special-grid, .milkshake-grid, .date-grid, .location-grid
  display: grid
  gap: 16px

.special-card, .milkshake-card, .date-card, .location-card
  overflow: hidden
  border-radius: 18px
  border: 1px solid rgba(128, 128, 128, 0.15)
  background: rgba(128, 128, 128, 0.04)

.special-card img, .milkshake-card img
  width: 100%
  height: 210px
  object-fit: cover
  display: block

.milkshake-head
  display: flex
  justify-content: space-between
  gap: 12px
  align-items: start

.special-card h3, .milkshake-head h3, .location-card h3
  margin: 2px 0 0
  font-size: 24px

.special-day, .location-type
  margin: 0
  color: var(--secondary)

.special-grid
  grid-template-columns: repeat(5, minmax(0, 1fr))
  +tablet
    grid-template-columns: repeat(2, minmax(0, 1fr))
  +mobile
    grid-template-columns: 1fr

.special-card
  display: grid

.special-card img
  height: 160px

.special-card > div
  padding: 14px

.special-card.featured
  border-color: var(--accent)
  box-shadow: inset 0 0 0 1px var(--accent)

.special-location
  display: inline-block
  margin-top: 10px
  color: var(--accent)
  font-weight: 700

.milkshake-grid
  grid-template-columns: repeat(3, minmax(0, 1fr))
  +tablet
    grid-template-columns: repeat(2, minmax(0, 1fr))
  +mobile
    grid-template-columns: 1fr

.milkshake-card > div
  padding: 14px

.chip-row
  display: flex
  flex-wrap: wrap
  gap: 8px

.meta-chip
  border-radius: 999px
  padding: 7px 12px
  font-size: 12px
  border: 1px solid rgba(128, 128, 128, 0.2)
  background: rgba(128, 128, 128, 0.08)
  color: inherit

.meta-chip.danger
  background: rgba(176, 0, 32, 0.08)
  color: #ab1f3a

.date-grid
  grid-template-columns: repeat(4, minmax(0, 1fr))
  +tablet
    grid-template-columns: repeat(2, minmax(0, 1fr))
  +mobile
    grid-template-columns: 1fr

.date-card
  padding: 18px

.date-label
  margin: 0
  font-size: 20px
  font-weight: 700

.date-subtitle
  margin: 8px 0 0
  color: var(--secondary)

.location-grid
  grid-template-columns: repeat(3, minmax(0, 1fr))
  +tablet
    grid-template-columns: repeat(2, minmax(0, 1fr))
  +mobile
    grid-template-columns: 1fr

.location-card
  padding: 18px

.report-section
  text-align: center

.report-copy
  max-width: 44rem
  margin: 0 auto
  line-height: 1.5
  color: var(--secondary)

.report-button
  display: inline-block
  margin-top: 16px
  padding: 11px 18px
  border-radius: 999px
  background: var(--accent)
  color: var(--background)
  text-decoration: none
  font-weight: 700
</style>
