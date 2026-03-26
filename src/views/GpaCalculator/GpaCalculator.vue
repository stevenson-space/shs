<template>
  <div>
    <plain-header title="GPA Calculator" />
    <div>
      <card class="top-card">
        <div style="text-align:center">
          <div class="gpa-title-row">
            <div class="gpa-col">
              <p class="weight-title"><b>Un</b>weighted</p>
              <h1 class="overall-gpa">
                {{ averageUnweightedGpa.toFixed(2) }}
              </h1>
            </div>
            <div class="gpa-col">
              <p class="weight-title">Weighted</p>
              <h1 class="overall-gpa">
                {{ averageWeightedGpa.toFixed(2) }}
              </h1>
            </div>
          </div>
          <rounded-button
            class="add-course-button"
            :icon="icons.faPlus"
            text="Add Course"
            invert
            @click="openAddCoursePopup()"
          />
          <rounded-button
            class="upload-transcript-button"
            :icon="icons.faFileArrowUp"
            :text="importingTranscript ? 'Importing...' : 'Upload Transcript'"
            @click="openTranscriptPicker()"
          />
          <input
            ref="transcriptInput"
            type="file"
            accept="application/pdf"
            class="hidden-input"
            @change="handleTranscriptSelected"
          >
          <div class="note-text">
            Add a class from the shared course catalog, then place it under the year you want.
            <br>Each semester still counts as a separate course.
          </div>
          <p v-if="importStatus" class="import-status">{{ importStatus }}</p>
        </div>
      </card>
    </div>

    <popup :show="showAddCoursePopup" @close="closeAddCoursePopup">
      <div class="add-course-dialog">
        <h2 class="dialog-title">Add Course</h2>
        <p class="dialog-subtitle">Choose the school year, then search the course catalog.</p>

        <div class="year-chip-row">
          <button
            v-for="year in catalogYears"
            :key="year.key"
            type="button"
            class="year-chip"
            :class="{ active: selectedAddYearKey === year.key }"
            @click="selectedAddYearKey = year.key"
          >
            {{ year.label }}
          </button>
        </div>

        <input
          v-model.trim="courseSearch"
          class="course-search"
          type="text"
          placeholder="Search courses by name or subject"
        >

        <div class="course-results">
          <button
            v-for="course in filteredCatalogCourses"
            :key="course.id"
            type="button"
            class="course-option"
            :class="{ selected: selectedAddCourseId === course.id }"
            @click="selectedAddCourseId = course.id"
          >
            <span class="course-option-name">{{ course.name }}</span>
            <span class="course-option-meta">{{ course.subject }} • {{ formatEligibleYears(course.eligibleYears) }}</span>
            <span class="course-option-description">{{ course.description }}</span>
          </button>
          <p v-if="filteredCatalogCourses.length === 0" class="empty-text">
            No courses match that search for this year.
          </p>
        </div>

        <div class="dialog-actions">
          <rounded-button text="Cancel" @click="closeAddCoursePopup()" />
          <rounded-button
            text="Add"
            invert
            :icon="icons.faPlus"
            @click="addSelectedCourse()"
          />
        </div>
      </div>
    </popup>

    <div class="year-sections">
      <collapsible-section
        v-for="year in catalogYears"
        :key="year.key"
        v-model="expandedYears[year.key]"
        :title="`${year.label} Year`"
      >
        <p v-if="coursesForYear(year.key).length === 0" class="empty-text">
          No courses added yet for {{ year.label.toLowerCase() }} year.
        </p>
        <card-container
          v-else
          :key="`${year.key}-${expandedYears[year.key] ? 'open' : 'closed'}-${coursesForYear(year.key).length}`"
          class="gpa-card-container"
        >
          <card
            v-for="(course, courseIndex) in coursesForYear(year.key)"
            :key="course.id"
            class="gpa-card"
            :wrapperStyle="{ overflow: 'visible' }"
            :style="{ 'animation-delay': reduceFadeUpAnimation ? 0 : (courseIndex * .045 + .1) + 's' }"
          >
            <div class="gpa-tile">
              <div class="name-group">
                <p class="name">{{ course.name }}</p>
                <p class="course-meta">
                  {{ course.subject }}
                  <template v-if="course.termLabel"> • {{ course.termLabel }}</template>
                </p>
              </div>
              <font-awesome-icon
                v-show="courses.length > 0"
                class="close"
                size="1x"
                :icon="icons.faXmark"
                @click="removeCourse(course)"
              />
            </div>
            <div class="course-settings-row">
              <dropdown
                style="flex:1;"
                :options="courseLevels"
                :modelValue="course.level"
                align="left"
                @update:modelValue="selectedCourseLevel(course, $event)"
              />
              <dropdown
                style="flex:1;"
                class="grade-selector"
                :options="gradeLabels"
                :modelValue="course.grade"
                align="left"
                @update:modelValue="selectGrade(course, $event)"
              />
            </div>
            <p class="grade-label">{{ course.finalGrade }}</p>
            <div class="gpa-title-row">
              <div class="gpa-col">
                <p class="weight-title"><b>Un</b>weighted</p>
                <div class="final-gpa">{{ course.unweightedGPA.toFixed(2) }}</div>
              </div>
              <div class="gpa-col">
                <p class="weight-title">Weighted</p>
                <div class="final-gpa">{{ course.weightedGPA.toFixed(2) }}</div>
              </div>
            </div>
            <checkbox
              :modelValue="course.weight == 1.5"
              @update:modelValue="toggleExtraWeight(course, $event)"
            >
              1.5 Weight Science Class
            </checkbox>
            <p v-if="!course.scienceWeightEligible" class="science-note">
              Extra science weighting is only available for eligible science courses.
            </p>
          </card>
        </card-container>
      </collapsible-section>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { faPlus, faXmark, faFileArrowUp } from '@fortawesome/free-solid-svg-icons';
import RoundedButton from '@/components/RoundedButton.vue';
import Card from '@/components/Card.vue';
import PlainHeader from '@/components/PlainHeader.vue';
import CardContainer from '@/components/CardContainer.vue';
import Dropdown from '@/components/Dropdown.vue';
import Checkbox from '@/components/Checkbox.vue';
import CollapsibleSection from '@/components/CollapsibleSection.vue';
import Popup from '@/components/Popup.vue';
import courseCatalog from '@/data/courses.json';
import type { ParsedTranscriptCourse } from '@/utils/transcriptParser';

function ensurePdfCompatibility(): void {
  if (!('withResolvers' in Promise)) {
    Object.defineProperty(Promise, 'withResolvers', {
      configurable: true,
      writable: true,
      value() {
        let resolve!: (value: unknown) => void;
        let reject!: (reason?: unknown) => void;
        const promise = new Promise((res, rej) => {
          resolve = res;
          reject = rej;
        });
        return { promise, resolve, reject };
      },
    });
  }

  const readableStreamPrototype = globalThis.ReadableStream?.prototype as
    | (ReadableStream<unknown> & {
      values?: () => AsyncIterableIterator<unknown>;
      [Symbol.asyncIterator]?: () => AsyncIterableIterator<unknown>;
    })
    | undefined;

  if (readableStreamPrototype && typeof readableStreamPrototype.values !== 'function') {
    Object.defineProperty(readableStreamPrototype, 'values', {
      configurable: true,
      writable: true,
      value: function values(this: ReadableStream<unknown>): AsyncIterableIterator<unknown> {
        const reader = this.getReader();
        return {
          async next() {
            const result = await reader.read();
            if (result.done) {
              reader.releaseLock();
              return { value: undefined, done: true };
            }
            return { value: result.value, done: false };
          },
          async return() {
            await reader.cancel();
            reader.releaseLock();
            return { value: undefined, done: true };
          },
          [Symbol.asyncIterator]() {
            return this;
          },
        };
      },
    });
  }

  if (readableStreamPrototype && typeof readableStreamPrototype[Symbol.asyncIterator] !== 'function') {
    Object.defineProperty(readableStreamPrototype, Symbol.asyncIterator, {
      configurable: true,
      writable: true,
      value: function asyncIterator(this: ReadableStream<unknown>): AsyncIterableIterator<unknown> {
        return this.values();
      },
    });
  }
}

type CourseLevel = 'Regular' | 'Accelerated' | 'Honors/AP';
type CatalogYear = {
  key: string;
  label: string;
};
type CatalogCourse = {
  id: string;
  name: string;
  subject: string;
  defaultLevel: CourseLevel;
  scienceWeightEligible: boolean;
  description: string;
  eligibleYears: string[];
  transcriptAliases?: string[];
};
type StoredCourse = {
  id: number;
  grade: number;
  level: number;
  weight: number;
  unweightedGPA: number;
  weightedGPA: number;
  finalGrade: string;
  hasFinal: boolean;
  name: string;
  yearKey?: string;
  catalogId?: string;
  subject?: string;
  description?: string;
  scienceWeightEligible?: boolean;
  term?: string;
  termLabel?: string;
};

class Course {
  id: number;
  grade: number;
  level: number;
  weight: number;
  unweightedGPA: number;
  weightedGPA: number;
  finalGrade: string;
  hasFinal: boolean;
  name: string;
  yearKey: string;
  catalogId: string;
  subject: string;
  description: string;
  scienceWeightEligible: boolean;
  term: string;
  termLabel: string;

  constructor(id: number, yearKey: string, catalogCourse: CatalogCourse, levelIndex: number) {
    this.id = id;
    this.grade = 0;
    this.level = levelIndex;
    this.weight = 1.0;
    this.unweightedGPA = 4.0;
    this.weightedGPA = 4.0;
    this.finalGrade = 'A';
    this.hasFinal = true;
    this.name = catalogCourse.name;
    this.yearKey = yearKey;
    this.catalogId = catalogCourse.id;
    this.subject = catalogCourse.subject;
    this.description = catalogCourse.description;
    this.scienceWeightEligible = catalogCourse.scienceWeightEligible;
    this.term = '';
    this.termLabel = '';
  }
}

export default defineComponent({
  components: {
    RoundedButton,
    Card,
    PlainHeader,
    CardContainer,
    Dropdown,
    Checkbox,
    CollapsibleSection,
    Popup,
  },
  data() {
    const catalogYears = courseCatalog.years as CatalogYear[];
    const catalogCourses = courseCatalog.courses as CatalogCourse[];
    return {
      icons: { faPlus, faXmark, faFileArrowUp },
      courses: [] as Course[],
      averageUnweightedGpa: 0 as number,
      averageWeightedGpa: 0 as number,
      courseLevels: ['Regular', 'Accelerated', 'Honors/AP'] as CourseLevel[],
      gradeLabels: ['A', 'B', 'C', 'D', 'F'] as string[],
      catalogYears,
      catalogCourses,
      expandedYears: {
        freshman: true,
        sophomore: false,
        junior: false,
        senior: false,
      } as Record<string, boolean>,
      showAddCoursePopup: false as boolean,
      selectedAddYearKey: catalogYears[0].key as string,
      selectedAddCourseId: '' as string,
      courseSearch: '' as string,
      importingTranscript: false as boolean,
      importStatus: '' as string,
      reduceFadeUpAnimation: false as boolean,
    };
  },
  computed: {
    filteredCatalogCourses(): CatalogCourse[] {
      const query = this.courseSearch.trim().toLowerCase();
      return this.catalogCourses.filter((course) => {
        const matchesYear = course.eligibleYears.includes(this.selectedAddYearKey);
        const matchesQuery = !query
          || course.name.toLowerCase().includes(query)
          || course.subject.toLowerCase().includes(query);
        return matchesYear && matchesQuery;
      });
    },
  },
  watch: {
    courses: {
      handler() {
        localStorage.setItem('EBRCourses', JSON.stringify(this.courses));
      },
      deep: true,
    },
    selectedAddYearKey() {
      this.selectedAddCourseId = this.filteredCatalogCourses[0]?.id || '';
    },
    courseSearch() {
      this.selectedAddCourseId = this.filteredCatalogCourses[0]?.id || '';
    },
  },
  mounted() {
    const courses: string | null = localStorage.getItem('EBRCourses');
    if (courses) {
      this.courses = (JSON.parse(courses) as StoredCourse[]).map((course, index) => (
        this.normalizeStoredCourse(course, index)
      ));
      this.calculateSemesterGrades();
    }
  },
  methods: {
    levelIndexFromLabel(level: CourseLevel): number {
      return this.courseLevels.indexOf(level);
    },
    getYearByKey(yearKey: string): CatalogYear {
      return this.catalogYears.find((year) => year.key === yearKey) || this.catalogYears[0];
    },
    getCatalogCourseById(catalogId?: string): CatalogCourse | undefined {
      return this.catalogCourses.find((course) => course.id === catalogId);
    },
    normalizeCourseName(value: string): string {
      return value
        .toUpperCase()
        .replace(/&/g, 'AND')
        .replace(/[^A-Z0-9]/g, '');
    },
    findCatalogCourseByTranscriptName(name: string): CatalogCourse | undefined {
      const normalizedName = this.normalizeCourseName(name);
      return this.catalogCourses.find((course) => {
        const candidateNames = [course.name, ...(course.transcriptAliases || [])];
        return candidateNames.some((candidate) => this.normalizeCourseName(candidate) === normalizedName);
      });
    },
    getFallbackCourseForYear(yearKey: string): CatalogCourse {
      return this.catalogCourses.find((course) => course.eligibleYears.includes(yearKey)) || this.catalogCourses[0];
    },
    normalizeStoredCourse(course: StoredCourse, index: number): Course {
      const year = this.getYearByKey(course.yearKey || this.catalogYears[0].key);
      const matchedCatalogCourse = this.getCatalogCourseById(course.catalogId)
        || this.catalogCourses.find((item) => item.name === course.name);
      const catalogCourse = matchedCatalogCourse || {
        id: course.catalogId || `stored:${this.normalizeCourseName(course.name || `course-${index + 1}`)}`,
        name: course.name || `Course ${index + 1}`,
        subject: course.subject || this.inferSubjectFromTranscriptName(course.name || ''),
        defaultLevel: this.courseLevels[
          typeof course.level === 'number' && course.level >= 0 && course.level < this.courseLevels.length
            ? course.level
            : 0
        ] as CourseLevel,
        scienceWeightEligible: course.scienceWeightEligible ?? false,
        description: course.description || 'Imported from transcript',
        eligibleYears: [year.key],
      };
      const normalizedCourse = new Course(
        course.id || index + 1,
        year.key,
        catalogCourse,
        typeof course.level === 'number' ? course.level : this.levelIndexFromLabel(catalogCourse.defaultLevel),
      );
      normalizedCourse.grade = typeof course.grade === 'number' ? course.grade : 0;
      normalizedCourse.weight = course.weight === 1.5 && catalogCourse.scienceWeightEligible ? 1.5 : 1.0;
      normalizedCourse.unweightedGPA = typeof course.unweightedGPA === 'number' ? course.unweightedGPA : 4.0;
      normalizedCourse.weightedGPA = typeof course.weightedGPA === 'number' ? course.weightedGPA : 4.0;
      normalizedCourse.finalGrade = course.finalGrade || 'A';
      normalizedCourse.hasFinal = course.hasFinal ?? true;
      normalizedCourse.name = course.name || catalogCourse.name;
      normalizedCourse.subject = course.subject || catalogCourse.subject;
      normalizedCourse.description = course.description || catalogCourse.description;
      normalizedCourse.scienceWeightEligible = course.scienceWeightEligible ?? catalogCourse.scienceWeightEligible;
      normalizedCourse.catalogId = catalogCourse.id;
      normalizedCourse.yearKey = year.key;
      normalizedCourse.term = course.term || '';
      normalizedCourse.termLabel = course.termLabel || '';
      return normalizedCourse;
    },
    formatTermLabel(term: string): string {
      if (term === '1') return 'Semester 1';
      if (term === '2') return 'Semester 2';
      return term ? `Term ${term}` : '';
    },
    inferSubjectFromTranscriptName(name: string): string {
      const normalized = name.toUpperCase();
      if (/(CALCULUS|ALGEBRA|GEOMETRY|STATISTICS|PRECALCULUS)/.test(normalized)) return 'Math';
      if (/(BIOLOGY|CHEMISTRY|PHYSICS|SCIENCE)/.test(normalized)) return 'Science';
      if (/(ENGLISH|LANGUAGE|COMP\b|LITERATURE)/.test(normalized)) return 'English';
      if (/(HISTORY|ECONOMICS|GOVERNMENT|GEOG)/.test(normalized)) return 'Social Studies';
      if (/(FRENCH|SPANISH|GERMAN|LANGUAGE)/.test(normalized)) return 'World Language';
      if (/(COMPUTER|PROGRAMMING|WEB|ENGINEERING|COMP SCI)/.test(normalized)) return 'STEM';
      if (/(PE|HEALTH)/.test(normalized)) return 'PE/Health';
      if (/(MUSIC|ART|THEATER|DRAMA)/.test(normalized)) return 'Fine Arts';
      return 'Elective';
    },
    inferLevelFromTranscript(course: ParsedTranscriptCourse, matchedCourse?: CatalogCourse): number {
      if (course.courseMarker === 'H' || course.transcriptName.startsWith('AP ')) {
        return 2;
      }
      if (course.courseMarker === 'X' || /\bAC\b/.test(course.transcriptName)) {
        return 1;
      }
      if (matchedCourse) {
        return this.levelIndexFromLabel(matchedCourse.defaultLevel);
      }
      return 0;
    },
    createCourseFromTranscript(parsedCourse: ParsedTranscriptCourse): Course {
      const matchedCourse = this.findCatalogCourseByTranscriptName(parsedCourse.transcriptName);
      const fallbackCatalogCourse: CatalogCourse = matchedCourse || {
        id: `transcript:${this.normalizeCourseName(parsedCourse.transcriptName)}`,
        name: parsedCourse.transcriptName,
        subject: this.inferSubjectFromTranscriptName(parsedCourse.transcriptName),
        defaultLevel: 'Regular',
        scienceWeightEligible: /SCIENCE|BIOLOGY|CHEMISTRY|PHYSICS/.test(
          this.inferSubjectFromTranscriptName(parsedCourse.transcriptName).toUpperCase(),
        ) || parsedCourse.credit >= 1.5,
        description: 'Imported from transcript',
        eligibleYears: [parsedCourse.yearKey],
      };

      const course = new Course(
        this.nextCourseId(),
        parsedCourse.yearKey,
        fallbackCatalogCourse,
        this.inferLevelFromTranscript(parsedCourse, matchedCourse),
      );
      course.name = parsedCourse.transcriptName;
      course.subject = matchedCourse?.subject || fallbackCatalogCourse.subject;
      course.description = matchedCourse?.description || fallbackCatalogCourse.description;
      course.scienceWeightEligible = matchedCourse?.scienceWeightEligible || fallbackCatalogCourse.scienceWeightEligible;
      course.level = this.inferLevelFromTranscript(parsedCourse, matchedCourse);
      course.grade = this.gradeLabels.indexOf(parsedCourse.mark);
      course.weight = parsedCourse.credit >= 1.5 ? 1.5 : 1;
      course.catalogId = matchedCourse?.id || fallbackCatalogCourse.id;
      course.finalGrade = parsedCourse.mark;
      course.term = parsedCourse.term;
      course.termLabel = this.formatTermLabel(parsedCourse.term);
      return course;
    },
    transcriptCourseKey(course: Pick<Course, 'yearKey' | 'name' | 'grade' | 'level' | 'term'>): string {
      return [
        course.yearKey,
        this.normalizeCourseName(course.name),
        course.term || '',
        course.grade,
        course.level,
      ].join('|');
    },
    nextCourseId(): number {
      return this.courses.reduce((highest, course) => Math.max(highest, course.id), 0) + 1;
    },
    createCourseFromCatalog(yearKey: string, catalogCourse: CatalogCourse): Course {
      return new Course(
        this.nextCourseId(),
        yearKey,
        catalogCourse,
        this.levelIndexFromLabel(catalogCourse.defaultLevel),
      );
    },
    openAddCoursePopup(): void {
      this.showAddCoursePopup = true;
      this.selectedAddYearKey = this.catalogYears[0].key;
      this.courseSearch = '';
      this.selectedAddCourseId = this.filteredCatalogCourses[0]?.id || '';
    },
    closeAddCoursePopup(): void {
      this.showAddCoursePopup = false;
    },
    openTranscriptPicker(): void {
      if (this.importingTranscript) return;
      (this.$refs.transcriptInput as HTMLInputElement | undefined)?.click();
    },
    async handleTranscriptSelected(event: Event): Promise<void> {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];
      if (!file) return;

      this.importingTranscript = true;
      this.importStatus = '';

      try {
        ensurePdfCompatibility();
        const { parseTranscriptPdf } = await import('@/utils/transcriptParser');
        const parsedTranscript = await parseTranscriptPdf(file);
        const existingKeys = new Set(this.courses.map((course) => this.transcriptCourseKey(course)));
        const importedCourses = parsedTranscript.courses
          .map((course) => this.createCourseFromTranscript(course))
          .filter((course) => {
            const key = this.transcriptCourseKey(course);
            if (existingKeys.has(key)) {
              return false;
            }
            existingKeys.add(key);
            return true;
          });

        if (importedCourses.length > 0) {
          this.reduceFadeUpAnimation = true;
          this.courses.push(...importedCourses);
          importedCourses.forEach((course) => {
            this.expandedYears[course.yearKey] = true;
          });
          this.calculateSemesterGrades();
        }

        this.importStatus = [
          `Imported ${importedCourses.length} course${importedCourses.length === 1 ? '' : 's'}.`,
          parsedTranscript.skippedCount > 0 ? `Skipped ${parsedTranscript.skippedCount} non-letter-grade item${parsedTranscript.skippedCount === 1 ? '' : 's'}.` : '',
        ].filter(Boolean).join(' ');
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        this.importStatus = `Unable to read that transcript. ${message}`;
      } finally {
        this.importingTranscript = false;
        input.value = '';
      }
    },
    addSelectedCourse(): void {
      const selectedCourse = this.getCatalogCourseById(this.selectedAddCourseId)
        || this.filteredCatalogCourses[0];
      if (!selectedCourse) return;
      this.reduceFadeUpAnimation = true;
      this.courses.push(this.createCourseFromCatalog(this.selectedAddYearKey, selectedCourse));
      this.expandedYears[this.selectedAddYearKey] = true;
      this.calculateSemesterGrades();
      this.closeAddCoursePopup();
    },
    formatEligibleYears(yearKeys: string[]): string {
      return yearKeys
        .map((yearKey) => this.getYearByKey(yearKey).label)
        .join(', ');
    },
    coursesForYear(yearKey: string): Course[] {
      return this.courses.filter((course) => course.yearKey === yearKey);
    },
    removeCourse(course: Course): void {
      const index = this.courses.indexOf(course);
      if (index > -1) {
        this.courses.splice(index, 1);
        this.calculateSemesterGrades();
      }
    },
    selectGrade(course: Course, gradeIndex: number): void {
      const index = this.courses.indexOf(course);
      course.grade = gradeIndex;
      this.courses[index] = course;
      this.calculateSemesterGrades();
    },
    selectedCourseLevel(course: Course, i: number): void {
      const index = this.courses.indexOf(course);
      course.level = i;
      this.courses[index] = course;
      this.calculateSemesterGrades();
    },
    toggleExtraWeight(course: Course, isChecked: boolean): void {
      if (!course.scienceWeightEligible) {
        course.weight = 1;
        this.calculateSemesterGrades();
        return;
      }
      const index = this.courses.indexOf(course);
      course.weight = isChecked ? 1.5 : 1;
      this.courses[index] = course;
      this.calculateSemesterGrades();
    },
    calculateSemesterGrades(): void {
      if (this.courses.length === 0) {
        this.averageUnweightedGpa = 0;
        this.averageWeightedGpa = 0;
        return;
      }

      for (let x = 0; x < this.courses.length; x++) {
        const course = this.courses[x];
        const grade = this.gradeLabels[course.grade];
        let gpa = 4;

        if (grade.includes('B')) {
          gpa = 3;
        } else if (grade.includes('C')) {
          gpa = 2;
        } else if (grade.includes('D')) {
          gpa = 1;
        } else if (grade.includes('F')) {
          gpa = 0;
        }

        let unweightedGPA = gpa;
        let weightedGPA = gpa + [0, 0.5, 1][course.level];
        course.finalGrade = grade;

        if (grade.includes('F')) {
          unweightedGPA = 0;
          weightedGPA = 0;
        }

        course.unweightedGPA = unweightedGPA;
        course.weightedGPA = weightedGPA;
        this.courses[x] = course;
      }

      let unweightedGPASum = 0;
      let weightedGPASum = 0;
      let weightTotal = 0;

      this.courses.forEach((course: Course) => {
        unweightedGPASum += course.unweightedGPA * course.weight;
        weightedGPASum += course.weightedGPA * course.weight;
        weightTotal += course.weight;
      });

      this.averageUnweightedGpa = weightTotal > 0 ? unweightedGPASum / weightTotal : 0;
      this.averageWeightedGpa = weightTotal > 0 ? weightedGPASum / weightTotal : 0;
    },
  },
});
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.gpa-title-row
  display: flex
  justify-content: center
  gap: 25px

.weight-title
  text-align: center
  margin-bottom: 0

.top-card
  max-width: 985px
  +desktop
    margin: 0px auto !important

  .overall-gpa
    margin: 4px
    font-size: 3.5em
    font-weight: 500

  .add-course-button
    width: 150px
    margin: 8px auto 2px auto

  .upload-transcript-button
    width: 185px
    margin: 8px auto 2px auto

  .hidden-input
    display: none

  .note-text
    padding: 12px 0px

  .import-status
    margin: 0
    color: var(--secondary)
    font-size: .92em

.add-course-dialog
  width: min(92vw, 640px)
  padding: 24px

  .dialog-title
    margin: 0
    color: var(--primary)

  .dialog-subtitle
    margin: 8px 0 0 0
    color: var(--secondary)

  .year-chip-row
    display: flex
    flex-wrap: wrap
    gap: 10px
    margin-top: 18px

  .year-chip
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

  .course-search
    width: 100%
    box-sizing: border-box
    margin-top: 16px
    padding: 12px 14px
    border-radius: 12px
    border: 1px solid var(--accent)
    background-color: var(--background)
    color: var(--primary)
    font: inherit
    outline: none

  .course-results
    max-height: 320px
    overflow-y: auto
    display: flex
    flex-direction: column
    gap: 10px
    margin-top: 16px

  .course-option
    text-align: left
    border: 1px solid rgba(128, 128, 128, 0.15)
    background-color: var(--secondaryBackground)
    border-radius: 14px
    padding: 14px
    cursor: pointer
    display: flex
    flex-direction: column
    gap: 4px
    font: inherit
    color: var(--primary)

    &.selected
      border-color: var(--accent)
      box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.04)

  .course-option-name
    font-weight: 700

  .course-option-meta,
  .course-option-description
    color: var(--secondary)
    font-size: .92em

  .dialog-actions
    margin-top: 18px
    display: flex
    justify-content: flex-end
    gap: 10px

.year-sections
  max-width: 1080px
  margin: 10px auto 0 auto

  .empty-text
    margin: 0
    color: var(--secondary)

.gpa-card-container
  margin-top: 10px

  .gpa-card
    overflow: visible
    margin: 0px 0px
    background-color: white
    border-radius: 10px
    +animate-fade-up

    .gpa-tile
      display: flex
      align-items: flex-start
      background-color: var(--accent)
      color: var(--background)
      border-top-right-radius: 10px
      border-top-left-radius: 10px

      .name-group
        flex: 1
        margin: 0px 12px
        padding: 10px 0px 8px 0px
        text-align: left

      .name
        margin: 0
        font-size: 1.4em
        font-weight: 700

      .course-meta
        margin: 3px 0 0 0
        opacity: 0.86
        line-height: 1.35

      .close
        width: 18px
        position: absolute
        top: 13px
        right: 11px
        cursor: pointer

    .course-settings-row
      margin: 0 5px
      display: flex
      gap: 6px
      flex-wrap: wrap
      padding: 12px 0px 0px 4px

    .grade-label
      padding: 10px 0 0 0
      margin: 0 auto
      text-align: center
      font-size: 3em

    .final-gpa
      color: var(--accent)
      font-size: 2em
      text-align: center

    .science-note
      margin: 8px 0 0 0
      text-align: center
      color: var(--secondary)
      font-size: .85em
</style>
