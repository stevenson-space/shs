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
          <card-container class="top-card-container">
            <card class="setter-card" :wrapperStyle="{ overflow: 'visible' }">
              <div class="setter-tile">
                <input
                  class="setter-name"
                  maxlength="20"
                  type="text"
                  :value="setterCourse.name"
                  @input="editCourseName(setterCourse,$event.target.value)"
                >
              </div>
              <div class="setter-course-settings-row">
                <dropdown
                  style="flex:1;"
                  :options="['Regular','Accelerated','Honors/AP']"
                  :modelValue="setterCourse.level"
                  align="left"
                  @update:modelValue="selectedSetterCourseLevel($event)"
                />
                  <dropdown
                    style="flex:1;"
                    :direction="setterCourse.direction"
                    class="setter-grade-selector"
                    :options="gradeLabels"
                    :modelValue="setterCourse.grade"
                    align="left"
                    @update:modelValue="selectSetterCourseGrade($event)"
                  />
                </div>
              <div class="set-group">
                <dropdown
                  style="flex:1;"
                  :options="courseGroupNames"
                  :modelValue="courseGroupNames.indexOf(setterCourse.group)"
                  align="left"
                  @update:modelValue="selectSetterCourseGroup($event)"
                />
              </div>
              <p class="setter-grade-label">{{ setterCourse.finalGrade }}</p>
                <div class="gpa-title-row">
                  <div class="gpa-col">
                    <p class="setter-weight-title"><b>Un</b>weighted</p>
                    <div class="setter-final-gpa">{{ setterCourse.unweightedGPA.toFixed(2) }}</div>
                  </div>
                  <div class="gpa-col">
                    <p class="setter-weight-title">Weighted</p>
                    <div class="setter-final-gpa">{{ setterCourse.weightedGPA.toFixed(2) }}</div>
                  </div>
                </div>
                <checkbox :modelValue="setterCourse.weight == 1.5" @update:modelValue="toggleExtraWeight(setterCourse, $event)">1.5 Weight Science Class</checkbox>
              <br>
            </card>
          </card-container>
          <rounded-button
            class="add-course-button"
            :icon="icons.faPlus"
            text="Add Course"
            invert
            @click="addCourse()"
          />
          <rounded-button
            class="course-group-button"
            :icon="icons.faPlus"
            text="Add Course Group"
            invert
            @click="addCourseGroup()"
          />
          <rounded-button
            class="add-course-button"
            :icon="icons.faXmark"
            text="Clear All"
            invert
            @click="removeAllCourses()"
          />
          <div style="padding: 12px 0px;">Note: Each semester counts as a different course<br>Course names are editable</div>
        </div>
      </card>
    </div>
    <collapsible-section class="course-groups" v-model="expandedGroups[groupIndex]" :title="courseGroupNames[groupIndex]" v-for="(group, groupIndex) in courseGroups" :key="groupIndex" :wrapperStyle="{ overflow: 'visible' }" editableTitle @update:title="editCourseGroupName(groupIndex, $event)">
      <font-awesome-icon
        @click="removeCourseGroup(groupIndex)"
        class="close-group"
        size="1x"
        :icon="icons.faXmark"
      />
      <card-container class="gpa-card-container">
        <card class="gpa-card" :wrapperStyle="{ overflow: 'visible' }" v-for="(course, courseIndex) in group" :key="courseIndex" :style="{ 'animation-delay': reduceFadeUpAnimation ? 0 : (courseIndex * .045 + .1) + 's'}">
          <div class="gpa-tile">
            <input
              class="name"
              maxlength="20"
              type="text"
              :value="course.name"
              :placeholder="'Course '+ (course.id)"
              @input="editCourseName(course,$event.target.value)"
            >
            <font-awesome-icon
              v-show="courses.length > 1"
              @click="removeCourse(course)"
              class="close"
              size="1x"
              :icon="icons.faXmark"
            />
          </div>
          <div class="course-settings-row">
            <dropdown
              style="flex:1;"
              :options="['Regular','Accelerated','Honors/AP']"
              :modelValue="course.level"
              align="left"
              @update:modelValue="selectedCourseLevel(course,$event)"
            />
              <dropdown
                style="flex:1;"
                :direction="course.direction"
                class="grade-selector"
                :options="gradeLabels"
                :modelValue="course.grade"
                align="left"
                @update:modelValue="selectGrade(course,$event)"
              />
            </div>
          <div class="set-group">
                <dropdown
                  style="flex:1;"
                  :options="courseGroupNames"
                  :modelValue="courseGroupNames.indexOf(course.group)"
                  align="left"
                  @update:modelValue="selectCourseGroup(course, $event)"
                />
              </div>
          <p class="grade-label">{{course.finalGrade}}</p>
            <div class="gpa-title-row">
              <div class="gpa-col">
                <p class="weight-title"><b>Un</b>weighted</p>
                <div class="final-gpa">{{course.unweightedGPA.toFixed(2)}}</div>
              </div>
              <div class="gpa-col">
                <p class="weight-title">Weighted</p>
                <div class="final-gpa">{{course.weightedGPA.toFixed(2)}}</div>
              </div>
            </div>
            <checkbox :modelValue="course.weight == 1.5" @update:modelValue="toggleExtraWeight(course, $event)">1.5 Weight Science Class</checkbox>
          <br>
        </card>
      </card-container>
    </collapsible-section>
  </div>
</template>
<script lang="ts">
import RoundedButton from '@/components/RoundedButton.vue';
import { faXmark, faPlus } from '@fortawesome/free-solid-svg-icons';
import { defineComponent } from 'vue';
import Card from '@/components/Card.vue';
import PlainHeader from '@/components/PlainHeader.vue';
import CardContainer from '@/components/CardContainer.vue';
import CollapsibleSection from '@/components/CollapsibleSection.vue';
import Dropdown from '@/components/Dropdown.vue';
import Checkbox from '@/components/Checkbox.vue';

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
  group: string;
  constructor(id: number) {
    this.id = id;
    this.grade = 0; // A
    this.level = 0;
    this.weight = 1.0;
    this.unweightedGPA = 4.0;
    this.weightedGPA = 4.0;
    this.finalGrade = 'A';
    this.hasFinal = true;
    this.name = `Course ${id}`;
    this.group = 'Course Group 1';
  }
}

export default defineComponent({
  components: {
    RoundedButton, Card, PlainHeader, CardContainer, Dropdown, Checkbox, CollapsibleSection
  },
  data() {
    const firstCourse = new Course(1);
    return {
      icons: { faPlus, faXmark },
      courses: [firstCourse] as Course[],
      courseGroups: [[firstCourse]] as Course[][],
      courseGroupNames: ['Course Group 1'] as string[],
      setterCourse: new Course(0) as Course,
      averageUnweightedGpa: 4.0 as number,
      averageWeightedGpa: 4.0 as number,
      courseLevels: ['Regular', 'Accelerated', 'Honors/AP'] as string[],
      gradeLabels: ['A', 'B', 'C', 'D', 'F'] as string[],
      terms: ['1st', '2nd', '3rd', 'Final'] as string[],
      reduceFadeUpAnimation: false as boolean,
      expandedGroups: [true] as boolean[],
      ready: false as boolean,
    };
  },
  watch: {
    courses: {
      handler() {
        localStorage.setItem('EBRCourses', JSON.stringify(this.courses));
      },
      deep: true,
    },
    courseGroupNames: {
      handler() {
        localStorage.setItem('CourseGroupNames', JSON.stringify(this.courseGroupNames));
      },
      deep: true,
    },
    expandedGroups: {
      handler() {
        localStorage.setItem('ExpandedGroups', JSON.stringify(this.expandedGroups));
      },
      deep: true,
    },
  },
  mounted() {
    const courses: string | null = localStorage.getItem('EBRCourses');
    if (courses) {
      this.courses = JSON.parse(courses);
      this.calculateSemesterGrades();
    }
    const courseGroupNames: string | null = localStorage.getItem('CourseGroupNames');
    if (courseGroupNames) {
      this.courseGroupNames = JSON.parse(courseGroupNames);
      this.courseGroups = this.courseGroupNames.map(groupName => this.courses.filter(course => course.group === groupName));
    }
    const expandedGroups: string | null = localStorage.getItem('ExpandedGroups');
    if (expandedGroups) {
      this.expandedGroups = JSON.parse(expandedGroups);
    }
    this.$nextTick(() => {
      window.scrollTo(0, scrollY);
    });
    this.setterCourse.name = 'Course ' + (this.courses.length + 1);
  },

  methods: {
    editCourseName(course:Course, inputValue: string): void {
      course.name = inputValue;
    },
    editCourseGroupName(groupIndex: number, inputValue: string): void {
      this.courses.forEach(course => {
        if (course.group === this.courseGroupNames[groupIndex]) {
          course.group = inputValue;
        }
      });
      this.courseGroupNames[groupIndex] = inputValue;
    },
    addCourse(): void {
      this.reduceFadeUpAnimation = true;
      const newCourse = new Course(this.courses.length + 1);
      newCourse.name = this.setterCourse.name;
      newCourse.grade = this.setterCourse.grade;
      newCourse.level = this.setterCourse.level;
      newCourse.weight = this.setterCourse.weight;
      newCourse.unweightedGPA = this.setterCourse.unweightedGPA;
      newCourse.weightedGPA = this.setterCourse.weightedGPA;
      newCourse.finalGrade = this.setterCourse.finalGrade;
      newCourse.hasFinal = this.setterCourse.hasFinal;
      newCourse.group = this.setterCourse.group;
      this.courses.push(newCourse);
      const groupIndex = this.courseGroupNames.indexOf(newCourse.group);
      if (groupIndex > -1) {
        this.courseGroups[groupIndex].push(newCourse);
      }
      this.setterCourse = new Course(this.courses.length + 1);
      this.calculateSemesterGrades();
    },
    removeCourse(course: Course): void {
      const index = this.courses.indexOf(course);
      const groupIndex = this.courseGroups.findIndex(group => group.includes(course));
      if (index > -1) {
        this.courses.splice(index, 1);
        this.courseGroups[groupIndex].splice(this.courseGroups[groupIndex].indexOf(course), 1);
        this.calculateSemesterGrades();
      }
    },
    addCourseGroup(): void {
      const newGroup: Course[] = [];
      this.courseGroups.push(newGroup);
      this.expandedGroups.push(false);
      this.courseGroupNames.push(`Course Group ${this.courseGroupNames.length + 1}`);
    },
    removeCourseGroup(groupIndex: number): void {
      const groupName = this.courseGroupNames[groupIndex];
      if (this.courseGroups.length > 1) {
        this.courseGroups.splice(groupIndex, 1);
        this.courseGroupNames.splice(groupIndex, 1);
        this.expandedGroups.splice(groupIndex, 1);
        this.courses = this.courses.filter(course => course.group !== groupName);
        this.calculateSemesterGrades();
      }
    },
    removeAllCourses(): void {
      this.courses = [new Course(1)];
      this.courseGroups = [[this.courses[0]]];
      this.courseGroupNames = ['Course Group 1'];
      this.expandedGroups = [true];
      this.calculateSemesterGrades();
    },
    selectGrade(course: Course, gradeIndex: number): void {
      const index = this.courses.indexOf(course);
      course.grade = gradeIndex;
      this.courses[index] = course;
      this.calculateSemesterGrades();
    },
    selectSetterCourseGrade (gradeIndex: number): void {
      this.setterCourse.grade = gradeIndex;
      this.calculateSetterGrades();
    },
    selectedCourseLevel(course: Course, i: number): void {
      const index = this.courses.indexOf(course);
      course.level = i;
      this.courses[index] = course;
      this.calculateSemesterGrades();
    },
    selectedSetterCourseLevel(i: number): void {
      this.setterCourse.level = i;
      this.calculateSetterGrades();
    },
    selectCourseGroup(course: Course, groupIndex: number): void {
      const currentGroupIndex = this.courseGroups.findIndex(g => g.includes(course));
      this.courseGroups[currentGroupIndex].splice(this.courseGroups[currentGroupIndex].indexOf(course), 1);
      course.group = this.courseGroupNames[groupIndex];
      this.courseGroups[currentGroupIndex] = this.courseGroups[currentGroupIndex].filter(c => c !== course);
      this.courseGroups[groupIndex] = [...this.courseGroups[groupIndex], course];
    },
    selectSetterCourseGroup(groupIndex: number): void {
      this.setterCourse.group = this.courseGroupNames[groupIndex];
    },
    toggleExtraWeight(course: Course, isChecked: boolean): void {
      const index = this.courses.indexOf(course);
      course.weight = (isChecked ? 1.5 : 1);
      this.courses[index] = course;
      this.calculateSemesterGrades();
    },
    selectHasFinal(course: Course, gradeIndex: number): void {
      const index = this.courses.indexOf(course);
      course.hasFinal = (gradeIndex === 0);
      this.courses[index] = course;
      this.calculateSemesterGrades();
    },
    calculateSemesterGrades(): void {
      let gpa = 0.0;
      for (let x = 0; x < this.courses.length; x++) { // for every course
        const course = this.courses[x];
        const grade = this.gradeLabels[course.grade];
        gpa = 4;

        if (grade.includes('A')) {
          gpa = 4;
        } else if (grade.includes('B')) {
          gpa = 3;
        } else if (grade.includes('C')) {
          gpa = 2;
        } else if (grade.includes('D')) {
          gpa = 1;
        } else {
          gpa = 0;
        }
        let unweightedGPA = gpa;
        let weightedGPA = gpa;
        weightedGPA += [0, 0.5, 1][course.level];
        course.finalGrade = grade;
        if (grade.includes('F')) {
          unweightedGPA = 0.0;
          weightedGPA = 0.0;
        }
        course.unweightedGPA = unweightedGPA;
        course.weightedGPA = weightedGPA;
        this.courses[x] = course;
      }
      let unweightedGPASum = 0.0;
      let weightedGPASum = 0.0;
      this.courses.forEach((course: Course) => {
        unweightedGPASum += (course.unweightedGPA * course.weight);
        weightedGPASum += (course.weightedGPA * course.weight);
      });

      let weightTotal = 0;
      this.courses.forEach((i: Course) => {
        weightTotal += i.weight;
      });
      this.averageUnweightedGpa = unweightedGPASum / weightTotal;
      this.averageWeightedGpa = weightedGPASum / weightTotal;
    },
    calculateSetterGrades(): void {
      let gpa = 0.0;
      const grade = this.gradeLabels[this.setterCourse.grade];
      gpa = 4;

      if (grade.includes('A')) {
        gpa = 4;
      } else if (grade.includes('B')) {
        gpa = 3;
      } else if (grade.includes('C')) {
        gpa = 2;
      } else if (grade.includes('D')) {
        gpa = 1;
      } else {
        gpa = 0;
      }
      let unweightedGPA = gpa;
      let weightedGPA = gpa;
      weightedGPA += [0, 0.5, 1][this.setterCourse.level];
      this.setterCourse.finalGrade = grade;
      if (grade.includes('F')) {
        unweightedGPA = 0.0;
        weightedGPA = 0.0;
      }
      this.setterCourse.unweightedGPA = unweightedGPA;
      this.setterCourse.weightedGPA = weightedGPA;
    }
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
    width: 130px
    margin: 2px auto
  .course-group-button
    margin: 2px auto
    width: 170px

.course-groups
  margin-top: 10px
  height: auto
  width: 985px
  justify-self: center
  border-color: var(--accent)
  &:hover
    border-color: var(--accent)

  :deep(.collapsible-header)
    background-color: var(--accent)

  :deep(.header-content)
    background-color: var(--accent)
    color: white

  :deep(.group-title)
    background-color: var(--accent)
    color: white
    border: none
    outline: none
    font-size: 1.6em
    flex: 1
    margin: 0px 12px
    padding: 8px 0px 5px 0px
    opacity: 1

  .close-group
    width: 18px
    color: var(--accent)
    top: 13px
    right: 11px
    cursor: pointer

.set-group
      margin-top: 10px
      margin: 0 5px
      display: flex
      padding: 12px 0px 0px 4px

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
      background-color: var(--accent)
      color: var(--background)
      border-top-right-radius: 10px
      border-top-left-radius: 10px

      .name
        width: 100px
        outline: none
        border: none
        text-align: center
        font-size: 1.6em
        flex: 1
        margin: 0px 12px
        padding: 8px 0px 5px 0px
        background-color: inherit
        color: white

      .close
        width: 18px
        position: absolute
        top: 13px
        right: 11px
        cursor: pointer

    .course-settings-row
      margin: 0 5px
      display: flex
      padding: 12px 0px 0px 4px

    .grade-dropdown-row
      margin: 0 5px
      display: flex
      flex-wrap: wrap
      padding-top: 15px

      .term
        text-align: center

      .grade-selector
        margin: 4px

    .grade-label
      padding: 10px 0 0 0
      margin: 0 auto
      text-align: center
      font-size: 3em

    .final-gpa
      color: var(--accent)
      font-size: 2em
      text-align: center
.top-card-container
  margin-top: 10px
  width: 34%
  margin: 0 auto

  .setter-card
    overflow: visible
    margin: 0px 0px
    background-color: white
    border-radius: 10px
    grid-column: 1 / -1
    margin: 0 auto
    +animate-fade-up

    .setter-tile
      display: flex
      background-color: var(--accent)
      color: var(--background)
      border-top-right-radius: 10px
      border-top-left-radius: 10px

      .setter-name
        width: 100px
        outline: none
        border: none
        text-align: center
        font-size: 1.6em
        flex: 1
        margin: 0px 12px
        padding: 8px 0px 5px 0px
        background-color: inherit
        color: white

    .setter-course-settings-row
      margin: 0 5px
      display: flex
      padding: 12px 0px 0px 4px

    .setter-grade-dropdown-row
      margin: 0 5px
      display: flex
      flex-wrap: wrap
      padding-top: 15px

      .setter-term
        text-align: center

      .setter-grade-selector
        margin: 4px

    .setter-grade-label
      padding: 10px 0 0 0
      margin: 0 auto
      text-align: center
      font-size: 3em

    .setter-final-gpa
      color: var(--accent)
      font-size: 2em
      text-align: center



</style>
