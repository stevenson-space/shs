<template>
	<div
		class="header"
		:class="{ 'full-screen': fullScreenMode }"
		:style="colors"
	>
		<dropdown
			v-show="scheduleModes.length > 1"
			class="schedule-select"
			:options="scheduleModes"
			:value="scheduleModes.indexOf(bell.mode)"
			@input="$store.commit('setScheduleMode', scheduleModes[$event])"
		/>

		<div
			class="main"
			:class="{ 'extra-padding': scheduleModes.length > 1 }"
		>
			<div v-hammer:tap="previousDay" class="switch-day">
				<font-awesome-icon
					:icon="icons.faChevronLeft"
					class="arrow-icon"
				/>
			</div>

			<div>
				<countdown-circle
					:in-school="inSchool"
					:countdown="countdownString"
					:range="bell.getRange()"
					:next-day="nextDayString"
					:schedule-type="bell.type"
					:full-screen-mode="fullScreenMode"
				/>

				<div class="date">
					{{ formatDate(date) }}
				</div>
			</div>

			<div v-hammer:tap="nextDay" class="switch-day">
				<font-awesome-icon
					:icon="icons.faChevronRight"
					class="arrow-icon"
				/>
			</div>

			<div v-hammer:tap="toggleColor" class="icon remove-color">
				<font-awesome-icon
					:icon="colored ? icons.faTintSlash : icons.faTint"
					fixed-width
				/>
			</div>

			<div
				v-show="mode === 'current'"
				v-hammer:tap="toggleFullScreen"
				class="icon full-screen-mode"
			>
				<font-awesome-icon
					:icon="fullScreenMode ? icons.faCompress : icons.faExpand"
					fixed-width
				/>
			</div>
		</div>

		<header-schedule
			:in-school="inSchool"
			:period="bell.getPeriodName()"
			:range="bell.getRange()"
			:schedule-type="bell.type"
			:schedule-modes="scheduleModes"
			:full-screen-mode="fullScreenMode"
		/>

		<announcements :full-screen-mode="fullScreenMode" />
	</div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
import {
	faChevronRight,
	faChevronLeft,
	faExpand,
	faCompress,
	faTint,
	faTintSlash
} from "@fortawesome/free-solid-svg-icons";

import Bell from "src/js/bell";
import Dropdown from "src/components/common/Dropdown.vue";
import CountdownCircle from "./CountdownCircle.vue";
import HeaderSchedule from "./HeaderSchedule.vue";
import Announcements from "./Announcements.vue";

function toSeconds([hour = 0, minute = 0, second = 0]) {
	return (hour * 60 + minute) * 60 + second;
}

function dateToSeconds(date) {
	return toSeconds([date.getHours(), date.getMinutes(), date.getSeconds()]);
}

// period is in the format of a human readable 24-hour time string
function periodToSeconds(period) {
	return toSeconds(period.split(":").map(Number));
}

export default {
	components: {
		FontAwesomeIcon,
		CountdownCircle,
		HeaderSchedule,
		Dropdown,
		Announcements
	},
	props: {
		fullScreenMode: { type: Boolean, default: false }
	},
	data() {
		return {
			icons: {
				faChevronRight,
				faChevronLeft,
				faExpand,
				faCompress,
				faTint,
				faTintSlash
			},
			currentTime: 0,
			interval: null,
			colored: true
		};
	},
	computed: {
		// this automatically gets the following properties from the store and adds them as computed properties
		...mapState(["mode"]),
		...mapGetters(["date", "bell"]),
		colors() {
			const showColor = this.colored || !this.fullScreenMode;
			return {
				"--header-color": showColor ? "var(--color)" : "white",
				"--header-accent": showColor ? "white" : "var(--color)"
			};
		},
		inSchool() {
			// To be in school, there must be school that day and we must not be before or after school
			const { bell } = this;
			return (
				bell.school &&
				!bell.period.afterSchool &&
				!bell.period.beforeSchool
			);
		},
		endTime() {
			const { bell, date, inSchool } = this;
			if (inSchool) {
				return periodToSeconds(bell.period.end);
			}
			// if not currently in school, return seconds left until school starts
			const { school, period, nextSchoolDay } = bell;
			let dayDifference = 0;

			// if before school, get the seconds until the first period today
			let nextBell = bell;

			// if no school or after school, get the first period on the next school day
			if (!school || period.afterSchool) {
				dayDifference = Math.floor(
					(nextSchoolDay.getTime() - date.getTime()) /
						1000 /
						60 /
						60 /
						24
				);
				nextBell = new Bell(nextSchoolDay);
			}

			// return the start time of the next first period + 24 hours for each day elapsed in between
			const firstPeriod = nextBell.schedule.start[0];
			return periodToSeconds(firstPeriod) + dayDifference * 24 * 60 * 60;
		},
		totalSecondsLeft() {
			// this is seperated from endTime since totalSecondsLeft needs to be recalculated every
			// second while endTime (which is computationally expensive) does not
			return this.endTime - this.currentTime;
		},
		countdownString() {
			if (this.totalSecondsLeft > 60 * 60 * 24) {
				// if more than 1 day of seconds left, display number of days left
				const numDays = Math.ceil(this.totalSecondsLeft / 60 / 60 / 24);
				return `${numDays} days`;
			}
			// return a nicely formatted string with remaining hours, minutes, and seconds left
			const seconds = this.totalSecondsLeft % 60;
			const minutes = Math.floor(this.totalSecondsLeft / 60) % 60;
			const hours = Math.floor(this.totalSecondsLeft / 60 / 60);

			const h = hours > 0 ? `${hours}:` : ""; // hours is only displayed if > 0
			const mm = `${minutes < 10 && hours > 0 ? "0" : ""}${minutes}:`; // minutes always has 2 digits if hours are displayed
			const ss = `${seconds < 10 ? "0" : ""}${seconds}`; // seconds always has 2 digits

			return `${h}${mm}${ss}`;
		},
		nextDayString() {
			// Returns when school resumes
			// Only displayed when not in school (either no school, before school, or after school)
			const { bell, date } = this;
			const { school, period, nextSchoolDay } = bell;

			// get days since January 1, 1970
			const getEpochDay = ofDate =>
				Math.floor(ofDate.getTime() / 1000 / 60 / 60 / 24);

			// if school resumes on the same day or the next day, use 'today' or 'tomorrow' instead of the date
			let str;
			if (school && period.beforeSchool) {
				str = "\ntoday";
			} else {
				const dayDifference =
					getEpochDay(nextSchoolDay) - getEpochDay(date);
				if (dayDifference === 1) {
					str = "\ntomorrow";
				} else {
					str = this.formatDate(nextSchoolDay);
				}
			}
			return `School resumes ${str}`;
		},
		tomorrow() {
			// Date object for the next day, used for the arrow right
			const date = new Date(this.date);
			date.setDate(date.getDate() + 1);
			return date;
		},
		yesterday() {
			// Date object for the previous day, used for the arrow left
			const date = new Date(this.date);
			date.setDate(date.getDate() - 1);
			return date;
		},
		scheduleModes() {
			const { modes } = this.bell;
			return modes.map(mode => mode.name);
		}
	},
	watch: {
		mode() {
			if (this.mode === "current") {
				this.initializeCountdown();
			} else {
				this.stopCountdown();
			}
		},
		date() {
			this.currentTime = dateToSeconds(this.date);
		},
		totalSecondsLeft() {
			if (this.totalSecondsLeft <= 0) {
				this.$store.dispatch("countdownDone");
			}
		},
		colored() {
			localStorage.fullScreenColored = this.colored;
		}
	},
	created() {
		this.currentTime = dateToSeconds(this.date);
		if (localStorage.fullScreenColored === "false") {
			this.colored = false;
		}
	},
	mounted() {
		this.initializeCountdown();
	},
	destroyed() {
		clearInterval(this.interval);
	},
	methods: {
		formatDate(date) {
			// Wednesday,
			// September 30
			return date
				.toLocaleDateString("en-US", {
					weekday: "long",
					month: "long",
					day: "numeric"
				})
				.replace(",", ",\n");
		},
		formatDateUrl(date) {
			// e.g. "6-11-2018"
			return date
				.toLocaleDateString("en-US", {
					month: "numeric",
					day: "numeric",
					year: "numeric"
				})
				.replace(/\//g, "-");
		},
		initializeCountdown() {
			this.stopCountdown();
			// start an interval which increments the currentTime every seconds (everything else updates based on that)
			this.interval = setInterval(() => {
				this.currentTime++;
			}, 1000);
		},
		stopCountdown() {
			clearInterval(this.interval);
		},
		previousDay(e) {
			e.srcEvent.preventDefault();
			this.switchDay(this.yesterday);
		},
		nextDay(e) {
			e.srcEvent.preventDefault();
			this.switchDay(this.tomorrow);
		},
		switchDay(date) {
			const { formatDateUrl, $router, mode } = this;
			if (formatDateUrl(date) === formatDateUrl(new Date())) {
				// if switching to today, switch to the normal view for today (mode === 'current')
				$router.push({ path: "/" });
			} else {
				const options = {
					path: "/",
					query: { date: formatDateUrl(date) }
				};

				// We only want to record a history entry if we're going from the current date to another date
				// Otherwise, we just want to replace the URL so that pressing the back button once
				// returns the user to the current date
				$router[mode === "current" ? "push" : "replace"](options);
			}
		},
		toggleFullScreen() {
			this.$emit("toggle-fullscreen");
		},
		toggleColor() {
			this.colored = !this.colored;
		}
	}
};
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.header
  +shadow
  background-color: var(--header-color)
  text-align: center
  transition: background-color .3s

  .schedule-select
    position: absolute
    right: 0
    margin: 7px
    display: none
    +mobile-small
      display: block

  .main
    height: 350px
    display: flex
    align-items: center
    justify-content: space-between
    max-width: 1000px
    margin: auto
    position: relative
    +mobile-small
      height: 280px
      &.extra-padding
        padding-top: 35px

    .date
      // +shadow
      background-color: white
      border-radius: 100px
      margin-top: 10px
      padding: 3px
      font-size: .9em
      +mobile-small
        margin-top: 7px

    .switch-day
      color: white
      width: 100px
      margin: 0 15px
      cursor: pointer
      border-radius: 1000px
      +mobile-small
        margin: 0 5px
      &:active
        +shadow

      .arrow-icon
        font-size: 5em
        margin: 50px 0
        +mobile-small
          font-size: 3.5em

    .icon
      position: absolute
      top: 9px
      color: var(--header-accent) // set in computed property 'colors'
      padding: 10px
      border-radius: 100px
      font-size: 1.75em
      cursor: pointer
      transition: box-shadow .2s
      +hover-darken-background
      +mobile
        display: none

    .remove-color
      display: none

    .full-screen-mode
      right: 9px


  &.full-screen
    top: 0
    height: 100%
    width: 100%
    position: fixed
    z-index: 2
    display: flex
    flex-direction: column

    .main
      flex-grow: 1
      justify-content: center

      .switch-day
        display: none

      .date
        font-size: 2.75vh
        margin-top: 25px
        padding: 5px

      .icon
        position: fixed
        top: 25px
        font-size: 4vh

      .remove-color
        display: block
        right: 85px

      .full-screen-mode
        position: fixed
        right: 25px
</style>
