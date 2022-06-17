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
              {{averageWeightedGpa.toFixed(2)}}
              </h1>
            </div>
          </div>
          <rounded-button
            class="add-course-button"
            :icon="icons.faPlus"
            text="Add Course"
            invert
            @click="addCourse()"
          />
          <div style="padding: 12px 0px;">Note: Each semester counts as a different course<br>Course names are editable</div>
        </div>
      </card>
    </div>
    <card-container class="gpa-card-container">
      <card class="gpa-card" :wrapperStyle="{ overflow: 'visible' }" v-for="(course, courseIndex) in courses" :key="courseIndex" :style="{ 'animation-delay': reduceFadeUpAnimation ? 0 : (courseIndex*.035) + 's'}">
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
  </div>
</template>
<script lang="ts">
import RoundedButton from '@/components/RoundedButton.vue';
import { faXmark, faPlus } from '@fortawesome/free-solid-svg-icons';
import { defineComponent } from 'vue';
import Card from '@/components/Card.vue';
import PlainHeader from '@/components/PlainHeader.vue';
import CardContainer from '@/components/CardContainer.vue';
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
  }
}

export default defineComponent({
  components: {
    RoundedButton, Card, PlainHeader, CardContainer, Dropdown, Checkbox,
  },
  data() {
    return {
      icons: { faPlus, faXmark },
      courses: [new Course(1)] as Course[],
      averageUnweightedGpa: 4.0 as number,
      averageWeightedGpa: 4.0 as number,
      courseLevels: ['Regular', 'Accelerated', 'Honors/AP'] as string[],
      gradeLabels: ['A', 'B', 'C', 'D', 'F'] as string[],
      terms: ['1st', '2nd', '3rd', 'Final'] as string[],
      reduceFadeUpAnimation: false as boolean,
    };
  },
  watch: {
    courses: {
      handler() {
        localStorage.setItem('EBRCourses', JSON.stringify(this.courses));
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
  },

  methods: {
    editCourseName(course:Course, inputValue: string): void {
      course.name = inputValue;
    },
    addCourse(): void {
      this.reduceFadeUpAnimation = true;
      this.courses.push(new Course(this.courses.length + 1));
      this.calculateSemesterGrades();
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
  },
});
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'
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
      background-color: var(--color)
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
      color: var(--color)
      font-size: 2em
      text-align: center
</style>
