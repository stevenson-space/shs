<template>
  <div>
    <plain-header title="GPA Calculator" />

    <card class="top-card">
      <div class="top-card-inner">
        <div class="gpa-title-row">
          <div class="gpa-col">
            <p class="weight-title"><b>Un</b>weighted</p>
            <h1 class="overall-gpa">{{ averageUnweightedGpa.toFixed(2) }}</h1>
          </div>

          <div class="gpa-col">
            <p class="weight-title">Weighted</p>
            <h1 class="overall-gpa">{{ averageWeightedGpa.toFixed(2) }}</h1>
          </div>
        </div>

        <div class="action-row">
          <rounded-button
            class="action-button"
            :icon="icons.faPlus"
            :text="nextYearLabel"
            :disabled="!canAddYear"
            invert
            @click="addYear()"
          />

          <rounded-button
            class="action-button"
            :icon="icons.faPlus"
            :text="nextSummerLabel"
            :disabled="!canAddSummer"
            invert
            @click="addSummer()"
          />
        </div>

        <div class="edit-note">
          Course names are editable and can automatically set credit level from the name.
          Full-year courses are linked across semesters.
          Linked courses can be unsynced if needed.
        </div>
      </div>
    </card>

    <div class="planner-container">
      <div
        v-for="(year, yIdx) in years"
        :key="year.id"
        class="year-block animated-fade-up"
        :class="{ 'summer-theme': year.isSummer }"
        :style="{ animationDelay: yIdx * 0.08 + 's' }"
      >
        <div class="year-banner">
          <span>{{ year.label }}</span>

          <font-awesome-icon
            class="year-close"
            :icon="icons.faXmark"
            @click.stop="removeYear(yIdx)"
          />
        </div>

        <div class="semester-grid">
          <div
            v-for="(semester, sIdx) in year.semesters"
            :key="year.id + '-sem-' + sIdx"
            class="sem-column"
          >
            <div class="sem-header">
              {{ year.isSummer ? 'Summer Session ' + (sIdx + 1) : 'Semester ' + (sIdx + 1) }}
            </div>

            <card
              v-for="(course, cIdx) in semester.courses"
              :key="course.instanceId"
              class="course-card"
              :wrapperStyle="{ overflow: 'visible' }"
            >
              <div class="course-header-row">
                <span
                  v-if="course.linkedId && course.syncEnabled"
                  class="linked-icon"
                  title="Synced full-year course"
                >
                  LINK
                </span>

                <span
                  v-else-if="course.linkedId && !course.syncEnabled"
                  class="linked-icon unsynced"
                  title="Unsynced full-year course"
                >
                  OFF
                </span>

                <input
                  class="name-input"
                  type="text"
                  maxlength="32"
                  :value="course.name"
                  :placeholder="'Course ' + (cIdx + 1)"
                  @input="onCourseNameInput(course, $event)"
                />

                <font-awesome-icon
                  class="close"
                  :icon="icons.faXmark"
                  @click="removeCourse(yIdx, sIdx, course)"
                />
              </div>

              <div v-if="course.linkedId" class="sync-row">
                <label>
                  <input
                    type="checkbox"
                    :checked="course.syncEnabled"
                    @change="toggleSync(course, $event)"
                  />
                  Sync with other semester
                </label>
              </div>

              <div class="course-settings-row">
                <dropdown
                  style="flex: 1"
                  :options="courseLevels"
                  :modelValue="course.level"
                  align="left"
                  @update:modelValue="setLvl(course, $event)"
                />

                <dropdown
                  style="flex: 1"
                  :options="gradeLabels"
                  :modelValue="course.grade"
                  align="left"
                  @update:modelValue="setGrd(course, $event)"
                />
              </div>

              <p class="grade-label">
                {{ course.finalGrade }}
              </p>

              <div class="gpa-title-row inner-gpa-row">
                <div class="gpa-col">
                  <p class="weight-title"><b>Un</b>weighted</p>
                  <div class="final-gpa">
                    {{ course.unweightedGPA.toFixed(2) }}
                  </div>
                </div>

                <div class="gpa-col">
                  <p class="weight-title">Weighted</p>
                  <div class="final-gpa">
                    {{ course.weightedGPA.toFixed(2) }}
                  </div>
                </div>
              </div>

              <checkbox
                :modelValue="course.weight === 1.5"
                @update:modelValue="setSci(course, $event)"
              >
                1.5 Weight Science Class
              </checkbox>

              <div class="move-row">
                <button
                  class="mini-btn"
                  :disabled="cIdx === 0"
                  @click="moveCourse(yIdx, sIdx, cIdx, -1)"
                >
                  Move Up
                </button>

                <button
                  class="mini-btn"
                  :disabled="cIdx === semester.courses.length - 1"
                  @click="moveCourse(yIdx, sIdx, cIdx, 1)"
                >
                  Move Down
                </button>

                <button
                  class="mini-btn"
                  @click="moveCourseToOtherSemester(yIdx, sIdx, cIdx)"
                >
                  Move Semester
                </button>
              </div>
            </card>

            <div class="footer-actions">
              <button
                class="sketch-btn"
                @click="addCourse(yIdx, sIdx)"
              >
                Add course
              </button>

              <button
                class="sketch-btn"
                :disabled="isFullYearDisabled(year)"
                @click="addFullYear(yIdx)"
              >
                Add full-year course
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { faXmark, faPlus } from '@fortawesome/free-solid-svg-icons';
import Checkbox from '@/components/Checkbox.vue';
import RoundedButton from '@/components/RoundedButton.vue';
import Card from '@/components/Card.vue';
import PlainHeader from '@/components/PlainHeader.vue';
import Dropdown from '@/components/Dropdown.vue';

class Course {
  instanceId: string;
  linkedId: string | null;
  syncEnabled: boolean;
  name: string;
  grade: number;
  level: number;
  weight: number;
  unweightedGPA: number;
  weightedGPA: number;
  finalGrade: string;

  constructor(name = '', linkedId: string | null = null) {
    this.instanceId = Math.random().toString(36).substring(2, 11);
    this.linkedId = linkedId;
    this.syncEnabled = !!linkedId;
    this.name = name;
    this.grade = 0;
    this.level = 0;
    this.weight = 1.0;
    this.unweightedGPA = 4.0;
    this.weightedGPA = 4.0;
    this.finalGrade = 'A';
  }
}

type Semester = {
  courses: Course[];
};

type YearBlock = {
  id: string;
  label: string;
  isSummer: boolean;
  semesters: Semester[];
};

const STORAGE_KEY = 'SHS_PLANNER_DATA';

const YEAR_LABELS = [
  'Freshman Year',
  'Sophomore Year',
  'Junior Year',
  'Senior Year',
];

const SUMMER_LABELS = [
  'Rising Freshman Summer',
  'Rising Sophomore Summer',
  'Rising Junior Summer',
  'Rising Senior Summer',
  'Post-Senior Summer',
];

export default defineComponent({
  name: 'GpaCalculator',

  components: {
    RoundedButton,
    Card,
    PlainHeader,
    Dropdown,
    Checkbox,
  },

  data() {
    return {
      icons: { faPlus, faXmark },
      years: [] as YearBlock[],
      averageUnweightedGpa: 0,
      averageWeightedGpa: 0,
      courseLevels: ['Regular', 'Accelerated', 'Honors/AP'],
      gradeLabels: ['A', 'B', 'C', 'D', 'F'],
    };
  },

  computed: {
    usedYearLabels(): string[] {
      return this.years.filter((year) => !year.isSummer).map((year) => year.label);
    },

    usedSummerLabels(): string[] {
      return this.years.filter((year) => year.isSummer).map((year) => year.label);
    },

    canAddYear(): boolean {
      return YEAR_LABELS.some((label) => !this.usedYearLabels.includes(label));
    },

    canAddSummer(): boolean {
      return SUMMER_LABELS.some((label) => !this.usedSummerLabels.includes(label));
    },

    nextYearLabel(): string {
      const next = YEAR_LABELS.find((label) => !this.usedYearLabels.includes(label));
      return next ? 'Add ' + next : 'All Years Added';
    },

    nextSummerLabel(): string {
      const next = SUMMER_LABELS.find((label) => !this.usedSummerLabels.includes(label));
      return next ? 'Add ' + next : 'All Summers Added';
    },
  },

  mounted() {
    this.loadSavedData();
  },

  methods: {
    createId(): string {
      return Math.random().toString(36).substring(2, 11);
    },

    sanitizeText(value: string): string {
      return value.replace(/\uFFFD/g, '').replace(/�/g, '');
    },

    createCourse(name = '', linkedId: string | null = null): Course {
      return new Course(this.sanitizeText(name), linkedId);
    },

    createRegularYear(label: string): YearBlock {
      const linkedId = this.createId();

      return {
        id: this.createId(),
        label,
        isSummer: false,
        semesters: [
          { courses: [this.createCourse('Course 1', linkedId)] },
          { courses: [this.createCourse('Course 1', linkedId)] },
        ],
      };
    },

    createSummerYear(label: string): YearBlock {
      return {
        id: this.createId(),
        label,
        isSummer: true,
        semesters: [{ courses: [] }, { courses: [] }],
      };
    },

    saveData() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.years));
      } catch (error) {
        console.error('Failed to save GPA planner data:', error);
      }
    },

    loadSavedData() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) {
          return;
        }

        const parsed = JSON.parse(saved);

        if (!Array.isArray(parsed)) {
          throw new Error('Saved data is not an array');
        }

        this.years = parsed.map((year: any) => {
          const isSummer = !!year.isSummer;

          const semesters: Semester[] =
            Array.isArray(year.semesters) && year.semesters.length > 0
              ? year.semesters.slice(0, 2).map((sem: any) => ({
                  courses: Array.isArray(sem.courses)
                    ? sem.courses.map((course: any) => {
                        const restoredCourse = this.createCourse(
                          typeof course.name === 'string'
                            ? this.sanitizeText(course.name)
                            : '',
                          typeof course.linkedId === 'string' ? course.linkedId : null
                        );

                        restoredCourse.instanceId =
                          typeof course.instanceId === 'string'
                            ? course.instanceId
                            : this.createId();

                        restoredCourse.syncEnabled =
                          typeof course.syncEnabled === 'boolean'
                            ? course.syncEnabled
                            : !!restoredCourse.linkedId;

                        restoredCourse.grade = this.normalizeGrade(course.grade);
                        restoredCourse.level = this.normalizeLevel(course.level);

                        restoredCourse.weight =
                          course.weight === 1.5 || course.weight === 1.0
                            ? course.weight
                            : 1.0;

                        return restoredCourse;
                      })
                    : [],
                }))
              : [{ courses: [] }, { courses: [] }];

          while (semesters.length < 2) {
            semesters.push({ courses: [] });
          }

          return {
            id: typeof year.id === 'string' ? year.id : this.createId(),
            label:
              typeof year.label === 'string'
                ? this.sanitizeText(year.label)
                : isSummer
                  ? 'Summer'
                  : 'School Year',
            isSummer,
            semesters,
          } as YearBlock;
        });

        this.calculateAll();
      } catch (error) {
        console.error('Failed to load saved GPA data:', error);
        localStorage.removeItem(STORAGE_KEY);
        this.years = [];
      }
    },

    normalizeGrade(value: unknown): number {
      if (typeof value === 'number' && value >= 0 && value < this.gradeLabels.length) {
        return value;
      }

      if (typeof value === 'string') {
        const cleaned = value.trim().toUpperCase();
        const idx = this.gradeLabels.findIndex((grade) => grade === cleaned);
        return idx >= 0 ? idx : 0;
      }

      return 0;
    },

    normalizeLevel(value: unknown): number {
      if (typeof value === 'number' && value >= 0 && value <= 2) {
        return value;
      }

      if (typeof value === 'string') {
        const cleaned = value.trim().toLowerCase();

        if (cleaned.includes('accel') || cleaned.includes('accelerated')) {
          return 1;
        }

        if (cleaned.includes('honors') || cleaned.includes('honor') || cleaned.includes('ap')) {
          return 2;
        }
      }

      return 0;
    },

    detectLevelFromCourseName(name: string): number | null {
      const trimmed = this.sanitizeText(name).trim();

      if (!trimmed) {
        return null;
      }

      const lowered = trimmed.toLowerCase();

      if (/\baccel\b/.test(lowered) || /\baccelerated\b/.test(lowered)) {
        return 1;
      }

      if (/\bhonors\b/.test(lowered) || /\bhonor\b/.test(lowered) || /\bap\b/.test(lowered)) {
        return 2;
      }

      return null;
    },

    addYear() {
      const next = YEAR_LABELS.find((label) => !this.usedYearLabels.includes(label));

      if (!next) {
        return;
      }

      this.years.push(this.createRegularYear(next));
      this.calculateAll();
    },

    addSummer() {
      const next = SUMMER_LABELS.find((label) => !this.usedSummerLabels.includes(label));

      if (!next) {
        return;
      }

      this.years.push(this.createSummerYear(next));
      this.calculateAll();
    },

    removeYear(idx: number) {
      if (idx < 0 || idx >= this.years.length) {
        return;
      }

      this.years.splice(idx, 1);
      this.calculateAll();
    },

    addCourse(yIdx: number, sIdx: number) {
      const semester = this.years[yIdx]?.semesters[sIdx];

      if (!semester) {
        return;
      }

      semester.courses.push(this.createCourse(`Course ${semester.courses.length + 1}`));
      this.calculateAll();
    },

    isFullYearDisabled(year: YearBlock): boolean {
      return !year || year.semesters.length < 2;
    },

    addFullYear(yIdx: number) {
      const year = this.years[yIdx];

      if (!year || this.isFullYearDisabled(year)) {
        return;
      }

      const linkedId = this.createId();

      const firstSemester = year.semesters[0];
      const secondSemester = year.semesters[1];

      if (!firstSemester || !secondSemester) {
        return;
      }

      const insertIndex = Math.max(firstSemester.courses.length, secondSemester.courses.length);
      const defaultName = `Course ${insertIndex + 1}`;

      firstSemester.courses.splice(insertIndex, 0, this.createCourse(defaultName, linkedId));
      secondSemester.courses.splice(insertIndex, 0, this.createCourse(defaultName, linkedId));

      this.calculateAll();
    },

    removeCourse(yIdx: number, sIdx: number, course: Course) {
      const semester = this.years[yIdx]?.semesters[sIdx];

      if (!semester) {
        return;
      }

      const index = semester.courses.findIndex((c) => c.instanceId === course.instanceId);

      if (index === -1) {
        return;
      }

      semester.courses.splice(index, 1);
      this.calculateAll();
    },

    moveCourse(yIdx: number, sIdx: number, cIdx: number, direction: number) {
      const year = this.years[yIdx];

      if (!year) {
        return;
      }

      const semester = year.semesters[sIdx];

      if (!semester) {
        return;
      }

      const course = semester.courses[cIdx];
      const newIdx = cIdx + direction;

      if (!course || newIdx < 0 || newIdx >= semester.courses.length) {
        return;
      }

      const [movedCourse] = semester.courses.splice(cIdx, 1);
      semester.courses.splice(newIdx, 0, movedCourse);

      if (course.linkedId && course.syncEnabled) {
        const otherSemesterIdx = sIdx === 0 ? 1 : 0;
        const otherSemester = year.semesters[otherSemesterIdx];

        if (otherSemester) {
          const linkedIndex = otherSemester.courses.findIndex(
            (c) => c.linkedId === course.linkedId
          );

          if (linkedIndex !== -1) {
            const linkedNewIdx = linkedIndex + direction;

            if (linkedNewIdx >= 0 && linkedNewIdx < otherSemester.courses.length) {
              const [linkedCourse] = otherSemester.courses.splice(linkedIndex, 1);
              otherSemester.courses.splice(linkedNewIdx, 0, linkedCourse);
            }
          }
        }
      }

      this.calculateAll();
    },

    moveCourseToOtherSemester(yIdx: number, sIdx: number, cIdx: number) {
      const year = this.years[yIdx];

      if (!year) {
        return;
      }

      const currentSemester = year.semesters[sIdx];
      const otherSemester = year.semesters[sIdx === 0 ? 1 : 0];

      if (!currentSemester || !otherSemester) {
        return;
      }

      const course = currentSemester.courses[cIdx];

      if (!course) {
        return;
      }

      if (course.linkedId && course.syncEnabled) {
        course.syncEnabled = false;
        course.linkedId = null;
      }

      const [movedCourse] = currentSemester.courses.splice(cIdx, 1);

      const insertIndex = Math.min(cIdx, otherSemester.courses.length);
      otherSemester.courses.splice(insertIndex, 0, movedCourse);

      this.calculateAll();
    },

    syncLinkedCourses(source: Course) {
      if (!source.linkedId || !source.syncEnabled) {
        return;
      }

      this.years.forEach((year) => {
        year.semesters.forEach((semester) => {
          semester.courses.forEach((course) => {
            if (
              course.instanceId !== source.instanceId &&
              course.linkedId === source.linkedId &&
              course.syncEnabled
            ) {
              course.name = source.name;
              course.level = source.level;
              course.weight = source.weight;
            }
          });
        });
      });
    },

    toggleSync(course: Course, event: Event) {
      const target = event.target as HTMLInputElement | null;
      course.syncEnabled = !!target?.checked;

      if (course.syncEnabled) {
        this.syncLinkedCourses(course);
      }

      this.calculateAll();
    },

    onCourseNameInput(course: Course, event: Event) {
      const target = event.target as HTMLInputElement | null;
      course.name = this.sanitizeText(target?.value ?? '');

      const detectedLevel = this.detectLevelFromCourseName(course.name);

      if (detectedLevel !== null) {
        course.level = detectedLevel;
      }

      this.syncLinkedCourses(course);
      this.calculateAll();
    },

    setGrd(course: Course, value: unknown) {
      course.grade = this.normalizeGrade(value);
      this.calculateAll();
    },

    setLvl(course: Course, value: unknown) {
      course.level = this.normalizeLevel(value);
      this.syncLinkedCourses(course);
      this.calculateAll();
    },

    setSci(course: Course, checked: boolean) {
      course.weight = checked ? 1.5 : 1.0;
      this.syncLinkedCourses(course);
      this.calculateAll();
    },

    calculateAll() {
      let totalUWPoints = 0;
      let totalWPoints = 0;
      let totalUnits = 0;

      this.years.forEach((year) => {
        year.semesters.forEach((semester) => {
          semester.courses.forEach((course) => {
            course.name = this.sanitizeText(course.name);

            const grade = this.gradeLabels[this.normalizeGrade(course.grade)] ?? 'A';

            let base = 0;

            if (grade === 'A') {
              base = 4;
            } else if (grade === 'B') {
              base = 3;
            } else if (grade === 'C') {
              base = 2;
            } else if (grade === 'D') {
              base = 1;
            } else {
              base = 0;
            }

            let bump = 0;
            const normalizedLevel = this.normalizeLevel(course.level);

            if (normalizedLevel === 1) {
              bump = 0.5;
            } else if (normalizedLevel === 2) {
              bump = 1.0;
            }

            course.grade = this.normalizeGrade(course.grade);
            course.level = normalizedLevel;
            course.finalGrade = grade;
            course.unweightedGPA = grade === 'F' ? 0 : base;
            course.weightedGPA = grade === 'F' ? 0 : base + bump;

            totalUWPoints += course.unweightedGPA * course.weight;
            totalWPoints += course.weightedGPA * course.weight;
            totalUnits += course.weight;
          });
        });
      });

      this.averageUnweightedGpa = totalUnits > 0 ? totalUWPoints / totalUnits : 0;
      this.averageWeightedGpa = totalUnits > 0 ? totalWPoints / totalUnits : 0;

      this.saveData();
    },
  },
});
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.top-card
  max-width: 985px
  margin: 0 auto 18px auto !important

.top-card-inner
  text-align: center

.gpa-title-row
  display: flex
  justify-content: center
  gap: 25px

.gpa-col
  min-width: 120px

.weight-title
  text-align: center
  margin-bottom: 0

.overall-gpa
  margin: 4px
  font-size: 3.5em
  font-weight: 500

.action-row
  display: flex
  justify-content: center
  gap: 10px
  flex-wrap: wrap
  margin-top: 10px

.edit-note
  padding: 12px 0
  font-size: 0.98em
  color: var(--subtext)

.planner-container
  width: 100%
  max-width: 1050px
  margin: 0 auto 40px auto
  display: flex
  flex-direction: column
  gap: 22px

.animated-fade-up
  animation: fadeUp 0.45s ease backwards

@keyframes fadeUp
  from
    opacity: 0
    transform: translateY(20px)

  to
    opacity: 1
    transform: translateY(0)

.year-block
  width: 100%
  border: 2px solid var(--accent)
  border-radius: 12px
  background: white
  overflow: hidden
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05)

.year-banner
  width: 100%
  background-color: var(--accent)
  color: white
  text-align: center
  font-size: 1.75em
  font-weight: 700
  padding: 12px 18px
  position: relative
  display: flex
  justify-content: center
  align-items: center

.year-close
  position: absolute
  right: 39px
  top: 50%
  transform: translateY(-50%)
  width: 42px
  height: 42px
  display: flex
  align-items: center
  justify-content: center
  cursor: pointer
  color: var(--background)
  font-size: 1.45rem
  line-height: 1
  z-index: 20

  &:hover
    opacity: 0.8

.summer-theme
  border-color: #f39c12 !important

.summer-theme .year-banner
  background-color: #f39c12 !important

.semester-grid
  width: 100%
  display: grid
  grid-template-columns: 1fr 1fr
  align-items: start

  +mobile
    grid-template-columns: 1fr

.sem-column
  padding: 16px
  border-right: 1px solid #e7e7e7
  min-width: 0

  &:last-child
    border-right: none

.sem-header
  text-align: center
  font-size: 1.35em
  font-weight: 700
  color: var(--accent)
  margin-bottom: 14px

.course-card
  display: block
  width: 100%
  overflow: visible
  margin: 0 0 14px 0
  padding-bottom: 12px
  background-color: white
  border-radius: 10px

.course-header-row
  display: flex
  background-color: var(--accent)
  color: white
  border-top-right-radius: 10px
  border-top-left-radius: 10px
  position: relative
  align-items: center

.linked-icon
  position: absolute
  left: 10px
  font-size: 0.7rem
  font-weight: 800
  z-index: 2
  opacity: 0.9

.unsynced
  opacity: 0.65

.name-input
  width: 100%
  outline: none
  border: none
  text-align: center
  font-size: 1.45em
  flex: 1
  margin: 0 36px 0 36px
  padding: 8px 0 6px 0
  background-color: transparent
  color: white

.name-input::placeholder
  color: rgba(255, 255, 255, 0.85)

.close
  position: absolute
  right: 10px
  top: 50%
  transform: translateY(-50%)
  width: 24px
  height: 24px
  display: flex
  align-items: center
  justify-content: center
  cursor: pointer
  color: white
  line-height: 1

.sync-row
  padding: 8px 12px 0 12px
  font-size: 0.85em
  color: var(--subtext)
  display: flex
  justify-content: center

.course-settings-row
  margin: 0 5px
  display: flex
  gap: 8px
  padding: 12px 4px 0 4px

.grade-label
  padding: 10px 0 4px 0
  margin: 0 auto
  text-align: center
  font-size: 3em
  font-weight: 600
  color: var(--text)

.inner-gpa-row
  margin-top: 4px
  margin-bottom: 10px

.final-gpa
  color: var(--accent)
  font-size: 2em
  text-align: center
  font-weight: 600

.move-row
  display: flex
  gap: 8px
  padding: 12px 10px 2px 10px

.mini-btn
  flex: 1
  border: 1px solid var(--accent)
  border-radius: 16px
  background: white
  color: var(--accent)
  padding: 6px 8px
  font-size: 0.8em
  font-weight: 700
  cursor: pointer

  &:hover
    opacity: 0.9

  &:disabled
    opacity: 0.45
    cursor: not-allowed

.footer-actions
  display: flex
  gap: 12px
  margin-top: 10px

.sketch-btn
  flex: 1
  border: 2px solid var(--accent)
  border-radius: 24px
  background: white
  color: var(--accent)
  padding: 8px 12px
  font-weight: 700
  cursor: pointer
  transition: 0.18s

  &:hover
    opacity: 0.9
    transform: scale(1.02)

  &:disabled
    opacity: 0.45
    cursor: not-allowed
    transform: none

:deep(.course-card .card)
  width: 100% !important
  overflow: visible !important

:deep(.course-card .card-wrapper)
  width: 100% !important
  overflow: visible !important
</style>
