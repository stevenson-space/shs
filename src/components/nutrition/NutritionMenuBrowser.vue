<template>
  <div class="menu-browser">
    <div class="browser-top">
      <label class="toggle">
        <input v-model="showNutritionDetails" type="checkbox">
        <span>Show nutritional information</span>
      </label>
    </div>

    <div class="filter-bar">
      <label class="field search-field">
        <span>Search by name or description</span>
        <input v-model="searchTerm" class="shared-input" type="search" placeholder="Search foods, drinks, breakfast, cultural items">
      </label>
      <label class="field">
        <span>Location</span>
        <select v-model="selectedLocation" class="shared-input">
          <option value="">All locations</option>
          <option v-for="location in locations" :key="location.name" :value="location.name">
            {{ location.name }}
          </option>
        </select>
      </label>
      <label class="field">
        <span>Sort by price</span>
        <select v-model="priceSort" class="shared-input">
          <option value="none">Featured</option>
          <option value="asc">Lowest first</option>
          <option value="desc">Highest first</option>
        </select>
      </label>
    </div>

    <div class="price-control">
      <collapsible-section v-model="priceSliderOpen" title="Max Price">
        <div class="price-slider-wrap">
          <input
            v-model.number="sliderValue"
            class="price-slider"
            type="range"
            min="0"
            :max="sliderMax"
            step="1"
          >
          <div class="price-scale">
            <span>$0</span>
            <span>{{ sliderValue === sliderMax ? 'Any price' : `$${sliderValue.toFixed(0)}` }}</span>
          </div>
        </div>
      </collapsible-section>
    </div>

    <div class="allergen-row">
      <button
        v-for="allergen in allergenOptions"
        :key="allergen"
        type="button"
        class="allergen-chip"
        :class="{ active: selectedAllergens.includes(allergen) }"
        :aria-pressed="selectedAllergens.includes(allergen)"
        @click="toggleAllergen(allergen)"
      >
        {{ allergen }}
      </button>
    </div>
    <p class="allergen-note">
      Selected allergen pills exclude foods with that allergen, so results show foods without the selected allergen.
    </p>

    <div class="menu-summary">
      <span>{{ displayedFoods.length }} items shown</span>
      <span>{{ filteredFoods.length }} matching total</span>
      <span>{{ drinkCount }} drinks</span>
      <span>{{ breakfastCount }} breakfast items</span>
      <span>{{ culturalCount }} cultural items</span>
    </div>

    <div class="food-grid">
      <article v-for="food in displayedFoods" :key="food.id" class="food-card">
        <img class="food-image" :src="food.imagePath" :alt="food.name">
        <div class="food-body">
          <div class="food-head">
            <div>
              <p class="food-category">{{ food.category }}</p>
              <h3>{{ food.name }}</h3>
            </div>
            <span class="food-price">${{ food.price.toFixed(2) }}</span>
          </div>
          <p class="food-location">{{ food.location }}</p>
          <p class="food-description">{{ food.description }}</p>

          <div class="chip-row">
            <span v-if="food.drinks" class="meta-chip">Drink</span>
            <span v-for="tag in food.religiousTags" :key="tag" class="meta-chip">{{ tag }}</span>
          </div>

          <div v-if="food.sides.length" class="side-row">
            <span class="sub-label">Sides</span>
            <div class="chip-row">
              <span v-for="side in food.sides" :key="side" class="side-chip">{{ side }}</span>
            </div>
          </div>

          <div class="chip-row allergen-list">
            <span class="sub-label">Allergens</span>
            <span v-if="food.allergens.length === 0" class="meta-chip muted">None listed</span>
            <span v-for="allergen in food.allergens" :key="allergen" class="meta-chip danger">{{ allergen }}</span>
          </div>

          <div v-if="showNutritionDetails" class="nutrition-details">
            <p><strong>Calories:</strong> {{ food.calories }}</p>
            <p><strong>Protein:</strong> {{ food.proteinGrams }}g</p>
            <p><strong>Sugars:</strong> {{ food.sugarsGrams }}g</p>
            <p><strong>Nutrition:</strong> {{ food.nutritionSummary }}</p>
            <p><strong>Ingredients:</strong> {{ food.ingredients.join(', ') }}</p>
          </div>

          <div class="food-footer">
            <span>{{ food.culturalFocus }}</span>
            <span>{{ food.accuracyNotes }}</span>
          </div>
        </div>
      </article>
    </div>

    <div v-if="showViewMoreButton && filteredFoods.length > displayedFoods.length" class="view-more-row">
      <custom-link class="view-more-button" :href="{ name: 'nutritionMenu' }">
        View Full Menu
      </custom-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import CollapsibleSection from '@/components/CollapsibleSection.vue';
import CustomLink from '@/components/CustomLink.vue';
import nutritionData from '@/data/nutrition.json';

const { itemLimit = null, showViewMoreButton = false } = defineProps<{
  itemLimit?: number | null
  showViewMoreButton?: boolean
}>();

const searchTerm = ref('');
const selectedLocation = ref('');
const selectedAllergens = ref<string[]>([]);
const priceSort = ref<'none' | 'asc' | 'desc'>('none');
const showNutritionDetails = ref(true);
const priceSliderOpen = ref(false);

const sliderMax = Math.ceil(Math.max(...nutritionData.foods.map((food) => food.price))) + 1;
const sliderValue = ref<number>(sliderMax);
const maxPrice = ref<number | null>(null);

const locations = nutritionData.locations;

const allergenOptions = computed(() => {
  return [...new Set(nutritionData.foods.flatMap((food) => food.allergens))].sort();
});

const filteredFoods = computed(() => {
  const query = searchTerm.value.trim().toLowerCase();
  const allergenFilter = selectedAllergens.value;
  let foods = nutritionData.foods.filter((food) => {
    const matchesQuery = !query
      || food.name.toLowerCase().includes(query)
      || food.description.toLowerCase().includes(query)
      || food.category.toLowerCase().includes(query);
    const matchesLocation = !selectedLocation.value || food.location === selectedLocation.value;
    const matchesPrice = maxPrice.value === null || food.price <= maxPrice.value;
    const excludesSelectedAllergens = allergenFilter.length === 0
      || allergenFilter.every((allergen) => !food.allergens.includes(allergen));
    return matchesQuery && matchesLocation && matchesPrice && excludesSelectedAllergens;
  });

  if (priceSort.value === 'asc') {
    foods = [...foods].sort((a, b) => a.price - b.price);
  } else if (priceSort.value === 'desc') {
    foods = [...foods].sort((a, b) => b.price - a.price);
  }

  return foods;
});

const displayedFoods = computed(() => {
  return itemLimit ? filteredFoods.value.slice(0, itemLimit) : filteredFoods.value;
});

const drinkCount = computed(() => filteredFoods.value.filter((food) => food.drinks).length);
const breakfastCount = computed(() => filteredFoods.value.filter((food) => food.category === 'Breakfast').length);
const culturalCount = computed(() => filteredFoods.value.filter((food) => food.category === 'Cultural').length);

watch(sliderValue, (value) => {
  maxPrice.value = value >= sliderMax ? null : value;
});

/** Toggles an allergen exclusion filter on or off. */
function toggleAllergen(allergen: string): void {
  if (selectedAllergens.value.includes(allergen)) {
    selectedAllergens.value = selectedAllergens.value.filter((item) => item !== allergen);
    return;
  }
  selectedAllergens.value = [...selectedAllergens.value, allergen];
}
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.browser-top
  display: flex
  justify-content: flex-end
  margin-bottom: 16px
  +mobile
    justify-content: flex-start

.toggle
  display: flex
  align-items: center
  gap: 10px
  font-weight: 600

.filter-bar
  display: grid
  grid-template-columns: 2fr 1fr 1fr
  gap: 12px
  +tablet
    grid-template-columns: repeat(2, 1fr)
  +mobile
    grid-template-columns: 1fr

.field
  display: flex
  flex-direction: column
  gap: 6px

.field span
  font-size: 13px
  color: var(--secondary)

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

.price-control
  margin-top: 12px

.price-control :deep(.collapsible-group)
  border-radius: 16px
  background: rgba(128, 128, 128, 0.04)

.price-control :deep(.header-content)
  padding: 12px 14px

.price-control :deep(.collapsible-content)
  padding: 0 14px 14px

.price-slider-wrap
  padding-top: 6px

.price-slider
  width: 100%

.price-scale
  display: flex
  justify-content: space-between
  margin-top: 4px
  font-size: 13px
  color: var(--secondary)

.allergen-row, .chip-row
  display: flex
  flex-wrap: wrap
  gap: 8px

.allergen-row
  margin-top: 14px

.allergen-chip, .meta-chip, .side-chip
  border-radius: 999px
  padding: 7px 12px
  font-size: 12px
  border: 1px solid rgba(128, 128, 128, 0.2)
  background: rgba(128, 128, 128, 0.08)
  color: inherit

.allergen-chip
  cursor: pointer

.allergen-chip.active
  background: rgba(176, 0, 32, 0.1)
  color: #ab1f3a
  border-color: rgba(176, 0, 32, 0.35)
  text-decoration: line-through

.allergen-note
  margin: 10px 0 0
  font-size: 13px
  color: var(--secondary)
  line-height: 1.4

.meta-chip.danger
  background: rgba(176, 0, 32, 0.08)
  color: #ab1f3a

.meta-chip.muted
  color: var(--secondary)

.side-chip
  background: rgba(10, 72, 107, 0.08)

.menu-summary
  display: flex
  flex-wrap: wrap
  gap: 12px
  margin: 14px 0 0
  color: var(--secondary)
  font-size: 14px

.food-grid
  display: grid
  grid-template-columns: repeat(2, minmax(0, 1fr))
  gap: 16px
  margin-top: 18px
  +mobile
    grid-template-columns: 1fr

.food-card
  overflow: hidden
  border-radius: 18px
  border: 1px solid rgba(128, 128, 128, 0.15)
  background: rgba(128, 128, 128, 0.04)

.food-image
  width: 100%
  height: 210px
  object-fit: cover
  display: block

.food-body
  padding: 16px

.food-head
  display: flex
  justify-content: space-between
  gap: 12px
  align-items: start

.food-head h3
  margin: 2px 0 0
  font-size: 24px

.food-price
  font-size: 20px
  font-weight: 700
  color: var(--accent)

.food-category, .food-location
  margin: 0
  color: var(--secondary)

.food-description
  margin: 10px 0 12px
  line-height: 1.45

.sub-label
  font-size: 12px
  color: var(--secondary)
  margin-right: 4px

.side-row
  margin-top: 12px

.allergen-list
  margin-top: 12px
  align-items: center

.nutrition-details
  margin-top: 14px
  padding: 12px
  border-radius: 14px
  background: rgba(10, 72, 107, 0.06)

.nutrition-details p
  margin: 0
  line-height: 1.5

.nutrition-details p + p
  margin-top: 6px

.food-footer
  display: grid
  gap: 6px
  margin-top: 14px
  font-size: 12px
  color: var(--secondary)

.view-more-row
  display: flex
  justify-content: center
  margin-top: 20px

.view-more-button
  padding: 10px 16px
  border-radius: 999px
  border: 1px solid var(--accent)
  color: var(--accent)
  font-weight: 700
</style>
