<template>
    <div class="app">
        <h1>PWC Gym Countdown</h1>
        <div class="countdown">
            <p v-if="isOpen">Time remaining until closure: {{ countdownTime }}</p>
            <p v-else>Time remaining until next opening: {{ countdownTime }}</p>
        </div>
        <button @click="goToHomepage" class="home-button">Go Back to Homepage</button>
    </div>
</template>

<script>export default {
        data() {
            return {
                openingTimes: [
                    { day: 1, start: "15:30", end: "20:00" }, // Monday
                    { day: 2, start: "15:30", end: "20:00" }, // Tuesday
                    { day: 3, start: "15:30", end: "20:00" }, // Wednesday
                    { day: 4, start: "15:30", end: "20:00" }, // Thursday
                    { day: 5, start: "15:30", end: "18:00" }, // Friday
                    { day: 6, start: "10:00", end: "15:00" }, // Saturday
                    { day: 0, start: "10:00", end: "15:00" }, // Sunday
                ],
                currentTimeMs: 0,
            };
        },
        computed: {
            currentTime() {
                return new Date(this.currentTimeMs);
            },
            currentDay() {
                return this.currentTime.getDay();
            },
            currentOpeningTime() {
                const openingTime = this.openingTimes.find(
                    (time) => time.day === this.currentDay
                );
                return this.getTimeInMs(this.currentTime.toDateString(), openingTime.start);
            },
            currentClosingTime() {
                const closingTime = this.openingTimes.find(
                    (time) => time.day === this.currentDay
                );
                return this.getTimeInMs(this.currentTime.toDateString(), closingTime.end);
            },
            nextOpeningTime() {
                const nextDay = (this.currentDay + 1) % 7;
                const openingTime = this.openingTimes.find(
                    (time) => time.day === nextDay
                );
                return this.getTimeInMs(this.getNextDate(nextDay), openingTime.start);
            },
            isOpen() {
                return this.currentTime >= this.currentOpeningTime && this.currentTime <= this.currentClosingTime;
            },
            countdownTime() {
                const targetTime = this.isOpen ? this.currentClosingTime : this.nextOpeningTime;
                const timeDiff = targetTime - this.currentTimeMs;
                if (timeDiff <= 0) {
                    return "00:00:00";
                }
                const hours = String(Math.floor(timeDiff / (1000 * 60 * 60))).padStart(2, '0');
                const minutes = String(Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
                const seconds = String(Math.floor((timeDiff % (1000 * 60)) / 1000)).padStart(2, '0');
                return `${hours}:${minutes}:${seconds}`;
            },
        },
        methods: {
            getTimeInMs(dateString, timeString) {
                const dateTimeString = `${dateString} ${timeString}`;
                return new Date(dateTimeString).getTime();
            },
            getNextDate(day) {
                const today = this.currentTime.getDay();
                const difference = (day - today + 7) % 7;
                const nextDate = new Date(this.currentTime);
                nextDate.setDate(this.currentTime.getDate() + difference);
                return nextDate.toDateString();
            },
            updateCurrentTime() {
                this.currentTimeMs = Date.now();
            },
            goToHomepage() {
                // Use Vue Router to navigate to the homepage
                this.$router.push("/");
            },
        },
        created() {
            // Initialize the countdown immediately
            this.updateCurrentTime();

            // Update currentTime every second
            this.timer = setInterval(() => {
                this.updateCurrentTime();
            }, 1000);
        },
        beforeDestroy() {
            clearInterval(this.timer);
        },
    };</script>

<style>
    .app {
        text-align: center;
        margin-top: 50px;
        background-color: #00563F;
        color: #FFFFFF;
        height: 100vh;
        display: flex;
        flex-direction: column; /* Place the items in a column layout */
        justify-content: center;
        align-items: center;
    }

    .countdown {
        font-size: 24px;
        font-weight: bold;
        margin-top: 20px;
    }

    .time-heading {
        font-size: 20px;
        margin-bottom: 10px;
    }

    .time-remaining {
        font-size: 30px;
    }
    .home-button {
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #4caf50;
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        text-decoration: none;
        font-size: 16px;
    }

        .home-button:hover {
            background-color: #45a049;
        }
</style>
