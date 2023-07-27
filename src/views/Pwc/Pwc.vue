<template>
    <div class="status-container">
        <div class="countdown">{{ countdownString }}</div>
        <div class="status" :class="{ open: isOpeningHours, closed: !isOpeningHours }">
            {{ getStatus }}
            <div class="day-date">{{ dayDate }}</div>
        </div>
    </div>
</template>

<script>export default {
        data() {
            return {
                isOpen: false,
                currentTime: new Date().getTime(),
            };
        },
        computed: {
            currentDay() {
                return new Date().getDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday
            },
            currentHour() {
                return new Date().getHours();
            },
            currentMinute() {
                return new Date().getMinutes();
            },
            getStatus() {
                const isWeekend = this.currentDay === 0 || this.currentDay === 6;
                const isOpeningHours =
                    (this.currentDay >= 1 && this.currentDay <= 4 && this.currentHour >= 9 && this.currentHour <= 17) ||
                    (this.currentDay === 5 && this.currentHour >= 9 && this.currentHour <= 13);
                const isSaturdayHours = this.currentDay === 6 && this.currentHour >= 10 && this.currentHour <= 14;

                if (isWeekend) {
                    return 'CLOSED';
                } else if (isOpeningHours) {
                    return 'Open';
                } else if (isSaturdayHours) {
                    return 'Open (Saturday)';
                } else {
                    return 'Closed';
                }
            },
            nextOpeningTime() {
                const nextOpeningHour =
                    this.currentDay === 5
                        ? 9 // Friday: 9 a.m.
                        : this.currentDay === 6
                            ? 10 // Saturday: 10 a.m.
                            : 9; // Monday to Thursday: 9 a.m.

                return new Date(new Date().setHours(nextOpeningHour, 0, 0, 0));
            },
            nextClosingTime() {
                const nextClosingHour =
                    this.currentDay === 5
                        ? 13 // Friday: 1 p.m.
                        : this.currentDay === 6
                            ? 14 // Saturday: 2 p.m.
                            : 17; // Monday to Thursday: 5 p.m.

                return new Date(new Date().setHours(nextClosingHour, 0, 0, 0));
            },
            isOpeningHours() {
                return this.getStatus === 'Open' || this.getStatus === 'Open (Saturday)';
            },
            dayDate() {
                const options = { weekday: 'long', month: 'long', day: 'numeric' };
                return new Date().toLocaleDateString('en-US', options);
            },
            countdownString() {
                let countdown;
                if (this.isOpeningHours) {
                    countdown = this.nextClosingTime - this.currentTime;
                } else {
                    countdown = this.nextOpeningTime - this.currentTime;
                }

                if (countdown <= 0) return '00:00:00';

                const seconds = Math.floor((countdown / 1000) % 60);
                const minutes = Math.floor((countdown / (1000 * 60)) % 60);
                const hours = Math.floor((countdown / (1000 * 60 * 60)) % 24);

                return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            },
        },

        watch: {
            currentTime() {
                // Recalculate the countdownString whenever currentTime changes
                this.$forceUpdate(); // Force the component to re-render
            },
        },
        methods: {
            initializeCountdown() {
                this.stopCountdown();
                // start an interval which increments the currentTime every second (everything else updates based on that)
                this.interval = setInterval(() => {
                    this.currentTime = new Date().getTime();
                }, 1000);
            },
            stopCountdown() {
                clearInterval(this.interval);
            },
        },
        mounted() {
            this.initializeCountdown(); // Start the countdown when the component is mounted
        },

        created() {
            setInterval(() => {
                // Update the countdown every second
                this.$forceUpdate(); // Force the component to re-render
            }, 1000);
        },
    };</script>

<style>
    .status-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background-color: #4caf50; /* Green background */
        color: #ffffff; /* White text */
    }

    .logo {
        width: 120px;
        height: 120px;
        margin-bottom: 20px;
    }

    .countdown {
        font-size: 32px;
        font-weight: bold;
        color: #ffffff; /* White text */
    }

    .status {
        margin-top: 20px;
        font-size: 24px;
        font-weight: bold;
        padding: 10px;
        border-radius: 8px;
        text-align: center;
        background-color: #4caf50; /* Green background for both "Open" and "Closed" status */
    }

    .day-date {
        font-size: 14px;
        font-weight: normal;
        margin-top: 8px;
    }
</style>
