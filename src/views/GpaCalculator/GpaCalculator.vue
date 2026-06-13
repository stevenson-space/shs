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

        <div class="total-credits-row">
          <span class="total-credits-label">Total Credits</span>
          <span class="total-credits-value">{{ totalCredits.toFixed(2) }}</span>
        </div>

        <div class="action-row">
          <select
            class="add-select"
            :disabled="remainingYearLabels.length === 0"
            :value="''"
            @change="onAddYearSelect"
            @keydown="onActionSelectKeydown"
          >
            <option value="" disabled>
              {{ remainingYearLabels.length ? '+ Add School Year…' : 'All Years Added' }}
            </option>
            <option
              v-for="label in remainingYearLabels"
              :key="label"
              :value="label"
            >
              {{ label }}
            </option>
          </select>

          <select
            class="add-select"
            :disabled="remainingSummerLabels.length === 0"
            :value="''"
            @change="onAddSummerSelect"
            @keydown="onActionSelectKeydown"
          >
            <option value="" disabled>
              {{ remainingSummerLabels.length ? '+ Add Summer…' : 'All Summers Added' }}
            </option>
            <option
              v-for="label in remainingSummerLabels"
              :key="label"
              :value="label"
            >
              {{ label }}
            </option>
          </select>
        </div>

        <div class="action-row">
          <input
            v-model="customGroupName"
            class="custom-group-input"
            type="text"
            maxlength="40"
            placeholder="Custom group name"
            @keyup.enter="addCustomGroup"
          />

          <rounded-button
            class="action-button"
            :icon="icons.faPlus"
            text="Add Group"
            invert
            @click="addCustomGroup"
          />
        </div>

        <div class="edit-note">
          Course names are editable and can automatically set credit level from the name.
          Full-year courses are linked across semesters.
          Linked courses can be unsynced if needed.
          Courses dropped into the Ungrouped section don't need a year or group.
        </div>
      </div>
    </card>

    <div class="planner-container">
      <div
        v-for="(group, gIdx) in groups"
        :key="group.id"
        class="year-block animated-fade-up"
        :class="{
          'summer-theme': group.type === 'summer',
          'custom-theme': group.type === 'custom',
          'ungrouped-theme': group.type === 'ungrouped',
        }"
        :style="{ animationDelay: gIdx * 0.08 + 's' }"
      >
        <div class="year-banner">
          <input
            v-if="group.type === 'custom'"
            class="banner-input"
            type="text"
            maxlength="40"
            :value="group.label"
            @input="onGroupLabelInput(group, $event)"
          />
          <span v-else>{{ group.label }}</span>

          <font-awesome-icon
            v-if="group.type !== 'ungrouped'"
            class="year-close"
            :icon="icons.faXmark"
            @click.stop="removeGroup(gIdx)"
          />
        </div>

        <div
          class="semester-grid"
          :class="{ 'single-col': group.semesters.length === 1 }"
        >
          <div
            v-for="(semester, sIdx) in group.semesters"
            :key="group.id + '-sem-' + sIdx"
            class="sem-column"
          >
            <div v-if="group.semesters.length === 2" class="sem-header">
              {{ group.type === 'summer' ? 'Summer Session ' + (sIdx + 1) : 'Semester ' + (sIdx + 1) }}
            </div>

            <template
              v-for="(course, cIdx) in semester.courses"
              :key="course.instanceId"
            >
              <div v-if="course.isPlaceholder" class="placeholder-card">
                <span class="placeholder-text">Open slot</span>
                <button class="mini-btn" @click="fillPlaceholder(gIdx, sIdx, cIdx)">
                  Add course here
                </button>
              </div>

              <card
                v-else
                class="course-card"
                :wrapperStyle="{ overflow: 'visible' }"
              >
                <div class="course-header-row">
                  <font-awesome-icon
                    v-if="course.linkedId"
                    class="linked-icon"
                    :class="{ unsynced: !course.syncEnabled }"
                    :icon="course.syncEnabled ? icons.faLink : icons.faLinkSlash"
                    :title="course.syncEnabled ? 'Synced full-year course' : 'Unsynced full-year course'"
                  />

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
                    @click="removeCourse(gIdx, sIdx, course)"
                  />
                </div>

                <div v-if="course.linkedId" class="sync-row">
                  <label>
                    <input
                      type="checkbox"
                      :checked="course.syncEnabled"
                      @change="toggleSync(gIdx, course, $event)"
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
                    class="icon-btn"
                    title="Move up"
                    :disabled="isFirstReal(semester, course)"
                    @click="moveCourse(gIdx, sIdx, course, -1)"
                  >
                    <font-awesome-icon :icon="icons.faArrowUp" />
                  </button>

                  <button
                    class="icon-btn"
                    title="Move down"
                    :disabled="isLastReal(semester, course)"
                    @click="moveCourse(gIdx, sIdx, course, 1)"
                  >
                    <font-awesome-icon :icon="icons.faArrowDown" />
                  </button>

                  <select
                    class="group-select"
                    :value="''"
                    @change="onChangeGroup(gIdx, sIdx, course, $event)"
                    @keydown="onActionSelectKeydown"
                  >
                    <option value="" disabled>Change group…</option>
                    <option
                      v-for="(target, ti) in moveTargets(gIdx, sIdx)"
                      :key="ti"
                      :value="String(ti)"
                    >
                      {{ target.label }}
                    </option>
                  </select>
                </div>

                <div
                  v-if="group.semesters.length === 2 && !course.linkedId"
                  class="link-row"
                >
                  <button
                    class="mini-btn link-btn"
                    @click="addLinkedClass(gIdx, sIdx, course)"
                  >
                    <font-awesome-icon :icon="icons.faLink" />
                    Add Linked Class
                  </button>
                </div>
              </card>
            </template>

            <div
              v-if="group.type === 'year' && semester.stats"
              class="sem-gpa-row"
            >
              <span class="sem-gpa-label">Semester GPA</span>
              <span class="sem-gpa-stats">
                <span class="gpa-stat">Weighted&nbsp;<b>{{ semester.stats.w.toFixed(2) }}</b></span>
                <span class="gpa-stat">Unweighted&nbsp;<b>{{ semester.stats.uw.toFixed(2) }}</b></span>
                <span class="gpa-stat"><b>{{ semester.stats.units.toFixed(2) }}</b>&nbsp;credits</span>
              </span>
            </div>

            <div class="footer-actions">
              <button class="sketch-btn" @click="addCourse(gIdx, sIdx)">
                Add course
              </button>

              <button
                v-if="group.semesters.length === 2"
                class="sketch-btn"
                @click="addFullYear(gIdx)"
              >
                Add full-year course
              </button>
            </div>
          </div>
        </div>

        <div
          v-if="group.type !== 'year' && group.stats"
          class="group-gpa-bar"
        >
          <span class="sem-gpa-label">
            {{ group.type === 'summer' ? 'Summer GPA' : 'Group GPA' }}
          </span>
          <span class="gpa-stat">Weighted&nbsp;<b>{{ group.stats.w.toFixed(2) }}</b></span>
          <span class="gpa-stat">Unweighted&nbsp;<b>{{ group.stats.uw.toFixed(2) }}</b></span>
          <span class="gpa-stat"><b>{{ group.stats.units.toFixed(2) }}</b>&nbsp;credits</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  faXmark,
  faPlus,
  faLink,
  faLinkSlash,
  faArrowUp,
  faArrowDown,
} from '@fortawesome/free-solid-svg-icons';
import Checkbox from '@/components/Checkbox.vue';
import RoundedButton from '@/components/RoundedButton.vue';
import Card from '@/components/Card.vue';
import PlainHeader from '@/components/PlainHeader.vue';
import Dropdown from '@/components/Dropdown.vue';

class Course {
  instanceId: string;
  linkedId: string | null;
  syncEnabled: boolean;
  isPlaceholder: boolean;
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
    this.isPlaceholder = false;
    this.name = name;
    this.grade = 0;
    this.level = 0;
    this.weight = 1.0;
    this.unweightedGPA = 4.0;
    this.weightedGPA = 4.0;
    this.finalGrade = 'A';
  }
}

type SemesterStats = {
  units: number;
  uw: number;
  w: number;
};

type Semester = {
  courses: Course[];
  stats?: SemesterStats | null;
};

type GroupType = 'year' | 'summer' | 'custom' | 'ungrouped';

type Group = {
  id: string;
  label: string;
  type: GroupType;
  semesters: Semester[];
  stats?: SemesterStats | null;
};

type MoveTarget = {
  label: string;
  gIdx: number;
  sIdx: number;
};

const STORAGE_KEY = 'SHS_PLANNER_DATA';

const GROUP_TYPES: GroupType[] = ['year', 'summer', 'custom', 'ungrouped'];

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
      icons: { faPlus, faXmark, faLink, faLinkSlash, faArrowUp, faArrowDown },
      groups: [] as Group[],
      customGroupName: '',
      averageUnweightedGpa: 0,
      averageWeightedGpa: 0,
      totalCredits: 0,
      courseLevels: ['Regular', 'Accelerated', 'Honors/AP'],
      gradeLabels: ['A', 'B', 'C', 'D', 'F'],
    };
  },

  computed: {
    usedYearLabels(): string[] {
      return this.groups
        .filter((group) => group.type === 'year')
        .map((group) => group.label);
    },

    usedSummerLabels(): string[] {
      return this.groups
        .filter((group) => group.type === 'summer')
        .map((group) => group.label);
    },

    remainingYearLabels(): string[] {
      return YEAR_LABELS.filter((label) => !this.usedYearLabels.includes(label));
    },

    remainingSummerLabels(): string[] {
      return SUMMER_LABELS.filter((label) => !this.usedSummerLabels.includes(label));
    },
  },

  mounted() {
    this.loadSavedData();
    this.ensureUngrouped();
    this.refresh();
  },

  methods: {
    /* ------------------------------------------------------------------ */
    /* Factories & helpers                                                 */
    /* ------------------------------------------------------------------ */

    createId(): string {
      return Math.random().toString(36).substring(2, 11);
    },

    sanitizeText(value: string): string {
      return value.replace(/\uFFFD/g, '').replace(/�/g, '');
    },

    createCourse(name = '', linkedId: string | null = null): Course {
      return new Course(this.sanitizeText(name), linkedId);
    },

    createPlaceholder(): Course {
      const placeholder = new Course('');
      placeholder.isPlaceholder = true;
      return placeholder;
    },

    createRegularYear(label: string): Group {
      const linkedId = this.createId();

      return {
        id: this.createId(),
        label,
        type: 'year',
        semesters: [
          { courses: [this.createCourse('Course 1', linkedId)] },
          { courses: [this.createCourse('Course 1', linkedId)] },
        ],
      };
    },

    createSummerGroup(label: string): Group {
      return {
        id: this.createId(),
        label,
        type: 'summer',
        semesters: [{ courses: [] }, { courses: [] }],
      };
    },

    createCustomGroup(label: string): Group {
      return {
        id: this.createId(),
        label,
        type: 'custom',
        semesters: [{ courses: [] }],
      };
    },

    createUngrouped(): Group {
      return {
        id: this.createId(),
        label: 'Ungrouped',
        type: 'ungrouped',
        semesters: [{ courses: [] }],
      };
    },

    realCourses(semester: Semester): Course[] {
      return semester.courses.filter((course) => !course.isPlaceholder);
    },

    realIndex(semester: Semester, course: Course): number {
      return this.realCourses(semester).findIndex(
        (c) => c.instanceId === course.instanceId
      );
    },

    isFirstReal(semester: Semester, course: Course): boolean {
      return this.realIndex(semester, course) <= 0;
    },

    isLastReal(semester: Semester, course: Course): boolean {
      const real = this.realCourses(semester);
      return real.findIndex((c) => c.instanceId === course.instanceId) === real.length - 1;
    },

    findPartner(group: Group, course: Course): Course | null {
      if (!course.linkedId) {
        return null;
      }

      for (const semester of group.semesters) {
        for (const candidate of semester.courses) {
          if (
            !candidate.isPlaceholder &&
            candidate.instanceId !== course.instanceId &&
            candidate.linkedId === course.linkedId
          ) {
            return candidate;
          }
        }
      }

      return null;
    },

    /* ------------------------------------------------------------------ */
    /* Persistence                                                         */
    /* ------------------------------------------------------------------ */

    saveData() {
      try {
        const serializable = this.groups.map((group) => ({
          id: group.id,
          label: group.label,
          type: group.type,
          semesters: group.semesters.map((semester) => ({
            courses: this.realCourses(semester),
          })),
        }));

        localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
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

        this.groups = parsed.map((rawGroup: any) => {
          // Migrate the old { isSummer } format to the new { type } format.
          const type: GroupType = GROUP_TYPES.includes(rawGroup.type)
            ? rawGroup.type
            : rawGroup.isSummer
              ? 'summer'
              : 'year';

          const columnCount = type === 'year' || type === 'summer' ? 2 : 1;

          const semesters: Semester[] = Array.isArray(rawGroup.semesters)
            ? rawGroup.semesters.slice(0, columnCount).map((rawSemester: any) => ({
                courses: Array.isArray(rawSemester.courses)
                  ? rawSemester.courses
                      .filter((rawCourse: any) => !rawCourse?.isPlaceholder)
                      .map((rawCourse: any) => {
                        const restored = this.createCourse(
                          typeof rawCourse.name === 'string'
                            ? this.sanitizeText(rawCourse.name)
                            : '',
                          typeof rawCourse.linkedId === 'string'
                            ? rawCourse.linkedId
                            : null
                        );

                        restored.instanceId =
                          typeof rawCourse.instanceId === 'string'
                            ? rawCourse.instanceId
                            : this.createId();

                        restored.syncEnabled =
                          typeof rawCourse.syncEnabled === 'boolean'
                            ? rawCourse.syncEnabled
                            : !!restored.linkedId;

                        restored.grade = this.normalizeGrade(rawCourse.grade);
                        restored.level = this.normalizeLevel(rawCourse.level);

                        restored.weight =
                          rawCourse.weight === 1.5 || rawCourse.weight === 1.0
                            ? rawCourse.weight
                            : 1.0;

                        return restored;
                      })
                  : [],
              }))
            : [];

          while (semesters.length < columnCount) {
            semesters.push({ courses: [] });
          }

          const fallbackLabel =
            type === 'summer'
              ? 'Summer'
              : type === 'custom'
                ? 'Custom Group'
                : type === 'ungrouped'
                  ? 'Ungrouped'
                  : 'School Year';

          return {
            id: typeof rawGroup.id === 'string' ? rawGroup.id : this.createId(),
            label:
              typeof rawGroup.label === 'string'
                ? this.sanitizeText(rawGroup.label)
                : fallbackLabel,
            type,
            semesters,
          } as Group;
        });
      } catch (error) {
        console.error('Failed to load saved GPA data:', error);
        localStorage.removeItem(STORAGE_KEY);
        this.groups = [];
      }
    },

    /* ------------------------------------------------------------------ */
    /* Normalization (grades, levels, names)                               */
    /* ------------------------------------------------------------------ */

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

    /* ------------------------------------------------------------------ */
    /* Group management                                                    */
    /* ------------------------------------------------------------------ */

    ensureUngrouped() {
      const idx = this.groups.findIndex((group) => group.type === 'ungrouped');

      if (idx === -1) {
        this.groups.push(this.createUngrouped());
        return;
      }

      // Keep the ungrouped section pinned at the bottom.
      if (idx !== this.groups.length - 1) {
        const [ungrouped] = this.groups.splice(idx, 1);
        this.groups.push(ungrouped);
      }
    },

    insertGroup(group: Group) {
      const ungroupedIdx = this.groups.findIndex((g) => g.type === 'ungrouped');

      if (ungroupedIdx === -1) {
        this.groups.push(group);
      } else {
        this.groups.splice(ungroupedIdx, 0, group);
      }
    },

    onAddYearSelect(event: Event) {
      const target = event.target as HTMLSelectElement | null;
      const label = target?.value ?? '';

      if (target) {
        target.value = '';
        target.blur();
      }

      if (!label || this.usedYearLabels.includes(label) || !YEAR_LABELS.includes(label)) {
        return;
      }

      this.insertGroup(this.createRegularYear(label));
      this.refresh();
    },

    onAddSummerSelect(event: Event) {
      const target = event.target as HTMLSelectElement | null;
      const label = target?.value ?? '';

      if (target) {
        target.value = '';
        target.blur();
      }

      if (!label || this.usedSummerLabels.includes(label) || !SUMMER_LABELS.includes(label)) {
        return;
      }

      this.insertGroup(this.createSummerGroup(label));
      this.refresh();
    },

    onActionSelectKeydown(event: KeyboardEvent) {
      const navKeys = [
        'ArrowDown',
        'ArrowUp',
        'ArrowLeft',
        'ArrowRight',
        'Home',
        'End',
        'PageUp',
        'PageDown',
      ];

      if (!navKeys.includes(event.key) || event.altKey) {
        return;
      }

      // On Windows / ChromeOS, arrow keys on a focused-but-closed
      // <select> silently cycle its value, firing one change event per
      // keypress -- so holding the down arrow to scroll the page was
      // adding every school year in sequence. Block the cycling and,
      // for up/down, open the picker instead so a deliberate choice is
      // still one keystroke away. (Alt+Arrow keeps its native
      // open-the-popup behavior.)
      event.preventDefault();

      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        const select = event.target as HTMLSelectElement & {
          showPicker?: () => void;
        };

        try {
          select.showPicker?.();
        } catch {
          // The picker may already be open, or the browser may not
          // allow it here; either way there's nothing to clean up.
        }
      }
    },

    addCustomGroup() {
      const label = this.sanitizeText(this.customGroupName).trim();

      if (!label) {
        return;
      }

      this.insertGroup(this.createCustomGroup(label));
      this.customGroupName = '';
      this.refresh();
    },

    onGroupLabelInput(group: Group, event: Event) {
      const target = event.target as HTMLInputElement | null;
      group.label = this.sanitizeText(target?.value ?? '');
      this.saveData();
    },

    removeGroup(idx: number) {
      const group = this.groups[idx];

      if (!group || group.type === 'ungrouped') {
        return;
      }

      this.groups.splice(idx, 1);
      this.refresh();
    },

    /* ------------------------------------------------------------------ */
    /* Course management                                                   */
    /* ------------------------------------------------------------------ */

    addCourse(gIdx: number, sIdx: number) {
      const semester = this.groups[gIdx]?.semesters[sIdx];

      if (!semester) {
        return;
      }

      const newCourse = this.createCourse(
        `Course ${this.realCourses(semester).length + 1}`
      );

      // If this semester has a placeholder (an open slot opposite an
      // unmatched course), the new course fills that slot first.
      const placeholderIdx = semester.courses.findIndex((c) => c.isPlaceholder);

      if (placeholderIdx !== -1) {
        semester.courses.splice(placeholderIdx, 1, newCourse);
      } else {
        semester.courses.push(newCourse);
      }

      this.refresh();
    },

    fillPlaceholder(gIdx: number, sIdx: number, cIdx: number) {
      const semester = this.groups[gIdx]?.semesters[sIdx];
      const placeholder = semester?.courses[cIdx];

      if (!semester || !placeholder || !placeholder.isPlaceholder) {
        return;
      }

      semester.courses.splice(
        cIdx,
        1,
        this.createCourse(`Course ${this.realCourses(semester).length + 1}`)
      );

      this.refresh();
    },

    addFullYear(gIdx: number) {
      const group = this.groups[gIdx];

      if (!group || group.semesters.length !== 2) {
        return;
      }

      const [first, second] = group.semesters;
      const linkedId = this.createId();
      const count = Math.max(
        this.realCourses(first).length,
        this.realCourses(second).length
      );
      const name = `Course ${count + 1}`;

      first.courses.push(this.createCourse(name, linkedId));
      second.courses.push(this.createCourse(name, linkedId));

      this.refresh();
    },

    addLinkedClass(gIdx: number, sIdx: number, course: Course) {
      const group = this.groups[gIdx];

      if (!group || group.semesters.length !== 2 || course.linkedId) {
        return;
      }

      const linkedId = this.createId();
      course.linkedId = linkedId;
      course.syncEnabled = true;

      const partner = this.createCourse(course.name, linkedId);
      partner.level = course.level;
      partner.weight = course.weight;
      partner.grade = 0;

      const otherSemester = group.semesters[sIdx === 0 ? 1 : 0];
      const otherReal = this.realCourses(otherSemester);
      const insertIdx = Math.min(
        Math.max(this.realIndex(group.semesters[sIdx], course), 0),
        otherReal.length
      );

      otherReal.splice(insertIdx, 0, partner);
      otherSemester.courses = otherReal;

      this.refresh();
    },

    removeCourse(gIdx: number, sIdx: number, course: Course) {
      const group = this.groups[gIdx];
      const semester = group?.semesters[sIdx];

      if (!group || !semester) {
        return;
      }

      // When a linked course is deleted, the surviving course loses its
      // link entirely (icon and sync checkbox disappear), whether or not
      // syncing was active.
      const partner = this.findPartner(group, course);

      if (partner) {
        partner.linkedId = null;
        partner.syncEnabled = false;
      }

      const index = semester.courses.findIndex(
        (c) => c.instanceId === course.instanceId
      );

      if (index === -1) {
        return;
      }

      semester.courses.splice(index, 1);
      this.refresh();
    },

    moveCourse(gIdx: number, sIdx: number, course: Course, direction: number) {
      const group = this.groups[gIdx];
      const semester = group?.semesters[sIdx];

      if (!group || !semester) {
        return;
      }

      const real = this.realCourses(semester);
      const idx = real.findIndex((c) => c.instanceId === course.instanceId);
      const targetIdx = idx + direction;

      if (idx === -1 || targetIdx < 0 || targetIdx >= real.length) {
        return;
      }

      [real[idx], real[targetIdx]] = [real[targetIdx], real[idx]];
      semester.courses = real;

      // Linked full-year courses move together so the pair stays aligned.
      if (course.linkedId && group.semesters.length === 2) {
        const otherSemester = group.semesters[sIdx === 0 ? 1 : 0];
        const otherReal = this.realCourses(otherSemester);
        const partnerIdx = otherReal.findIndex(
          (c) => c.linkedId === course.linkedId
        );
        const partnerTarget = partnerIdx + direction;

        if (
          partnerIdx !== -1 &&
          partnerTarget >= 0 &&
          partnerTarget < otherReal.length
        ) {
          [otherReal[partnerIdx], otherReal[partnerTarget]] = [
            otherReal[partnerTarget],
            otherReal[partnerIdx],
          ];
          otherSemester.courses = otherReal;
        }
      }

      this.refresh();
    },

    moveTargets(gIdx: number, sIdx: number): MoveTarget[] {
      const targets: MoveTarget[] = [];

      this.groups.forEach((group, gi) => {
        group.semesters.forEach((semester, si) => {
          if (gi === gIdx && si === sIdx) {
            return;
          }

          let label = group.label;

          if (group.semesters.length === 2) {
            label +=
              group.type === 'summer'
                ? ` · Session ${si + 1}`
                : ` · Sem ${si + 1}`;
          }

          targets.push({ label, gIdx: gi, sIdx: si });
        });
      });

      return targets;
    },

    onChangeGroup(gIdx: number, sIdx: number, course: Course, event: Event) {
      const target = event.target as HTMLSelectElement | null;
      const ti = Number(target?.value ?? NaN);

      if (target) {
        target.value = '';
        target.blur();
      }

      const destination = this.moveTargets(gIdx, sIdx)[ti];
      const group = this.groups[gIdx];
      const semester = group?.semesters[sIdx];

      if (!destination || !group || !semester || Number.isNaN(ti)) {
        return;
      }

      // Moving a linked course out of its pair breaks the link on both
      // sides, mirroring delete behavior.
      const partner = this.findPartner(group, course);

      if (partner) {
        partner.linkedId = null;
        partner.syncEnabled = false;
      }

      course.linkedId = null;
      course.syncEnabled = false;

      const index = semester.courses.findIndex(
        (c) => c.instanceId === course.instanceId
      );

      if (index === -1) {
        return;
      }

      semester.courses.splice(index, 1);

      const destSemester = this.groups[destination.gIdx].semesters[destination.sIdx];
      const placeholderIdx = destSemester.courses.findIndex((c) => c.isPlaceholder);

      if (placeholderIdx !== -1) {
        destSemester.courses.splice(placeholderIdx, 1, course);
      } else {
        destSemester.courses.push(course);
      }

      this.refresh();
    },

    /* ------------------------------------------------------------------ */
    /* Linking & syncing                                                   */
    /* ------------------------------------------------------------------ */

    syncLinkedCourses(source: Course) {
      if (!source.linkedId || !source.syncEnabled) {
        return;
      }

      this.groups.forEach((group) => {
        group.semesters.forEach((semester) => {
          semester.courses.forEach((course) => {
            if (
              !course.isPlaceholder &&
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

    toggleSync(gIdx: number, course: Course, event: Event) {
      const target = event.target as HTMLInputElement | null;
      const checked = !!target?.checked;

      // The sync state itself is synced: toggling it on one course
      // toggles it on its partner too.
      course.syncEnabled = checked;

      const group = this.groups[gIdx];
      const partner = group ? this.findPartner(group, course) : null;

      if (partner) {
        partner.syncEnabled = checked;
      }

      if (checked) {
        this.syncLinkedCourses(course);
      }

      this.refresh();
    },

    onCourseNameInput(course: Course, event: Event) {
      const target = event.target as HTMLInputElement | null;
      course.name = this.sanitizeText(target?.value ?? '');

      const detectedLevel = this.detectLevelFromCourseName(course.name);

      if (detectedLevel !== null) {
        course.level = detectedLevel;
      }

      this.syncLinkedCourses(course);
      this.refresh();
    },

    setGrd(course: Course, value: unknown) {
      course.grade = this.normalizeGrade(value);
      this.refresh();
    },

    setLvl(course: Course, value: unknown) {
      course.level = this.normalizeLevel(value);
      this.syncLinkedCourses(course);
      this.refresh();
    },

    setSci(course: Course, checked: boolean) {
      course.weight = checked ? 1.5 : 1.0;
      this.syncLinkedCourses(course);
      this.refresh();
    },

    /* ------------------------------------------------------------------ */
    /* Alignment of linked pairs (placeholders)                            */
    /* ------------------------------------------------------------------ */

    normalizeGroup(group: Group) {
      // Strip stale placeholders everywhere; they're regenerated below.
      group.semesters.forEach((semester) => {
        semester.courses = this.realCourses(semester);
      });

      // Single-column groups (custom / ungrouped) never carry links.
      if (group.semesters.length !== 2) {
        group.semesters.forEach((semester) => {
          semester.courses.forEach((course) => {
            course.linkedId = null;
            course.syncEnabled = false;
          });
        });
        return;
      }

      const [semA, semB] = group.semesters;
      const all = [...semA.courses, ...semB.courses];

      // Clean dangling links: if a course's partner was deleted, its link
      // (icon + sync checkbox) disappears too.
      const linkCounts = new Map<string, number>();

      all.forEach((course) => {
        if (course.linkedId) {
          linkCounts.set(course.linkedId, (linkCounts.get(course.linkedId) ?? 0) + 1);
        }
      });

      all.forEach((course) => {
        if (course.linkedId && linkCounts.get(course.linkedId) !== 2) {
          course.linkedId = null;
          course.syncEnabled = false;
        }
      });

      // Re-derive placeholders so that linked pairs stay horizontally
      // aligned even when a one-semester course sits between them.
      const a = semA.courses;
      const b = semB.courses;
      const resultA: Course[] = [];
      const resultB: Course[] = [];
      let i = 0;
      let j = 0;

      while (i < a.length || j < b.length) {
        const courseA = a[i];
        const courseB = b[j];

        if (courseA && courseB) {
          if (courseA.linkedId && courseA.linkedId === courseB.linkedId) {
            // Linked pair: same row.
            resultA.push(courseA);
            resultB.push(courseB);
            i += 1;
            j += 1;
          } else if (!courseA.linkedId && !courseB.linkedId) {
            // Two one-semester courses occupy the same row, no padding.
            resultA.push(courseA);
            resultB.push(courseB);
            i += 1;
            j += 1;
          } else if (!courseA.linkedId) {
            // One-semester course opposite a linked course that's still
            // waiting for its partner: pad the other side.
            resultA.push(courseA);
            resultB.push(this.createPlaceholder());
            i += 1;
          } else if (!courseB.linkedId) {
            resultA.push(this.createPlaceholder());
            resultB.push(courseB);
            j += 1;
          } else {
            // Both linked but to different partners (out-of-order pairs):
            // advance one side so the loop always terminates.
            resultA.push(courseA);
            resultB.push(this.createPlaceholder());
            i += 1;
          }
        } else if (courseA) {
          // Trailing courses don't need padding below them.
          resultA.push(courseA);
          i += 1;
        } else if (courseB) {
          resultB.push(courseB);
          j += 1;
        }
      }

      semA.courses = resultA;
      semB.courses = resultB;
    },

    /* ------------------------------------------------------------------ */
    /* Calculation                                                         */
    /* ------------------------------------------------------------------ */

    refresh() {
      this.groups.forEach((group) => this.normalizeGroup(group));
      this.ensureUngrouped();
      this.calculateAll();
      this.saveData();
    },

    calculateAll() {
      let totalUWPoints = 0;
      let totalWPoints = 0;
      let totalUnits = 0;

      this.groups.forEach((group) => {
        let groupUWPoints = 0;
        let groupWPoints = 0;
        let groupUnits = 0;

        group.semesters.forEach((semester) => {
          let semUWPoints = 0;
          let semWPoints = 0;
          let semUnits = 0;

          semester.courses.forEach((course) => {
            if (course.isPlaceholder) {
              return;
            }

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

            semUWPoints += course.unweightedGPA * course.weight;
            semWPoints += course.weightedGPA * course.weight;
            semUnits += course.weight;
          });

          // Per-semester GPA (shown under each semester in school years).
          semester.stats =
            semUnits > 0
              ? {
                  units: semUnits,
                  uw: semUWPoints / semUnits,
                  w: semWPoints / semUnits,
                }
              : null;

          groupUWPoints += semUWPoints;
          groupWPoints += semWPoints;
          groupUnits += semUnits;
        });

        // Group-level GPA: both summer sessions added together, and the
        // single column of custom / ungrouped sections.
        group.stats =
          groupUnits > 0
            ? {
                units: groupUnits,
                uw: groupUWPoints / groupUnits,
                w: groupWPoints / groupUnits,
              }
            : null;

        totalUWPoints += groupUWPoints;
        totalWPoints += groupWPoints;
        totalUnits += groupUnits;
      });

      this.averageUnweightedGpa = totalUnits > 0 ? totalUWPoints / totalUnits : 0;
      this.averageWeightedGpa = totalUnits > 0 ? totalWPoints / totalUnits : 0;
      this.totalCredits = totalUnits;
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

.total-credits-row
  display: flex
  justify-content: center
  align-items: baseline
  gap: 8px
  margin-top: 2px

.total-credits-label
  font-size: 1em
  font-weight: 600
  color: var(--subtext)
  text-transform: uppercase
  letter-spacing: 0.05em

.total-credits-value
  font-size: 1.5em
  font-weight: 600
  color: var(--accent)

.action-row
  display: flex
  justify-content: center
  align-items: center
  gap: 10px
  flex-wrap: wrap
  margin-top: 10px

.add-select
  border: 2px solid var(--accent)
  border-radius: 24px
  background: white
  color: var(--accent)
  font-weight: 700
  font-size: 0.95em
  padding: 8px 14px
  cursor: pointer
  outline: none

  &:hover
    opacity: 0.9

  &:disabled
    opacity: 0.45
    cursor: not-allowed

.custom-group-input
  border: 2px solid var(--accent)
  border-radius: 24px
  padding: 8px 14px
  font-size: 0.95em
  outline: none
  min-width: 220px

.edit-note
  padding: 12px 32px
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

.banner-input
  background: transparent
  border: none
  border-bottom: 2px dashed rgba(255, 255, 255, 0.6)
  color: white
  font-size: 1em
  font-weight: 700
  text-align: center
  outline: none
  max-width: 60%

  &::placeholder
    color: rgba(255, 255, 255, 0.85)

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

.custom-theme
  border-color: #6c5ce7 !important

.custom-theme .year-banner
  background-color: #6c5ce7 !important

.ungrouped-theme
  border-color: #7f8c8d !important

.ungrouped-theme .year-banner
  background-color: #7f8c8d !important

.semester-grid
  width: 100%
  display: grid
  grid-template-columns: 1fr 1fr
  align-items: start

  +mobile
    grid-template-columns: 1fr

.single-col
  grid-template-columns: 1fr !important

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

.placeholder-card
  min-height: 380px
  border: 2px dashed #c9c9c9
  border-radius: 10px
  margin: 0 0 14px 0
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  gap: 12px
  color: var(--subtext)

  +mobile
    min-height: 120px

.placeholder-text
  font-size: 0.9em
  font-weight: 600
  text-transform: uppercase
  letter-spacing: 0.08em
  opacity: 0.7

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
  top: 50%
  transform: translateY(-50%)
  font-size: 0.85rem
  z-index: 2
  opacity: 0.9

.unsynced
  opacity: 0.6

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
  align-items: stretch
  gap: 8px
  padding: 12px 10px 2px 10px

.icon-btn
  width: 42px
  border: 1px solid var(--accent)
  border-radius: 16px
  background: white
  color: var(--accent)
  padding: 6px 0
  font-size: 0.85em
  cursor: pointer

  &:hover
    opacity: 0.9

  &:disabled
    opacity: 0.45
    cursor: not-allowed

.group-select
  flex: 1
  min-width: 0
  border: 1px solid var(--accent)
  border-radius: 16px
  background: white
  color: var(--accent)
  padding: 6px 8px
  font-size: 0.8em
  font-weight: 700
  cursor: pointer
  outline: none

  &:hover
    opacity: 0.9

.link-row
  display: flex
  padding: 8px 10px 2px 10px

.link-btn
  display: flex
  align-items: center
  justify-content: center
  gap: 6px

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

.sem-gpa-row
  box-sizing: border-box
  margin: 2px 0 12px 0
  padding: 8px 12px 9px 12px
  border: 1px solid #e7e7e7
  border-radius: 10px
  background: #fafafa
  text-align: center
  font-size: 0.98em
  line-height: 1.45
  color: var(--text)
  overflow-wrap: break-word

.sem-gpa-label
  display: block
  margin-bottom: 3px
  font-weight: 700
  color: var(--accent)
  text-transform: uppercase
  letter-spacing: 0.04em
  font-size: 0.82em

.gpa-stat
  display: inline-block
  white-space: nowrap
  margin: 0 7px

.sem-gpa-stats
  display: block
  text-align: center

.sem-gpa-stats .gpa-stat
  margin: 0 6px

.group-gpa-bar
  box-sizing: border-box
  border-top: 1px solid #e7e7e7
  padding: 10px 16px 12px 16px
  background: #fafafa
  text-align: center
  font-size: 1.02em
  line-height: 1.5
  color: var(--text)
  overflow-wrap: break-word

.group-gpa-bar .sem-gpa-label
  display: inline-block
  margin: 0 10px 0 0

.summer-theme .sem-gpa-label
  color: #f39c12

.custom-theme .sem-gpa-label
  color: #6c5ce7

.ungrouped-theme .sem-gpa-label
  color: #7f8c8d

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
