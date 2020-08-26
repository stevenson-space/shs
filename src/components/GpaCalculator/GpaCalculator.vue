<template>
  <div>
    <plain-header title="GPA Calculator" />
    <div>
      <card class="top-card">
        <div style="text-align:center">
          <h1 class="overall-gpa">
            {{averageGpa.toString() == "NaN" ? "0.0" : (averageGpa.toString().length == 1 ? (averageGpa+".0") : averageGpa)}}
          </h1>
          <rounded-button
            class="add-course-button"
            :icon="faPlusCircle"
            text="Add Course"
            invert
            @click="addCourse()"
          />
          <div style="padding: 12px 0px;">Note: Each semester counts as a different course</div>
        </div>
      </card>
    </div>
    <card-container class="gpa-card-container">
      <card class="gpa-card" :wrapperStyle="{ overflow: 'visible' }" v-for="(course, courseIndex) in courses" :key="courseIndex">
        <div class="gpa-tile">
          <input
            class="name"
            maxlength="20"
            type="text"
            :value="course.name"
            :placeholder="'Course '+ (course.id)"
            @input="editCourseName(course,$event)"
          >
          <font-awesome-icon
            @click="removeCourse(course)"
            class="close"
            size="1x"
            :icon="faTimes"
          />
        </div>
        <div class="course-settings-row">
          <dropdown
            v-show="true"
            style="flex:1;"
            :options="['Regular','Accelerated','Honors/AP']"
            :value="course.level"
            align="left"
            @input="selectedCourseLevel(course,$event)"
          />
          <div style="width:8px;" />
          <dropdown
            v-show="true"
            style="flex:1;"
            :options="['Has Final','No Final']"
            :value="course.hasFinal ? 0 : 1"
            align="left"
            @input="selectHasFinal(course,$event)"
          />
        </div>
        <div class="grade-dropdown-row">
          <div style="flex:1;" v-for="n in (course.hasFinal ? 4 : 3)" :key="n">
            <div>
              <div class="term">{{terms[n-1]}}</div>
              <dropdown
                v-show="true"
                :direction="course.direction"
                class="grade-selector"
                :options="gradeLabels"
                :value="course.grades[n-1]"
                align="left"
                @input="selectGrade(course,n-1,$event)"
              />
            </div>
          </div>
        </div>
        <p class="grade-label">{{course.finalGrade}}</p>
        <div class="final-gpa">{{course.gpa.toString().length == 1 ? ( course.gpa+".0") : course.gpa}}</div>
        
        <br>
      </card>
    </card-container>
  </div>
</template>
<script>
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
import RoundedButton from "src/components/common/RoundedButton.vue";

class Course {
  constructor(id) {
    this.id = id;
    this.grades = [0, 0, 0, 0];
    this.level = 0;
    this.gpa = 4.0;
    this.finalGrade = "A+";
    this.hasFinal = true;
    this.name = "Course " + id;
  }
}

import { faTimes, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import Card from "common/Card.vue";
import HomeLink from "common/HomeLink.vue";
import PlainHeader from "common/PlainHeader.vue";
import CardContainer from "common/CardContainer.vue";
import Dropdown from "common/Dropdown.vue";
export default {
  components: {RoundedButton,Card,HomeLink,PlainHeader,CardContainer,Dropdown,FontAwesomeIcon, },
  data() {
    return {
      icons: {faPlusCircle},
      courses: [new Course(0)],
      averageGpa: 4.0,
      courseLevels: ["Regular", "Accelerated", "Honors/AP"],
      gradeLabels: ["F", "D-", "D", "D+", "C-", "C", "C+", "B-", "B", "B+", "A-", "A", "A+"],
      faTimes,
      faPlusCircle,
      terms: ["1st", "2nd", "3rd", "Final"],
    };
  },
  watch: {
    courses: {
      handler() {
        localStorage.setItem("courses", JSON.stringify(this.courses));
      },
      deep: true,
    },
  },
  mounted() {
    if (localStorage.getItem("courses") != null) {
      this.courses = JSON.parse(localStorage.getItem("courses"));
      this.calculateSemesterGrades();
    }
  },
  methods: {
    editCourseName(course,event) {
      course.name = event.target.value;
    },
    addCourse() {
      this.courses.push(new Course(this.courses.length+1));
      this.calculateSemesterGrades();
    },
    removeCourse(course) {
        this.$delete(this.courses, this.courses.indexOf(course));
        this.calculateSemesterGrades();
    },
    selectGrade(course, termIndex, gradeIndex) {
      var index = this.courses.indexOf(course);
      course.grades[termIndex] = gradeIndex;
      this.$set(this.courses, index, course);
      this.calculateSemesterGrades();
    },
    selectedCourseLevel(course, i) {
      var index = this.courses.indexOf(course);
      course.level = i;
      this.$set(this.courses, index, course);
      this.calculateSemesterGrades();
    },
    selectHasFinal(course, gradeIndex) {
      var index = this.courses.indexOf(course);
      course.hasFinal = (gradeIndex == 0);
      this.$set(this.courses, index, course);
      this.calculateSemesterGrades();
    },
    calculateSemesterGrades() {
      var pointTotal = 0;
      var gpa = 0.0;

      for (var x = 0; x < this.courses.length; x++) { //for every course
        var course = this.courses[x];
        pointTotal = 0;
        gpa = 4;

        for (var y = 0; y < (course.hasFinal ? 4 : 3); y++) { //for each grades
          pointTotal += 12 - course.grades[y];
        }

        var scoresFinal=[[48,46],[45,42],[41,38],[37,34],[33,30],[29,26],[25,22],[21,18],[17,14],[13,10],[9,6],[5,3],[2,0]];
        var scoresNoFinal=[[36,35],[34,32],[31,29],[28,26],[25,23],[22,20],[19,17],[16,14],[13,11],[10,8],[7,5],[4,2],[1,0]];
        var grade = "";

        for (var z = 0; z < scoresNoFinal.length; z++) {
          if (!course.hasFinal) {
            if (
              pointTotal >= scoresNoFinal[z][1] &&
              pointTotal <= scoresNoFinal[z][0]
            ) {
              grade = this.gradeLabels[z];
            }
          } else {
            if (
              pointTotal >= scoresFinal[z][1] &&
              pointTotal <= scoresFinal[z][0]
            ) {
              grade = this.gradeLabels[z];
            }
          }
        }
        if (grade.includes("A")) {
          gpa = 4;
        } else if (grade.includes("B")) {
          gpa = 3;
        } else if (grade.includes("C")) {
          gpa = 2;
        } else if (grade.includes("D")) {
          gpa = 1;
        } else {
          gpa = 0;
        }
        gpa += course.level == 1 ? 0.5 : course.level == 2 ? 1.0 : 0;
        course.finalGrade = grade;
        if (grade.includes("F")) {
          gpa = 0.0;
        }
        course.gpa = gpa;
        this.$set(this.courses, x, course);
      }
      var gpaSum = 0.0;
      this.courses.forEach(function (course) {
        gpaSum += parseFloat(course.gpa);
      });

      var average = parseFloat(gpaSum) / parseFloat(this.courses.length);
      this.averageGpa = Number(average.toFixed(2));
    },
  },
};
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.top-card
  max-width: 972px
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

    .gpa-tile
      display: flex
      background-color: var(--color)
      color: white
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
        color: inherit
      
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
      padding: 0px 0px
      margin: 0 auto
      text-align: center
      font-size: 3em

    .final-gpa
      color: var(--color)
      font-size: 2em
      text-align: center
</style>

