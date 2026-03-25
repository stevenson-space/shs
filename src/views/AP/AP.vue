<template>
  <div>
    <plain-header title="AP Exams" />
    <div class="content">
      <div class="intro-card">
        <h2>2026 AP Test Dates and Times</h2>
      </div>

      <div class="date-groups">
        <div v-for="group in examGroups" :key="group.date" class="date-group">
          <collapsible-section v-model="openGroups[group.date]" :title="formatDate(group.date)">
            <div class="exam-grid">
              <div v-for="exam in group.exams" :key="`${exam.name}-${exam.date}`" class="exam-card">
                <div class="exam-name">{{ exam.name }}</div>
                <div class="exam-time">{{ exam.startTime }} - {{ exam.endTime }}</div>
              </div>
            </div>
          </collapsible-section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import CollapsibleSection from '@/components/CollapsibleSection.vue';
import PlainHeader from '@/components/PlainHeader.vue';
import exams from '@/data/ap.json';

const examGroups = computed(() => {
  const grouped = new Map<string, typeof exams>();
  exams.forEach((exam) => {
    const existing = grouped.get(exam.date) || [];
    grouped.set(exam.date, [...existing, exam]);
  });

  return [...grouped.entries()].map(([date, groupedExams]) => ({
    date,
    exams: groupedExams,
  }));
});

const openGroups = reactive(Object.fromEntries(
  [...new Set(exams.map((exam) => exam.date))].map((date, index) => [date, index === 0]),
));

function formatDate(dateString: string): string {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.content
  max-width: $content-width
  margin: 0 auto
  padding: 0 16px 24px

.intro-card
  margin-top: 18px
  padding: 22px
  border-radius: 20px
  background: var(--secondaryBackground)
  +shadow-light

.kicker
  margin: 0 0 10px
  text-transform: uppercase
  letter-spacing: 0.08em
  font-size: 12px
  color: var(--accent)

h2
  margin: 0
  font-size: 32px

.intro-copy
  margin: 10px 0 0
  color: var(--secondary)
  line-height: 1.5

.date-groups
  margin-top: 18px

.date-group
  background: var(--secondaryBackground)
  border-radius: 20px
  +shadow-light
  margin-top: 10px

.date-group :deep(.collapsible-group)
  margin-bottom: 0
  border-radius: 20px
  border: none

.date-group :deep(.header-content)
  padding: 18px 20px

.date-group :deep(.group-title)
  color: var(--accent)
  font-size: 18px
  font-weight: 700
  opacity: 1

.date-group :deep(.collapsible-content)
  padding: 0 20px 20px

.exam-grid
  display: grid
  grid-template-columns: repeat(2, minmax(0, 1fr))
  gap: 5px
  margin-top: 18px
  +mobile
    grid-template-columns: 1fr

.exam-card
  padding: 18px

.exam-name
  font-size: 22px
  font-weight: 700
  line-height: 1.2

.exam-time
  margin-top: 10px
  color: var(--secondary)
  font-size: 16px
</style>
