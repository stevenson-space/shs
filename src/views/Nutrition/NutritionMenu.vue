<template>
  <div class="nutrition-menu-page">
    <plain-header title="Full Menu" />
    <div class="content">
      <div class="section">
        <p class="section-kicker">Browse</p>
        <h2>Full nutrition menu</h2>
        <p class="intro-copy">
          Search the complete menu with the same location, allergen, and max price filters.
        </p>
        <nutrition-menu-browser />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PlainHeader from '@/components/PlainHeader.vue';
import NutritionMenuBrowser from '@/components/nutrition/NutritionMenuBrowser.vue';
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.content
  max-width: $content-width
  margin: 0 auto
  padding: 0 16px 24px

.section
  margin-top: 18px
  padding: 20px
  background: var(--secondaryBackground)
  border-radius: 20px
  +shadow-light

.section-kicker
  margin: 0 0 10px
  text-transform: uppercase
  letter-spacing: 0.08em
  font-size: 12px
  color: var(--accent)

h2
  margin: 0
  font-size: 32px

.intro-copy
  margin: 10px 0 18px
  color: var(--secondary)
  line-height: 1.5
</style>
