<template>
    <div class="pwc-schedule">
        <h1 class="title">PWC Schedule</h1>

        <h2 class="section-header">Summer Hours <span class="date">(through Aug. 12, 2023)</span></h2>
        <ul class="days-of-week">
            <li><span class="day">Monday - Thursday:</span> <span class="time">9 a.m. - 5 p.m.</span></li>
            <li><span class="day">Friday:</span> <span class="time">9 a.m. - 1 p.m.</span></li>
            <li><span class="day">Saturday:</span> <span class="time">10 a.m. - 2 p.m.</span></li>
            <li><span class="day">Sunday:</span> <span class="time">CLOSED</span></li>
        </ul>

        <h2 class="section-header">Upcoming Closed Dates</h2>
        <ul class="days-of-week">
            <li><span class="date-range">Wednesday - Saturday, Aug. 9 - 12, 2023</span></li>
        </ul>

        <h2 class="section-header">After-School Hours</h2>
        <ul class="days-of-week">
            <li><span class="day">Monday - Thursday:</span> <span class="time">3:30 - 8 p.m.</span></li>
            <li><span class="day">Friday:</span> <span class="time">3:30 - 6 p.m.</span></li>
            <li><span class="day">Saturday - Sunday:</span> <span class="time">10 a.m. - 3 p.m.</span></li>
        </ul>

        <h2 class="section-header">Things Students Need to Know</h2>
        <ul class="info-list">
            <li><span class="info">Students must bring and swipe into the facility with their Stevenson ID.</span></li>
            <li><span class="info">Lockers will not be available after hours.</span></li>
            <li><span class="info">Late buses will be available Monday-Friday.</span></li>
        </ul>
    </div>
</template>

<script>export default {
        name: 'HelloWorld',
        data() {
            return {
                daysOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            };
        },
    };</script>

<style scoped>
    .pwc-schedule {
        text-align: center;
        min-height: 100vh;
        margin: 0;
    }

    .title {
        font-size: 64px;
        color: #238823; /* Green color */
        margin: 0 auto 20px;
    }

    .section-header {
        font-size: 36px;
        color: #555;
        margin-top: 30px;
    }

    .days-of-week {
        text-align: center;
        font-size: 19px;
        padding: 0;
        margin: 16px 0;
    }

        .days-of-week li {
            margin: 8px 0;
        }

    .date {
        font-size: 24px;
        color: #888;
    }

    .date-range {
        font-size: 19px;
        color: #d50000; /* Red color */
    }

    .day {
        font-weight: bold;
        color: #444;
    }

    .time {
        font-size: 19px;
    }

    .info-list {
        list-style-type: none; /* Remove bullet points */
    }

    .info {
        font-size: 19px;
    }
</style>
