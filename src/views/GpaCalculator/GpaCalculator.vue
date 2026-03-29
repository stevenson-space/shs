<template>
  <div>
    <plain-header title="GPA Calculator" />

    <card class="top-card">
      <div style="text-align:center">
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

        <div class="action-row" style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
          <rounded-button class="add-year-button"
                          :icon="icons.faPlus"
                          text="Add School Year"
                          invert
                          @click="addYear()" />

          <rounded-button class="add-summer-button"
                          :icon="icons.faPlus"
                          text="Add Summer"
                          invert
                          @click="addSummer()" />
        </div>

        <div class="edit-note">Course names are editable • Matches Infinite Campus Layout</div>
      </div>
    </card>

    <card-container class="planner-container">
      <div v-for="(year, yIdx) in years"
           :key="'year-' + yIdx"
           class="year-block animated-fade-up"
           :class="{ 'summer-theme': year.isSummer }"
           :style="{ 'animation-delay': (yIdx * 0.1) + 's' }">

        <div class="year-banner">
          <span>{{ year.label }}{{ year.isSummer ? '' : ' Year' }}</span>
          <font-awesome-icon @click="removeYear(yIdx)"
                             class="year-close"
                             :icon="icons.faXmark" />
        </div>

        <div class="semester-grid">
          <div v-for="(semester, sIdx) in year.semesters"
               :key="'sem-' + sIdx"
               class="sem-column">
            <div class="sem-header">
              {{ year.isSummer ? 'Summer Session ' + (sIdx + 1) : 'Semester ' + (sIdx + 1) }}
            </div>

            <card class="course-card"
                  v-for="(course, cIdx) in semester.courses"
                  :key="course.instanceId">
              <div class="course-header-row">
                <input class="name-input"
                       type="text"
                       :value="course.name"
                       :placeholder="'Course ' + (cIdx + 1)"
                       @input="editCourseName(course, $event.target.value)">
                <font-awesome-icon @click="removeCourse(yIdx, sIdx, course)"
                                   class="close"
                                   :icon="icons.faXmark" />
              </div>

              <div class="dropdown-row">
                <dropdown :options="courseLevels"
                          :modelValue="course.level"
                          @update:modelValue="setLvl(course, $event)" />
                <dropdown :options="gradeLabels"
                          :modelValue="course.grade"
                          @update:modelValue="setGrd(course, $event)" />
              </div>

              <p class="big-grade">{{ course.finalGrade }}</p>

              <div class="gpa-stats">
                <div class="stat-box">
                  <span class="label">UW</span>
                  <div class="num">{{ course.unweightedGPA.toFixed(2) }}</div>
                </div>
                <div class="stat-box">
                  <span class="label">W</span>
                  <div class="num">{{ course.weightedGPA.toFixed(2) }}</div>
                </div>
              </div>

              <checkbox :modelValue="course.weight == 1.5"
                        @update:modelValue="setSci(course, $event)">
                1.5 Weight Science Class
              </checkbox>
            </card>

            <div class="footer-actions">
              <button class="sketch-btn" @click="addCourse(yIdx, sIdx)">
                Add course
              </button>
              <button v-if="!year.isSummer" class="sketch-btn" @click="addFullYear(yIdx)">
                Add full year course
              </button>
            </div>
          </div>
        </div>
      </div>
    </card-container>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { faXmark, faPlus } from '@fortawesome/free-solid-svg-icons';
  import Checkbox from '@/components/Checkbox.vue';
  import RoundedButton from '@/components/RoundedButton.vue';
  import Card from '@/components/Card.vue';
  import PlainHeader from '@/components/PlainHeader.vue';
  import CardContainer from '@/components/CardContainer.vue';
  import Dropdown from '@/components/Dropdown.vue';

  class Course {
    instanceId = Math.random().toString(36).substring(7);
    name = "";
    grade = 0;
    level = 0;
    weight = 1.0;
    unweightedGPA = 4.0;
    weightedGPA = 4.0;
    finalGrade = 'A';
  }

  export default defineComponent({
    name: 'GpaCalculator',
    components: { RoundedButton, Card, PlainHeader, CardContainer, Dropdown, Checkbox },
    data() {
      return {
        icons: { faPlus, faXmark },
        years: [] as any[],
        averageUnweightedGpa: 0,
        averageWeightedGpa: 0,
        courseLevels: ['Regular', 'Accelerated', 'Honors/AP'],
        gradeLabels: ['A', 'B', 'C', 'D', 'F'],
        yearLabels: ['Freshman', 'Sophomore', 'Junior', 'Senior'],
        summerLabels: ['Pre-Freshman', 'Rising Sophomore', 'Rising Junior', 'Rising Senior']
      };
    },
    mounted() {
      const saved = localStorage.getItem('SHS_PLANNER_DATA');
      if (saved) {
        this.years = JSON.parse(saved);
        this.calculateAll();
      } else {
        this.addYear();
      }
    },
    methods: {
      addYear() {
        const yearCount = this.years.filter(y => !y.isSummer).length;
        if (yearCount < 4) {
          this.years.push({
            label: this.yearLabels[yearCount],
            isSummer: false,
            semesters: [{ courses: [new Course()] }, { courses: [new Course()] }]
          });
          this.calculateAll();
        }
      },
      addSummer() {
        const choice = prompt("Which summer? (0: Pre-Freshman, 1: Soph, 2: Junior, 3: Senior, 4+: Post-Senior)");
        const idx = parseInt(choice || "0");
        const newSummer = {
          label: (this.summerLabels[idx] || 'Post-Senior') + ' Summer',
          isSummer: true,
          semesters: [{ courses: [new Course()] }]
        };
        this.years.splice(idx, 0, newSummer);
        this.calculateAll();
      },
      removeYear(idx: number) {
        if (confirm("Delete this session?")) {
          this.years.splice(idx, 1);
          this.calculateAll();
        }
      },
      addCourse(yIdx: number, sIdx: number) {
        this.years[yIdx].semesters[sIdx].courses.push(new Course());
        this.calculateAll();
      },
      addFullYear(yIdx: number) {
        const name = prompt("Enter course name:") || "";
        const c1 = new Course(); c1.name = name;
        const c2 = new Course(); c2.name = name;
        this.years[yIdx].semesters[0].courses.push(c1);
        this.years[yIdx].semesters[1].courses.push(c2);
        this.calculateAll();
      },
      removeCourse(yIdx: number, sIdx: number, course: any) {
        const list = this.years[yIdx].semesters[sIdx].courses;
        list.splice(list.indexOf(course), 1);
        this.calculateAll();
      },
      editCourseName(course: any, val: string) {
        course.name = val;
        localStorage.setItem('SHS_PLANNER_DATA', JSON.stringify(this.years));
      },
      setGrd(course: any, idx: number) { course.grade = idx; this.calculateAll(); },
      setLvl(course: any, idx: number) { course.level = idx; this.calculateAll(); },
      setSci(course: any, check: boolean) { course.weight = check ? 1.5 : 1.0; this.calculateAll(); },
      calculateAll() {
        let totalUWPoints = 0, totalWPoints = 0, totalUnits = 0;
        this.years.forEach(year => {
          year.semesters.forEach((sem: any) => {
            sem.courses.forEach((c: any) => {
              const grade = this.gradeLabels[c.grade];
              let base = (grade === 'A') ? 4 : (grade === 'B') ? 3 : (grade === 'C') ? 2 : (grade === 'D') ? 1 : 0;
              let bump = (c.level === 1) ? 0.5 : (c.level === 2) ? 1.0 : 0;
              c.finalGrade = grade;
              c.unweightedGPA = (grade === 'F') ? 0 : base;
              c.weightedGPA = (grade === 'F') ? 0 : (base + bump);
              totalUWPoints += (c.unweightedGPA * c.weight);
              totalWPoints += (c.weightedGPA * c.weight);
              totalUnits += c.weight;
            });
          });
        });
        this.averageUnweightedGpa = totalUnits > 0 ? totalUWPoints / totalUnits : 0;
        this.averageWeightedGpa = totalUnits > 0 ? totalWPoints / totalUnits : 0;
        localStorage.setItem('SHS_PLANNER_DATA', JSON.stringify(this.years));
      }
    }
  });
</script>


<style lang="sass" scoped>

@import '@/styles/style.sass'


.animated-fade-up
  animation: fadeUp 0.5s ease backwards
.summer-theme
  border-color: #f39c12 !important
  .year-banner
    background: #f39c12 !important


@keyframes fadeUp
  from
    opacity: 0
    transform: translateY(20px)
  to
    opacity: 1
    transform: translateY(0)


.edit-note
  padding: 15px 0px
  font-size: 0.95em
  font-weight: 500
  color: #666


.year-block
  margin-top: 30px
  border: 2px solid var(--accent)
  border-radius: 12px
  background: white
  box-shadow: 0 4px 6px rgba(0,0,0,0.05)
  overflow: hidden


.year-banner
  background: var(--accent)
  color: var(--background)
  padding: 12px
  text-align: center
  font-size: 1.8em
  font-weight: bold
  display: flex
  justify-content: center
  align-items: center
  position: relative


.year-close
  position: absolute
  right: 15px
  font-size: 0.6em
  cursor: pointer
  opacity: 0.7


  &:hover
    opacity: 1


.semester-grid
  display: flex


  +mobile
    flex-direction: column


.sem-column
  flex: 1
  padding: 20px
  border-right: 1px solid #eee


  &:last-child
    border-right: none


.sem-header
  text-align: center
  font-size: 1.5em
  margin-bottom: 15px
  color: var(--accent)
  font-weight: 600


.course-header-row
  display: flex
  background: var(--accent)
  color: var(--background)
  padding: 8px
  border-radius: 8px 8px 0 0
  position: relative


.close
  position: absolute
  right: 10px
  top: 12px
  cursor: pointer


.name-input
  flex: 1
  background: transparent
  border: none
  color: inherit
  font-size: 1.2em
  outline: none
  text-align: center


.big-grade
  font-size: 3em
  text-align: center
  margin: 10px 0
  font-weight: bold


.gpa-stats
  display: flex
  justify-content: space-around
  margin-bottom: 10px


.num
  font-size: 1.8em
  color: var(--accent)
  font-weight: bold


.footer-actions
  display: flex
  gap: 12px
  margin-top: 15px


.sketch-btn
  flex: 1
  border: 2px solid #000
  border-radius: 25px
  background: white
  padding: 8px
  font-weight: 600
  cursor: pointer
  transition: 0.2s

  &:hover
    background: #f8f8f8
    transform: scale(1.02)

</style>
