import defaultSchedules from 'src/data/schedules.json';
import { query } from 'vue-analytics';

export default function(store) {
  if (localStorage.color) {
    store.commit('setColor', localStorage.color);
    query('set', 'dimension1', localStorage.color)
  } else {
    query('set', 'dimension1', 'unset');
  }

  const localSchedules = localStorage.schedules ? tryParseJSON(localStorage.schedules) : null
  const schedules = Array.isArray(localSchedules) ? localSchedules : defaultSchedules;
  setSchedules(store, schedules.slice(0)); // the .slice(0) (cloning array) is probably unnecessary, but just in case

  if (localStorage.defaultSchedule) {
    store.commit('setDefaultSchedule', localStorage.defaultSchedule);
    store.commit('setScheduleMode', localStorage.defaultSchedule);
  }

  if (localStorage.grade) {
    store.commit('setGrade', localStorage.grade);
  }
}

function tryParseJSON(json) {
  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

// Merges localStorage schedules and defaultSchedules together in case changes have been made to defaultSchedules
// (for example, when dates are updated or a new schedule type is added)
function setSchedules(store, schedules) {
  const scheduleTypes = schedules.map(schedule => schedule.name);

  // can't combine this and the following forEach because adding new schedules changes the indexes
  defaultSchedules.forEach(schedule => {
    const index = scheduleTypes.indexOf(schedule.name)
    if (index > -1) { // update the schedule dates just in case new dates were added
      schedules[index].dates = schedule.dates;
    }
  })

  defaultSchedules.forEach((schedule, index) => {
    if (scheduleTypes.indexOf(schedule.name) === -1) { // means new schedule type was added
      schedules.splice(index, 0, schedule); // add the new schedule to schedules in the correct index
    }
  });

  store.commit('setSchedules', schedules);
}