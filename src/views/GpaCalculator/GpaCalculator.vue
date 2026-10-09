<template>
  <div class="gpa-page">
    <plain-header title="GPA Calculator" />

    <div ref="summary" class="summary">
      <div v-for="stat in summaryStats" :key="stat.key" class="stat">
        <span class="stat-label">{{ stat.label }}</span>
        <span class="stat-value">{{ stat.value }}</span>
      </div>
    </div>

    <transition name="summary-pill">
      <div v-if="compact" class="summary compact" aria-hidden="true">
        <div v-for="stat in summaryStats" :key="stat.key" class="stat">
          <span class="stat-label">{{ stat.label }}</span>
          <span class="stat-value">{{ stat.value }}</span>
        </div>
      </div>
    </transition>

    <div class="toolbar">
      <div class="toolbar-row">
        <div class="select-wrap">
          <select class="add-select"
                  aria-label="Add a school year"
                  :disabled="remainingYearLabels.length === 0"
                  :value="''"
                  @change="onAddYearSelect"
                  @keydown="onActionSelectKeydown">
            <option value="" disabled>
              {{ remainingYearLabels.length ? '+ Add School Year' : 'All Years Added' }}
            </option>
            <option v-for="label in remainingYearLabels"
                    :key="label"
                    :value="label">
              {{ label }}
            </option>
          </select>
          <font-awesome-icon class="select-chevron" :icon="icons.faChevronDown" />
        </div>

        <div class="select-wrap">
          <select class="add-select"
                  aria-label="Add a summer"
                  :disabled="remainingSummerLabels.length === 0"
                  :value="''"
                  @change="onAddSummerSelect"
                  @keydown="onActionSelectKeydown">
            <option value="" disabled>
              {{ remainingSummerLabels.length ? '+ Add Summer' : 'All Summers Added' }}
            </option>
            <option v-for="label in remainingSummerLabels"
                    :key="label"
                    :value="label">
              {{ label }}
            </option>
          </select>
          <font-awesome-icon class="select-chevron" :icon="icons.faChevronDown" />
        </div>

        <div class="custom-group">
          <input v-model="customGroupName"
                 class="custom-group-input"
                 type="text"
                 maxlength="40"
                 placeholder="Custom group name"
                 aria-label="Custom group name"
                 @keyup.enter="addCustomGroup" />

          <button class="custom-group-btn"
                  type="button"
                  :disabled="!customGroupName.trim()"
                  @click="addCustomGroup">
            <font-awesome-icon :icon="icons.faPlus" />
            Add Group
          </button>
        </div>
      </div>

      <p class="edit-note">
        Course names are editable and can automatically set credit level from the name.
        Full-year courses are linked across semesters.
        Linked courses can be unsynced if needed.
        Courses dropped into the Ungrouped section don't need a year or group.
      </p>
    </div>

    <div v-if="!hasUserGroups" class="empty-state">
      <div class="empty-title">Start with a school year</div>
      <div class="empty-chips">
        <button v-for="label in remainingYearLabels"
                :key="label"
                class="empty-chip"
                type="button"
                @click="addYear(label)">
          <font-awesome-icon :icon="icons.faPlus" />
          {{ label }}
        </button>
      </div>
    </div>

    <div class="planner">
      <section v-for="(group, gIdx) in groups"
               :key="group.id"
               class="group animated-fade-up"
               :class="'type-' + group.type"
               :style="{ animationDelay: Math.min(gIdx, 6) * 0.06 + 's' }">
        <header class="group-head">
          <span class="group-dot" aria-hidden="true" />

          <span v-if="group.type === 'custom'" class="group-name-wrap">
            <input class="group-name-input"
                   type="text"
                   maxlength="40"
                   :value="group.label"
                   :size="Math.max((group.label || '').length, 10)"
                   placeholder="Group name"
                   aria-label="Group name"
                   @input="onGroupLabelInput(group, $event)" />
            <font-awesome-icon class="edit-pencil"
                               :icon="icons.faPencil"
                               title="Edit name"
                               @click.stop="focusField($event)" />
          </span>
          <h2 v-else class="group-name">{{ group.label }}</h2>

          <div v-if="group.semesters.length === 2 && group.stats"
               class="group-stats"
               :title="groupGpaLabel(group)">
            <span class="group-stats-label">{{ groupGpaLabel(group) }}</span>
            <span class="gpa-stat">W&nbsp;<b>{{ group.stats.w.toFixed(2) }}</b></span>
            <span class="gpa-stat">UW&nbsp;<b>{{ group.stats.uw.toFixed(2) }}</b></span>
            <span class="gpa-stat"><b>{{ group.stats.units.toFixed(2) }}</b>&nbsp;cr</span>
          </div>

          <button v-if="group.type !== 'ungrouped'"
                  class="icon-btn group-close"
                  type="button"
                  :title="'Remove ' + (group.label || 'group')"
                  :aria-label="'Remove ' + (group.label || 'group')"
                  @click.stop="removeGroup(gIdx)">
            <font-awesome-icon :icon="icons.faXmark" />
          </button>
        </header>

        <div class="sem-grid"
             :class="{ 'single-col': group.semesters.length === 1 }"
             :style="{ '--rows': gridRows(group) }">
          <template v-for="(semester, sIdx) in group.semesters"
                    :key="group.id + '-sem-' + sIdx">
            <div v-if="group.semesters.length === 2" class="sem-head">
              {{ group.type === 'summer' ? 'Summer Session ' + (sIdx + 1) : 'Semester ' + (sIdx + 1) }}
            </div>

            <template v-for="(course, cIdx) in semester.courses"
                      :key="course.instanceId">
              <div v-if="course.isPlaceholder" class="slot">
                <span class="slot-text">Open slot</span>
                <div class="slot-actions">
                  <button v-if="placeholderPartner(gIdx, sIdx, cIdx)"
                          class="pill-btn"
                          type="button"
                          @click="addLinkedFromPlaceholder(gIdx, sIdx, cIdx)">
                    <font-awesome-icon :icon="icons.faLink" />
                    Add linked with "{{ placeholderPartner(gIdx, sIdx, cIdx)?.name || ('Course ' + (cIdx + 1)) }}"
                  </button>
                  <button class="pill-btn" type="button" @click="fillPlaceholder(gIdx, sIdx, cIdx)">
                    Add unlinked course
                  </button>
                </div>
              </div>

              <div v-else
                   class="course"
                   :class="{ open: !!openCourses[course.instanceId], pass: course.finalGrade === 'P' }">
                <span class="name-wrap">
                  <font-awesome-icon v-if="course.linkedId"
                                     class="linked-icon"
                                     :class="{ unsynced: !course.syncEnabled }"
                                     :icon="course.syncEnabled ? icons.faLink : icons.faLinkSlash"
                                     :title="course.syncEnabled ? 'Synced full-year course' : 'Unsynced full-year course'" />
                  <input class="name-input"
                         type="text"
                         maxlength="32"
                         :value="course.name"
                         :placeholder="'Course ' + (cIdx + 1)"
                         aria-label="Course name"
                         @input="onCourseNameInput(course, $event)" />
                  <font-awesome-icon class="edit-pencil"
                                     :icon="icons.faPencil"
                                     title="Edit name"
                                     @click.stop="focusField($event)" />
                </span>

                <span class="points">
                  <template v-if="course.finalGrade === 'P'">
                    Not in GPA
                  </template>
                  <template v-else>
                    UW&nbsp;
                    <b>{{ course.unweightedGPA.toFixed(2) }}</b>
                    <span class="points-sep">·</span>
                    W&nbsp;
                    <b>{{ course.weightedGPA.toFixed(2) }}</b>
                  </template>
                </span>

                <button class="icon-btn more-btn"
                        type="button"
                        title="More options"
                        aria-label="More options"
                        :aria-expanded="!!openCourses[course.instanceId]"
                        @click="toggleMore(course)">
                  <font-awesome-icon :icon="icons.faEllipsis" />
                </button>

                <button class="icon-btn close"
                        type="button"
                        title="Remove course"
                        aria-label="Remove course"
                        @click="removeCourse(gIdx, sIdx, course)">
                  <font-awesome-icon :icon="icons.faXmark" />
                </button>

                <div class="controls">
                  <div class="seg" role="radiogroup" aria-label="Course level">
                    <button v-for="(label, i) in courseLevelsShort"
                            :key="label"
                            class="seg-btn"
                            type="button"
                            role="radio"
                            :class="{ on: course.level === i }"
                            :aria-checked="course.level === i"
                            :title="courseLevels[i]"
                            @click="setLvl(course, i)">
                      {{ label }}
                    </button>
                  </div>

                  <div class="seg grades" role="radiogroup" aria-label="Grade">
                    <button v-for="(label, i) in gradeLabels"
                            :key="label"
                            class="seg-btn"
                            type="button"
                            role="radio"
                            :class="{ on: course.grade === i }"
                            :aria-checked="course.grade === i"
                            :title="label === 'P' ? 'Pass (not counted in GPA)' : 'Grade ' + label"
                            @click="setGrd(course, i)">
                      {{ label }}
                    </button>
                  </div>

                  <button class="sci-toggle"
                          type="button"
                          title="1.5 Weight Science Class"
                          aria-label="1.5 Weight Science Class"
                          :class="{ on: course.weight === 1.5 }"
                          :aria-pressed="course.weight === 1.5"
                          @click="setSci(course, course.weight !== 1.5)">
                    <font-awesome-icon :icon="icons.faFlask" />
                    1.5×
                  </button>
                </div>

                <div v-if="openCourses[course.instanceId]" class="more">
                  <label v-if="course.linkedId" class="sync-row">
                    <input type="checkbox"
                           :checked="course.syncEnabled"
                           @change="toggleSync(gIdx, course, $event)" />
                    Sync with other semester
                  </label>

                  <div class="more-row">
                    <button class="icon-btn outlined"
                            type="button"
                            title="Move up"
                            aria-label="Move up"
                            :disabled="isFirstReal(semester, course)"
                            @click="moveCourse(gIdx, sIdx, course, -1)">
                      <font-awesome-icon :icon="icons.faArrowUp" />
                    </button>

                    <button class="icon-btn outlined"
                            type="button"
                            title="Move down"
                            aria-label="Move down"
                            :disabled="isLastReal(semester, course)"
                            @click="moveCourse(gIdx, sIdx, course, 1)">
                      <font-awesome-icon :icon="icons.faArrowDown" />
                    </button>

                    <div class="select-wrap group-select-wrap">
                      <select class="group-select"
                              aria-label="Change group"
                              :value="''"
                              @change="onChangeGroup(gIdx, sIdx, course, $event)"
                              @keydown="onActionSelectKeydown">
                        <option value="" disabled>Change group</option>
                        <option v-for="(target, ti) in moveTargets(gIdx, sIdx)"
                                :key="ti"
                                :value="String(ti)">
                          {{ target.label }}
                        </option>
                      </select>
                      <font-awesome-icon class="select-chevron" :icon="icons.faChevronDown" />
                    </div>

                    <button v-if="group.semesters.length === 2 && !course.linkedId"
                            class="pill-btn"
                            type="button"
                            @click="addLinkedClass(gIdx, sIdx, course)">
                      <font-awesome-icon :icon="icons.faLink" />
                      Add Linked Class
                    </button>
                  </div>
                </div>
              </div>
            </template>

            <div class="sem-gpa-row" :class="{ empty: !semester.stats }">
              <template v-if="semester.stats">
                <span class="sem-gpa-label">{{ columnGpaLabel(group) }}</span>
                <span class="sem-gpa-stats">
                  <span class="gpa-stat">Weighted&nbsp;<b>{{ semester.stats.w.toFixed(2) }}</b></span>
                  <span class="gpa-stat">Unweighted&nbsp;<b>{{ semester.stats.uw.toFixed(2) }}</b></span>
                  <span class="gpa-stat"><b>{{ semester.stats.units.toFixed(2) }}</b>&nbsp;credits</span>
                </span>
              </template>
            </div>

            <div class="footer-actions">
              <button class="add-btn" type="button" @click="addCourse(gIdx, sIdx)">
                <font-awesome-icon :icon="icons.faPlus" />
                Add course
              </button>

              <button v-if="group.semesters.length === 2"
                      class="add-btn"
                      type="button"
                      @click="addFullYear(gIdx)">
                <font-awesome-icon :icon="icons.faPlus" />
                Add full-year course
              </button>
            </div>
          </template>
        </div>
      </section>
    </div>

    <transition name="toast">
      <div v-if="undoState" class="undo-toast" role="status">
        <span class="undo-text">{{ undoState.message }}</span>
        <button class="undo-btn" type="button" @click="undo">
          <font-awesome-icon :icon="icons.faRotateLeft" />
          Undo
        </button>
      </div>
    </transition>
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
    faPencil,
    faChevronDown,
    faEllipsis,
    faFlask,
    faRotateLeft,
  } from '@fortawesome/free-solid-svg-icons';
  import PlainHeader from '@/components/PlainHeader.vue';

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

  type UndoState = {
    message: string;
    snapshot: string;
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

  const PASS_GRADE = 'P';

  const UNDO_TIMEOUT_MS = 7000;

  export default defineComponent({
    name: 'GpaCalculator',

    components: {
      PlainHeader,
    },

    data() {
      return {
        icons: {
          faPlus,
          faXmark,
          faLink,
          faLinkSlash,
          faArrowUp,
          faArrowDown,
          faPencil,
          faChevronDown,
          faEllipsis,
          faFlask,
          faRotateLeft,
        },
        groups: [] as Group[],
        customGroupName: '',
        averageUnweightedGpa: 0,
        averageWeightedGpa: 0,
        totalCredits: 0,
        courseLevels: ['Regular', 'Accelerated', 'Honors/AP'],
        courseLevelsShort: ['Regular', 'Accel', 'Honors/AP'],
        gradeLabels: ['A', 'B', 'C', 'D', 'F', PASS_GRADE],
        openCourses: {} as Record<string, boolean>,
        undoState: null as UndoState | null,
        undoTimer: 0,
        compact: false,
        observer: null as IntersectionObserver | null,
      };
    },

    computed: {
      usedYearLabels(): string[] {
        return this.groups
          .filter((group: Group) => group.type === 'year')
          .map((group: Group) => group.label);
      },

      usedSummerLabels(): string[] {
        return this.groups
          .filter((group: Group) => group.type === 'summer')
          .map((group: Group) => group.label);
      },

      remainingYearLabels(): string[] {
        return YEAR_LABELS.filter((label) => !this.usedYearLabels.includes(label));
      },

      remainingSummerLabels(): string[] {
        return SUMMER_LABELS.filter((label) => !this.usedSummerLabels.includes(label));
      },

      summaryStats(): { key: string; label: string; value: string }[] {
        return [
          { key: 'unweighted', label: 'Unweighted', value: this.averageUnweightedGpa.toFixed(2) },
          { key: 'weighted', label: 'Weighted', value: this.averageWeightedGpa.toFixed(2) },
          { key: 'credits', label: 'Credits', value: this.totalCredits.toFixed(2) },
        ];
      },

      hasUserGroups(): boolean {
        return this.groups.some(
          (group: Group) => group.type !== 'ungrouped'
            || group.semesters.some((semester: Semester) => semester.courses.length > 0),
        );
      },
    },

    mounted() {
      this.loadSavedData();
      this.ensureUngrouped();
      this.refresh();
      this.watchSummary();
    },

    beforeUnmount() {
      window.clearTimeout(this.undoTimer);

      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
    },

    methods: {
      createId(): string {
        return Math.random().toString(36).substring(2, 11);
      },

      sanitizeText(value: string): string {
        return value.replace(/�/g, '');
      },

      focusField(event: Event) {
        const el = event.currentTarget as HTMLElement | null;
        const input = el?.previousElementSibling as HTMLInputElement | null;

        if (input && input.tagName === 'INPUT') {
          input.focus();
          input.select?.();
        }
      },

      columnGpaLabel(group: Group): string {
        switch (group.type) {
          case 'summer':
            return 'Session GPA';
          case 'custom':
            return 'Group GPA';
          case 'ungrouped':
            return 'Ungrouped GPA';
          default:
            return 'Semester GPA';
        }
      },

      groupGpaLabel(group: Group): string {
        return group.type === 'summer' ? 'Summer GPA' : 'Year GPA';
      },

      gridRows(group: Group): number {
        const longest = Math.max(
          0,
          ...group.semesters.map((semester: Semester) => semester.courses.length),
        );

        return longest + 3;
      },

      toggleMore(course: Course) {
        if (this.openCourses[course.instanceId]) {
          delete this.openCourses[course.instanceId];
        } else {
          this.openCourses[course.instanceId] = true;
        }
      },

      watchSummary() {
        const summary = this.$refs.summary as HTMLElement | undefined;

        if (!summary || typeof IntersectionObserver === 'undefined') {
          return;
        }

        this.observer = new IntersectionObserver((entries) => {
          const entry = entries[entries.length - 1];
          this.compact = !!entry && !entry.isIntersecting
            && entry.boundingClientRect.bottom <= (entry.rootBounds?.top ?? 0);
        }, { rootMargin: '-64px 0px 0px 0px' });

        this.observer.observe(summary);
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
        return semester.courses.filter((course: Course) => !course.isPlaceholder);
      },

      realIndex(semester: Semester, course: Course): number {
        return this.realCourses(semester).findIndex(
          (c: Course) => c.instanceId === course.instanceId,
        );
      },

      isFirstReal(semester: Semester, course: Course): boolean {
        return this.realIndex(semester, course) <= 0;
      },

      isLastReal(semester: Semester, course: Course): boolean {
        const real = this.realCourses(semester);
        return real.findIndex((c: Course) => c.instanceId === course.instanceId) === real.length - 1;
      },

      findPartner(group: Group, course: Course): Course | null {
        if (!course.linkedId) {
          return null;
        }

        for (const semester of group.semesters) {
          for (const candidate of semester.courses) {
            if (
              !candidate.isPlaceholder
              && candidate.instanceId !== course.instanceId
              && candidate.linkedId === course.linkedId
            ) {
              return candidate;
            }
          }
        }

        return null;
      },

      placeholderPartner(gIdx: number, sIdx: number, cIdx: number): Course | null {
        const group = this.groups[gIdx];

        if (!group || group.semesters.length !== 2) {
          return null;
        }

        const other = group.semesters[sIdx === 0 ? 1 : 0];
        const candidate = other?.courses[cIdx];

        if (candidate && !candidate.isPlaceholder && !candidate.linkedId) {
          return candidate;
        }

        return null;
      },

      serializeGroups() {
        return this.groups.map((group: Group) => ({
          id: group.id,
          label: group.label,
          type: group.type,
          semesters: group.semesters.map((semester: Semester) => ({
            courses: this.realCourses(semester),
          })),
        }));
      },

      saveData() {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(this.serializeGroups()));
        } catch (error) {
          console.error('Failed to save GPA planner data:', error);
        }
      },

      parseGroups(parsed: unknown): Group[] {
        if (!Array.isArray(parsed)) {
          throw new Error('Saved data is not an array');
        }

        return parsed.map((rawGroup: any) => {
          const type: GroupType = GROUP_TYPES.includes(rawGroup.type)
            ? rawGroup.type
            : rawGroup.isSummer
              ? 'summer'
              : 'year';

          const columnCount = type === 'year' || type === 'summer' ? 2 : 1;

          const semesters: Semester[] = Array.isArray(rawGroup.semesters)
            ? rawGroup.semesters.slice(0, columnCount).map((rawSemester: any) => ({
              courses: Array.isArray(rawSemester?.courses)
                ? rawSemester.courses
                  .filter((rawCourse: any) => rawCourse && !rawCourse.isPlaceholder)
                  .map((rawCourse: any) => {
                    const restored = this.createCourse(
                      typeof rawCourse.name === 'string'
                        ? this.sanitizeText(rawCourse.name)
                        : '',
                      typeof rawCourse.linkedId === 'string'
                        ? rawCourse.linkedId
                        : null,
                    );

                    restored.instanceId = typeof rawCourse.instanceId === 'string'
                      ? rawCourse.instanceId
                      : this.createId();

                    restored.syncEnabled = typeof rawCourse.syncEnabled === 'boolean'
                      ? rawCourse.syncEnabled
                      : !!restored.linkedId;

                    restored.grade = this.normalizeGrade(rawCourse.grade);
                    restored.level = this.normalizeLevel(rawCourse.level);

                    restored.weight = rawCourse.weight === 1.5 || rawCourse.weight === 1.0
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

          const fallbackLabel = type === 'summer'
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
      },

      loadSavedData() {
        try {
          const saved = localStorage.getItem(STORAGE_KEY);

          if (!saved) {
            return;
          }

          this.groups = this.parseGroups(JSON.parse(saved));
        } catch (error) {
          console.error('Failed to load saved GPA data:', error);
          localStorage.removeItem(STORAGE_KEY);
          this.groups = [];
        }
      },

      offerUndo(message: string, snapshot: string) {
        window.clearTimeout(this.undoTimer);
        this.undoState = { message, snapshot };
        this.undoTimer = window.setTimeout(() => {
          this.undoState = null;
        }, UNDO_TIMEOUT_MS);
      },

      undo() {
        const state = this.undoState;

        window.clearTimeout(this.undoTimer);
        this.undoState = null;

        if (!state) {
          return;
        }

        try {
          this.groups = this.parseGroups(JSON.parse(state.snapshot));
        } catch (error) {
          console.error('Failed to undo:', error);
          return;
        }

        this.ensureUngrouped();
        this.refresh();
      },

      normalizeGrade(value: unknown): number {
        if (
          typeof value === 'number'
          && Number.isInteger(value)
          && value >= 0
          && value < this.gradeLabels.length
        ) {
          return value;
        }

        if (typeof value === 'string') {
          const cleaned = value.trim().toUpperCase();
          const idx = this.gradeLabels.findIndex((grade: string) => grade === cleaned);
          return idx >= 0 ? idx : 0;
        }

        return 0;
      },

      normalizeLevel(value: unknown): number {
        if (typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 2) {
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

      ensureUngrouped() {
        const idx = this.groups.findIndex((group: Group) => group.type === 'ungrouped');

        if (idx === -1) {
          this.groups.push(this.createUngrouped());
          return;
        }

        if (idx !== this.groups.length - 1) {
          const [ungrouped] = this.groups.splice(idx, 1);
          this.groups.push(ungrouped);
        }
      },

      insertGroup(group: Group) {
        const ungroupedIdx = this.groups.findIndex((g: Group) => g.type === 'ungrouped');

        if (ungroupedIdx === -1) {
          this.groups.push(group);
        } else {
          this.groups.splice(ungroupedIdx, 0, group);
        }
      },

      addYear(label: string) {
        if (!label || this.usedYearLabels.includes(label) || !YEAR_LABELS.includes(label)) {
          return;
        }

        this.insertGroup(this.createRegularYear(label));
        this.refresh();
      },

      onAddYearSelect(event: Event) {
        const target = event.target as HTMLSelectElement | null;
        const label = target?.value ?? '';

        if (target) {
          target.value = '';
          target.blur();
        }

        this.addYear(label);
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

        const snapshot = JSON.stringify(this.serializeGroups());

        this.groups.splice(idx, 1);
        this.refresh();
        this.offerUndo(`Removed ${group.label || 'group'}`, snapshot);
      },

      addCourse(gIdx: number, sIdx: number) {
        const semester = this.groups[gIdx]?.semesters[sIdx];

        if (!semester) {
          return;
        }

        const newCourse = this.createCourse(
          `Course ${this.realCourses(semester).length + 1}`,
        );

        const placeholderIdx = semester.courses.findIndex((c: Course) => c.isPlaceholder);

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
          this.createCourse(`Course ${this.realCourses(semester).length + 1}`),
        );

        this.refresh();
      },

      addLinkedFromPlaceholder(gIdx: number, sIdx: number, cIdx: number) {
        const partner = this.placeholderPartner(gIdx, sIdx, cIdx);

        if (!partner) {
          return;
        }

        const otherSIdx = sIdx === 0 ? 1 : 0;
        this.addLinkedClass(gIdx, otherSIdx, partner);
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
          this.realCourses(second).length,
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
          otherReal.length,
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

        const index = semester.courses.findIndex(
          (c: Course) => c.instanceId === course.instanceId,
        );

        if (index === -1) {
          return;
        }

        const snapshot = JSON.stringify(this.serializeGroups());

        const partner = this.findPartner(group, course);

        if (partner) {
          partner.linkedId = null;
          partner.syncEnabled = false;
        }

        semester.courses.splice(index, 1);
        delete this.openCourses[course.instanceId];
        this.refresh();
        this.offerUndo(`Removed ${course.name || 'course'}`, snapshot);
      },

      moveCourse(gIdx: number, sIdx: number, course: Course, direction: number) {
        const group = this.groups[gIdx];
        const semester = group?.semesters[sIdx];

        if (!group || !semester) {
          return;
        }

        const real = this.realCourses(semester);
        const idx = real.findIndex((c: Course) => c.instanceId === course.instanceId);
        const targetIdx = idx + direction;

        if (idx === -1 || targetIdx < 0 || targetIdx >= real.length) {
          return;
        }

        [real[idx], real[targetIdx]] = [real[targetIdx], real[idx]];
        semester.courses = real;

        if (course.linkedId && group.semesters.length === 2) {
          const otherSemester = group.semesters[sIdx === 0 ? 1 : 0];
          const otherReal = this.realCourses(otherSemester);
          const partnerIdx = otherReal.findIndex(
            (c: Course) => c.linkedId === course.linkedId,
          );
          const partnerTarget = partnerIdx + direction;

          if (
            partnerIdx !== -1
            && partnerTarget >= 0
            && partnerTarget < otherReal.length
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

        this.groups.forEach((group: Group, gi: number) => {
          group.semesters.forEach((semester: Semester, si: number) => {
            if (gi === gIdx && si === sIdx) {
              return;
            }

            let { label } = group;

            if (group.semesters.length === 2) {
              label
                += group.type === 'summer'
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

        const index = semester.courses.findIndex(
          (c: Course) => c.instanceId === course.instanceId,
        );

        if (index === -1) {
          return;
        }

        const partner = this.findPartner(group, course);

        if (partner) {
          partner.linkedId = null;
          partner.syncEnabled = false;
        }

        course.linkedId = null;
        course.syncEnabled = false;

        semester.courses.splice(index, 1);

        const destSemester = this.groups[destination.gIdx].semesters[destination.sIdx];
        const placeholderIdx = destSemester.courses.findIndex((c: Course) => c.isPlaceholder);

        if (placeholderIdx !== -1) {
          destSemester.courses.splice(placeholderIdx, 1, course);
        } else {
          destSemester.courses.push(course);
        }

        this.refresh();
      },

      syncLinkedCourses(source: Course) {
        if (!source.linkedId || !source.syncEnabled) {
          return;
        }

        this.groups.forEach((group: Group) => {
          group.semesters.forEach((semester: Semester) => {
            semester.courses.forEach((course: Course) => {
              if (
                !course.isPlaceholder
                && course.instanceId !== source.instanceId
                && course.linkedId === source.linkedId
                && course.syncEnabled
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

      normalizeGroup(group: Group) {
        group.semesters.forEach((semester: Semester) => {
          semester.courses = this.realCourses(semester);
        });

        if (group.semesters.length !== 2) {
          group.semesters.forEach((semester: Semester) => {
            semester.courses.forEach((course: Course) => {
              course.linkedId = null;
              course.syncEnabled = false;
            });
          });
          return;
        }

        const [semA, semB] = group.semesters;
        const all = [...semA.courses, ...semB.courses];

        const linkCounts = new Map<string, number>();

        all.forEach((course: Course) => {
          if (course.linkedId) {
            linkCounts.set(course.linkedId, (linkCounts.get(course.linkedId) ?? 0) + 1);
          }
        });

        all.forEach((course: Course) => {
          if (course.linkedId && linkCounts.get(course.linkedId) !== 2) {
            course.linkedId = null;
            course.syncEnabled = false;
          }
        });

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
              resultA.push(courseA);
              resultB.push(courseB);
              i += 1;
              j += 1;
            } else if (!courseA.linkedId && !courseB.linkedId) {
              resultA.push(courseA);
              resultB.push(courseB);
              i += 1;
              j += 1;
            } else if (!courseA.linkedId) {
              resultA.push(courseA);
              resultB.push(this.createPlaceholder());
              i += 1;
            } else if (!courseB.linkedId) {
              resultA.push(this.createPlaceholder());
              resultB.push(courseB);
              j += 1;
            } else {
              resultA.push(courseA);
              resultB.push(this.createPlaceholder());
              i += 1;
            }
          } else if (courseA) {
            resultA.push(courseA);
            i += 1;
          } else if (courseB) {
            resultB.push(courseB);
            j += 1;
          }
        }

        while (resultA.length < resultB.length) {
          resultA.push(this.createPlaceholder());
        }

        while (resultB.length < resultA.length) {
          resultB.push(this.createPlaceholder());
        }

        semA.courses = resultA;
        semB.courses = resultB;
      },

      refresh() {
        this.groups.forEach((group: Group) => this.normalizeGroup(group));
        this.ensureUngrouped();
        this.calculateAll();
        this.saveData();
      },

      calculateAll() {
        let totalUWPoints = 0;
        let totalWPoints = 0;
        let totalUnits = 0;

        this.groups.forEach((group: Group) => {
          let groupUWPoints = 0;
          let groupWPoints = 0;
          let groupUnits = 0;

          group.semesters.forEach((semester: Semester) => {
            let semUWPoints = 0;
            let semWPoints = 0;
            let semUnits = 0;

            semester.courses.forEach((course: Course) => {
              if (course.isPlaceholder) {
                return;
              }

              course.name = this.sanitizeText(course.name);

              const grade = this.gradeLabels[this.normalizeGrade(course.grade)] ?? 'A';
              const normalizedLevel = this.normalizeLevel(course.level);

              course.grade = this.normalizeGrade(course.grade);
              course.level = normalizedLevel;
              course.finalGrade = grade;

              if (grade === PASS_GRADE) {
                course.unweightedGPA = 0;
                course.weightedGPA = 0;
                return;
              }

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

              if (normalizedLevel === 1) {
                bump = 0.5;
              } else if (normalizedLevel === 2) {
                bump = 1.0;
              }

              course.unweightedGPA = grade === 'F' ? 0 : base;
              course.weightedGPA = grade === 'F' ? 0 : base + bump;

              semUWPoints += course.unweightedGPA * course.weight;
              semWPoints += course.weightedGPA * course.weight;
              semUnits += course.weight;
            });

            semester.stats = semUnits > 0
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

          group.stats = groupUnits > 0
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

<style scoped>
  .gpa-page {
    --line: rgba(127, 127, 127, 0.24);
    --soft: rgba(127, 127, 127, 0.1);
    --on-accent: var(--iconCardsRegular, #fff);
    --muted: var(--tertiary);
    padding: 0 12px 96px;
  }

  @supports (color: color-mix(in srgb, red 10%, blue)) {
    .gpa-page {
      --line: color-mix(in srgb, var(--primary) 14%, transparent);
      --soft: color-mix(in srgb, var(--primary) 6%, transparent);
    }
  }

  .gpa-page button,
  .gpa-page input,
  .gpa-page select {
    font-family: inherit;
  }

  .gpa-page button {
    -webkit-tap-highlight-color: transparent;
  }

    .gpa-page button:focus-visible,
    .gpa-page select:focus-visible,
    .gpa-page input[type='checkbox']:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }

  .summary {
    box-sizing: border-box;
    max-width: 985px;
    margin: 0 auto 14px;
    padding: 18px 12px 16px;
    display: flex;
    align-items: stretch;
    justify-content: center;
    background: var(--secondaryBackground);
    border: 1px solid var(--line);
    border-radius: 18px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), 0 6px 18px -10px rgba(0, 0, 0, 0.25);
  }

  .stat {
    flex: 1 1 0;
    min-width: 0;
    max-width: 240px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 0 8px;
  }

    .stat + .stat {
      border-left: 1px solid var(--line);
    }

  .stat-label {
    font-size: 0.8em;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--muted);
    white-space: nowrap;
  }

  .stat-value {
    font-size: 3.1em;
    font-weight: 600;
    line-height: 1.1;
    color: var(--primary);
    font-variant-numeric: tabular-nums;
  }

  .summary.compact {
    position: fixed;
    top: 8px;
    left: 50%;
    z-index: 40;
    width: min(560px, calc(100% - 24px));
    max-width: none;
    margin: 0;
    padding: 8px 10px;
    border-radius: 999px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08), 0 12px 28px -12px rgba(0, 0, 0, 0.45);
    transform: translateX(-50%);
  }

  .summary-pill-enter-active,
  .summary-pill-leave-active {
    transition: opacity 0.18s ease, transform 0.18s ease;
  }

  .summary-pill-enter-from,
  .summary-pill-leave-to {
    opacity: 0;
    transform: translate(-50%, -10px);
  }

  .summary.compact .stat {
    flex-direction: row;
    align-items: baseline;
    justify-content: center;
    gap: 8px;
  }

  .summary.compact .stat-label {
    font-size: 0.68em;
  }

  .summary.compact .stat-value {
    font-size: 1.35em;
  }

  .toolbar {
    max-width: 985px;
    margin: 0 auto 18px;
  }

  .toolbar-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .select-wrap {
    position: relative;
    display: inline-flex;
    align-items: stretch;
  }

  .select-chevron {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    font-size: 0.7em;
    color: var(--accent);
  }

  .add-select,
  .group-select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    box-sizing: border-box;
    border: 1.5px solid var(--accent);
    border-radius: 999px;
    background: var(--secondaryBackground);
    color: var(--accent);
    font-weight: 700;
    cursor: pointer;
    outline: none;
    transition: background-color 0.15s ease, opacity 0.15s ease;
  }

  .add-select {
    height: 40px;
    font-size: 0.92em;
    padding: 0 36px 0 16px;
  }

    .add-select:hover:not(:disabled),
    .group-select:hover {
      background: var(--soft);
    }

    .add-select:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    .add-select option,
    .group-select option {
      color: var(--primary);
      background: var(--secondaryBackground);
      font-weight: 400;
    }

  .custom-group {
    display: inline-flex;
    align-items: stretch;
    height: 40px;
    box-sizing: border-box;
    border: 1.5px solid var(--accent);
    border-radius: 999px;
    background: var(--secondaryBackground);
    overflow: hidden;
  }

    .custom-group:focus-within {
      box-shadow: 0 0 0 3px var(--soft);
    }

  .custom-group-input {
    border: none;
    outline: none;
    background: transparent;
    color: var(--primary);
    font-size: 0.92em;
    padding: 0 6px 0 16px;
    min-width: 0;
    width: 180px;
  }

    .custom-group-input::placeholder {
      color: var(--muted);
      opacity: 0.75;
    }

  .custom-group-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: none;
    background: var(--accent);
    color: var(--on-accent);
    font-size: 0.88em;
    font-weight: 700;
    padding: 0 16px 0 13px;
    cursor: pointer;
    white-space: nowrap;
    transition: opacity 0.15s ease;
  }

    .custom-group-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

  .edit-note {
    max-width: 760px;
    margin: 12px auto 0;
    padding: 0 32px;
    text-align: center;
    font-size: 0.85em;
    line-height: 1.5;
    color: var(--muted);
  }

  .empty-state {
    max-width: 985px;
    box-sizing: border-box;
    margin: 0 auto 22px;
    padding: 26px 16px;
    text-align: center;
    border: 1.5px dashed var(--line);
    border-radius: 18px;
  }

  .empty-title {
    font-size: 1.1em;
    font-weight: 700;
    color: var(--primary);
    margin-bottom: 14px;
  }

  .empty-chips {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
  }

  .empty-chip {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    height: 38px;
    padding: 0 16px;
    border: none;
    border-radius: 999px;
    background: var(--accent);
    color: var(--on-accent);
    font-size: 0.9em;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.15s ease;
  }

    .empty-chip:hover {
      transform: translateY(-1px);
    }

  .planner {
    width: 100%;
    max-width: 1050px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .animated-fade-up {
    animation: gpaFadeUp 0.4s ease backwards;
  }

  @keyframes gpaFadeUp {
    from {
      opacity: 0;
      transform: translateY(14px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .group {
    --group-color: var(--accent);
    box-sizing: border-box;
    background: var(--secondaryBackground);
    border: 1px solid var(--line);
    border-radius: 18px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 8px 22px -16px rgba(0, 0, 0, 0.3);
    border-top: 4px solid var(--group-color);
    min-width: 0;
  }

    .group.type-summer {
      --group-color: #f39c12;
    }

    .group.type-custom {
      --group-color: #6c5ce7;
    }

    .group.type-ungrouped {
      --group-color: #7f8c8d;
    }

  .group-head {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 12px 10px 18px;
    min-height: 34px;
  }

  .group-dot {
    flex: none;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--group-color);
  }

  .group-name {
    margin: 0;
    font-size: 1.3em;
    font-weight: 700;
    line-height: 1.2;
    color: var(--primary);
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .group-name-wrap {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }

  .group-name-input {
    box-sizing: border-box;
    min-width: 0;
    max-width: 100%;
    border: none;
    border-bottom: 1.5px dashed var(--line);
    outline: none;
    background: transparent;
    color: var(--primary);
    font-size: 1.3em;
    font-weight: 700;
    line-height: 1.2;
    padding: 1px 2px;
    border-radius: 0;
  }

    .group-name-input:focus {
      border-bottom-color: var(--group-color);
      border-bottom-style: solid;
    }

  .group-stats {
    margin-left: auto;
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: flex-end;
    gap: 2px 12px;
    font-size: 0.86em;
    color: var(--muted);
    font-variant-numeric: tabular-nums;
  }

  .group-stats-label {
    font-size: 0.82em;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--group-color);
  }

  .gpa-stat {
    display: inline-block;
    white-space: nowrap;
  }

    .gpa-stat b {
      color: var(--primary);
      font-weight: 700;
    }

  .group-close {
    flex: none;
  }

  .group-head > .group-name + .group-close,
  .group-head > .group-name-wrap + .group-close {
    margin-left: auto;
  }

  .sem-grid {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-template-rows: repeat(var(--rows, 3), auto);
    column-gap: 18px;
    row-gap: 8px;
    padding: 2px 14px 14px;
  }

    .sem-grid.single-col {
      grid-auto-flow: row;
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: none;
    }

  .sem-head {
    align-self: end;
    padding: 2px 4px 2px;
    font-size: 0.78em;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .course {
    box-sizing: border-box;
    min-width: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto auto auto;
    grid-template-areas:
      'name points more close'
      'controls controls controls controls'
      'drawer drawer drawer drawer';
    align-items: center;
    align-content: start;
    column-gap: 4px;
    row-gap: 8px;
    padding: 9px 8px 10px 12px;
    background: var(--background);
    border: 1px solid var(--line);
    border-radius: 13px;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }

    .course:hover,
    .course:focus-within,
    .course.open {
      border-color: var(--group-color);
    }

    .course:focus-within {
      box-shadow: 0 0 0 3px var(--soft);
    }

  .name-wrap {
    grid-area: name;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .linked-icon {
    flex: none;
    font-size: 0.78em;
    color: var(--accent);
  }

    .linked-icon.unsynced {
      color: var(--muted);
      opacity: 0.7;
    }

  .name-input {
    flex: 1 1 auto;
    min-width: 0;
    width: 100%;
    box-sizing: border-box;
    border: none;
    border-bottom: 1.5px solid transparent;
    outline: none;
    background: transparent;
    color: var(--primary);
    font-size: 1em;
    font-weight: 600;
    line-height: 1.3;
    padding: 2px 0;
    text-overflow: ellipsis;
  }

    .name-input::placeholder {
      color: var(--muted);
      opacity: 0.7;
      font-weight: 400;
    }

    .name-input:hover {
      border-bottom-color: var(--line);
    }

    .name-input:focus {
      border-bottom-color: var(--accent);
    }

  .edit-pencil {
    flex: none;
    font-size: 0.68em;
    color: var(--muted);
    opacity: 0.45;
    cursor: pointer;
    transition: opacity 0.15s ease;
  }

    .edit-pencil:hover {
      opacity: 0.95;
    }

  .points {
    grid-area: points;
    padding: 0 4px 0 6px;
    font-size: 0.78em;
    color: var(--muted);
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

    .points b {
      color: var(--primary);
      font-weight: 700;
    }

  .points-sep {
    margin: 0 4px 0 5px;
    opacity: 0.6;
  }

  .icon-btn {
    flex: none;
    box-sizing: border-box;
    width: 30px;
    height: 30px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: var(--muted);
    font-size: 0.95em;
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease, opacity 0.15s ease;
  }

    .icon-btn:hover:not(:disabled) {
      background: var(--soft);
      color: var(--primary);
    }

    .icon-btn:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }

    .icon-btn.outlined {
      border: 1px solid var(--accent);
      color: var(--accent);
      font-size: 0.75em;
    }

      .icon-btn.outlined:hover:not(:disabled) {
        color: var(--accent);
      }

  .more-btn {
    grid-area: more;
  }

  .course.open .more-btn {
    background: var(--soft);
    color: var(--primary);
  }

  .close {
    grid-area: close;
  }

    .close:hover:not(:disabled),
    .group-close:hover:not(:disabled) {
      background: rgba(214, 48, 49, 0.12);
      color: #d63031;
    }

  .controls {
    grid-area: controls;
    min-width: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px 8px;
  }

  .seg {
    display: inline-flex;
    padding: 2px;
    border-radius: 10px;
    background: var(--soft);
  }

  .seg-btn {
    box-sizing: border-box;
    height: 28px;
    padding: 0 9px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: var(--secondary);
    font-size: 0.78em;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;
    transition: background-color 0.12s ease, color 0.12s ease;
  }

  .seg.grades .seg-btn {
    width: 29px;
    padding: 0;
    font-size: 0.85em;
    font-weight: 700;
  }

  .seg-btn:hover:not(.on) {
    background: var(--soft);
  }

  .seg-btn.on {
    background: var(--accent);
    color: var(--on-accent);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.22);
  }

  .sci-toggle {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    height: 32px;
    padding: 0 10px;
    border: 1px solid var(--line);
    border-radius: 10px;
    background: transparent;
    color: var(--muted);
    font-size: 0.78em;
    font-weight: 700;
    white-space: nowrap;
    cursor: pointer;
    transition: background-color 0.12s ease, color 0.12s ease, border-color 0.12s ease;
  }

    .sci-toggle:hover:not(.on) {
      background: var(--soft);
    }

    .sci-toggle.on {
      background: var(--accent);
      border-color: var(--accent);
      color: var(--on-accent);
    }

  .more {
    grid-area: drawer;
    min-width: 0;
    padding-top: 9px;
    border-top: 1px dashed var(--line);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .sync-row {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 0.82em;
    color: var(--secondary);
    cursor: pointer;
    width: fit-content;
  }

    .sync-row input {
      width: 15px;
      height: 15px;
      margin: 0;
      accent-color: var(--accent);
      cursor: pointer;
    }

  .more-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }

  .group-select-wrap {
    flex: 1 1 140px;
    min-width: 0;
  }

  .group-select {
    width: 100%;
    min-width: 0;
    height: 30px;
    border-width: 1px;
    padding: 0 30px 0 12px;
    font-size: 0.78em;
  }

  .pill-btn {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 30px;
    padding: 4px 13px;
    border: 1px solid var(--accent);
    border-radius: 999px;
    background: var(--secondaryBackground);
    color: var(--accent);
    font-size: 0.78em;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.15s ease;
  }

    .pill-btn:hover {
      background: var(--soft);
    }

  .slot {
    box-sizing: border-box;
    min-width: 0;
    min-height: 84px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 12px;
    border: 1.5px dashed var(--line);
    border-radius: 13px;
    color: var(--muted);
  }

  .slot-text {
    font-size: 0.7em;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    opacity: 0.75;
  }

  .slot-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .slot .pill-btn {
    background: transparent;
    text-align: center;
  }

  .sem-gpa-row {
    box-sizing: border-box;
    min-width: 0;
    margin-top: 2px;
    padding: 8px 12px;
    border-radius: 11px;
    background: var(--soft);
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 2px 12px;
    font-size: 0.86em;
    line-height: 1.45;
    color: var(--secondary);
    font-variant-numeric: tabular-nums;
  }

    .sem-gpa-row.empty {
      padding: 0;
      margin: 0;
      background: none;
    }

  .sem-gpa-label {
    font-size: 0.8em;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--group-color);
    white-space: nowrap;
  }

  .sem-gpa-stats {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 2px 12px;
  }

  .footer-actions {
    min-width: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .add-btn {
    flex: 1 1 130px;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    min-height: 36px;
    padding: 6px 10px;
    border: 1.5px dashed var(--line);
    border-radius: 11px;
    background: transparent;
    color: var(--accent);
    font-size: 0.84em;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.15s ease, border-color 0.15s ease;
  }

    .add-btn:hover {
      background: var(--soft);
      border-color: var(--accent);
      border-style: solid;
    }

  .undo-toast {
    position: fixed;
    left: 50%;
    bottom: 22px;
    transform: translateX(-50%);
    z-index: 80;
    box-sizing: border-box;
    max-width: calc(100vw - 24px);
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 9px 9px 9px 18px;
    border-radius: 999px;
    background: var(--primary);
    color: var(--background);
    font-size: 0.9em;
    box-shadow: 0 10px 30px -8px rgba(0, 0, 0, 0.5);
  }

  .undo-text {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .undo-btn {
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 32px;
    padding: 0 14px;
    border: none;
    border-radius: 999px;
    background: var(--background);
    color: var(--primary);
    font-size: 0.92em;
    font-weight: 700;
    cursor: pointer;
  }

  .toast-enter-active,
  .toast-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  .toast-enter-from,
  .toast-leave-to {
    opacity: 0;
    transform: translate(-50%, 12px);
  }

  @media (max-width: 767.9px) {
    .gpa-page {
      padding: 0 8px 96px;
    }

      .gpa-page :deep(.plain-header .title) {
        display: block;
        margin: 0;
        padding: 22px 52px 12px;
        font-size: 2.2em;
        line-height: 1.2;
      }

    .summary {
      padding: 14px 6px 12px;
    }

    .stat-value {
      font-size: 2.3em;
    }

    .stat-label {
      font-size: 0.7em;
    }

    .summary.compact {
      padding: 7px 6px;
    }

      .summary.compact .stat {
        flex-direction: column;
        align-items: center;
        gap: 0;
      }

      .summary.compact .stat-label {
        font-size: 0.6em;
      }

      .summary.compact .stat-value {
        font-size: 1.15em;
      }

    .toolbar-row .select-wrap {
      flex: 1 1 150px;
    }

    .add-select {
      width: 100%;
    }

    .custom-group {
      flex: 1 1 100%;
    }

    .custom-group-input {
      flex: 1 1 auto;
      width: auto;
    }

    .edit-note {
      padding: 0 16px;
    }

    .group-head {
      flex-wrap: wrap;
      padding: 12px 8px 8px 14px;
    }

    .group-name,
    .group-name-wrap {
      flex: 1 1 0;
    }

    .group-stats {
      order: 3;
      flex: 1 1 100%;
      margin-left: 20px;
      justify-content: flex-start;
    }

    .group-head > .group-close {
      margin-left: auto;
    }

    .sem-grid,
    .sem-grid.single-col {
      grid-auto-flow: row;
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: none;
      padding: 2px 8px 10px;
    }

    .slot {
      display: none;
    }

    .sem-head {
      margin-top: 6px;
    }

    .sem-gpa-row.empty {
      display: none;
    }

    .footer-actions {
      margin-bottom: 6px;
    }
  }

  @media (max-width: 519.9px) {
    .course {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 6px;
      padding: 9px 6px 10px 10px;
    }

    .name-wrap {
      order: 1;
      flex: 1 1 calc(100% - 80px);
    }

    .more-btn {
      order: 2;
    }

    .close {
      order: 3;
    }

    .controls {
      display: contents;
    }

      .controls > .seg:first-child {
        order: 4;
      }

        .controls > .seg:first-child .seg-btn {
          padding: 0 7px;
        }

    .points {
      order: 5;
      margin-left: auto;
      padding: 0 2px 0 0;
      font-size: 0.74em;
    }

    .points-sep {
      margin: 0 2px 0 3px;
    }

    .controls > .seg.grades,
    .controls > .sci-toggle {
      order: 6;
    }

    .more {
      order: 7;
      flex: 1 1 100%;
    }

    .add-select {
      font-size: 0.85em;
      padding: 0 30px 0 13px;
    }

    .select-chevron {
      right: 12px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .animated-fade-up {
      animation: none;
    }

    .summary-pill-enter-active,
    .summary-pill-leave-active {
      transition: none;
    }
  }
</style>
