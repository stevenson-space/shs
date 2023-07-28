<template>
    <div class="status-container">
        <div class="countdown">{{ countdownString }}</div>
        <div class="status" :class="{ open: isOpeningHours, closed: !isOpeningHours }">
            {{ getStatus }}
            <div class="day-date">{{ dayDate }}</div>
        </div>
        <button @click="goToHomepage" class="home-button">Go Back to Homepage</button>
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
            isBeforeJune1() {
                const now = new Date();
                return now.getMonth() < 5 || (now.getMonth() === 5 && now.getDate() < 1);
            },
            isAfterAugust12() {
                const now = new Date();
                return now.getMonth() > 7 || (now.getMonth() === 7 && now.getDate() >= 12);
            },
            isPwcClosed() {
                const pwcClosureStart = new Date('2023-08-09');
                const pwcClosureEnd = new Date('2023-08-12');
                const now = new Date();
                return now >= pwcClosureStart && now <= pwcClosureEnd;
            },
            getStatus() {
                const isWeekend = this.currentDay === 0 || this.currentDay === 6;

                if (this.isPwcClosed) {
                    return 'Closed';
                } else if (this.isBeforeJune1 || this.isAfterAugust12) {
                    const isOpeningHours =
                        (this.currentDay >= 1 &&
                            this.currentDay <= 4 &&
                            this.currentHour >= 15 &&
                            (this.currentHour < 20 || (this.currentHour === 20 && this.currentMinute === 0))) ||
                        (this.currentDay === 5 &&
                            this.currentHour >= 15 &&
                            (this.currentHour < 18 || (this.currentHour === 18 && this.currentMinute === 0))) ||
                        (isWeekend &&
                            this.currentHour >= 10 &&
                            (this.currentHour < 15 || (this.currentHour === 15 && this.currentMinute === 0)));

                    return isOpeningHours ? 'Open' : 'Closed';
                } else {
                    const isOpeningHours =
                        (this.currentDay >= 1 &&
                            this.currentDay <= 4 &&
                            this.currentHour >= 9 &&
                            (this.currentHour < 17 || (this.currentHour === 17 && this.currentMinute === 0))) ||
                        (this.currentDay === 5 &&
                            this.currentHour >= 9 &&
                            (this.currentHour < 13 || (this.currentHour === 13 && this.currentMinute === 0))) ||
                        (this.currentDay === 6 &&
                            this.currentHour >= 10 &&
                            (this.currentHour < 14 || (this.currentHour === 14 && this.currentMinute === 0)));

                    return isOpeningHours ? 'Open' : 'Closed';
                }
            },
            nextOpeningTime() {
                const nextOpeningHour =
                    this.currentDay === 5
                        ? 9 // Friday: 9 a.m.
                        : this.currentDay === 6
                            ? 10 // Saturday: 10 a.m.
                            : 9; // Monday to Thursday: 9 a.m.

                if (this.isBeforeJune1 || this.isAfterAugust12) {
                    return new Date(new Date().setHours(nextOpeningHour + 3, 30, 0, 0));
                } else {
                    return new Date(new Date().setHours(nextOpeningHour, 0, 0, 0));
                }
            },
            nextClosingTime() {
                const nextClosingHour =
                    this.currentDay === 5
                        ? 13 // Friday: 1 p.m.
                        : this.currentDay === 6
                            ? 14 // Saturday: 2 p.m.
                            : 17; // Monday to Thursday: 5 p.m.

                if (this.isBeforeJune1 || this.isAfterAugust12) {
                    return new Date(new Date().setHours(nextClosingHour + 3, 30, 0, 0));
                } else {
                    return new Date(new Date().setHours(nextClosingHour, 0, 0, 0));
                }
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
                let isOpeningHours = this.isOpeningHours;
                if (isOpeningHours) {
                    countdown = this.nextClosingTime - this.currentTime;
                } else {
                    countdown = this.nextOpeningTime - this.currentTime;
                    isOpeningHours = countdown > 0; // If countdown is greater than zero
                }

                if (countdown <= 0) return '00:00:00';

                const seconds = Math.floor((countdown / 1000) % 60);
                const minutes = Math.floor((countdown / (1000 * 60)) % 60);
                const hours = Math.floor((countdown / (1000 * 60 * 60)) % 24);

                return `${hours.toString().padStart(2, '0')}:${minutes
                    .toString()
                    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            },
        },
        watch: {
            currentTime() {
                this.$forceUpdate();
            },
        },
        methods: {
            initializeCountdown() {
                this.stopCountdown();
                this.interval = setInterval(() => {
                    this.currentTime = new Date().getTime();
                }, 1000);
            },
            stopCountdown() {
                clearInterval(this.interval);
            },
            goToHomepage() {
                // Use Vue Router to navigate to the homepage
                this.$router.push("/");
            }
        },
        mounted() {
            this.initializeCountdown();
        },

        created() {
            setInterval(() => {
                this.$forceUpdate();
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

    .status-container {
        position: relative;
        /* Add any other styles for your status container */
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