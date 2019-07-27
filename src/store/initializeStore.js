import defaultSchedules from 'src/data/schedules.json';
import { query } from 'vue-analytics';

export default function (store) {
  if (localStorage.color) {
    store.commit('setColor', localStorage.color);
    query('set', 'dimension1', localStorage.color);
  } else {
    query('set', 'dimension1', 'unset');
  }

  const localSchedules = localStorage.schedules ? tryParseJSON(localStorage.schedules) : null;
  const schedules = Array.isArray(localSchedules) ? localSchedules : defaultSchedules;
  setSchedules(store, schedules);

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

// Merges localStorage schedules and defaultSchedules (from server) together in case changes have been made to defaultSchedules
// (for example, when dates are updated or a new schedule type is added)
// Assumptions: user cannot modify schedule types (only modes), so schedule types will always match server
function setSchedules(store, localSchedules) {
  let schedules = localSchedules.slice(0); // the .slice(0) (cloning array) is probably unnecessary, but just in case
  const scheduleTypes = schedules.map(schedule => schedule.name);

  // Replace all local dates with ones from the server (defaultSchedules) in case modifications were made
  defaultSchedules.forEach((schedule) => {
    const index = scheduleTypes.indexOf(schedule.name);
    if (index > -1) {
      schedules[index].dates = schedule.dates;
    }
  });

  // Delete any schedules in the local copy that aren't found in the sever copy
  const defaultScheduleTypes = defaultSchedules.map(schedule => schedule.name);
  schedules = schedules.filter(schedule => defaultScheduleTypes.includes(schedule.name));

  // Add any new schedules that were added to the server copy to the local one
  defaultSchedules.forEach((schedule, index) => {
    if (!scheduleTypes.includes(schedule.name)) { // means new schedule type was added (found in server copy but not in local)
      schedules.splice(index, 0, schedule); // add the new schedule to schedules in the correct index
    }
  });

  // So now the schedules on the server should match those on local (the content may be different if the user edited anything)
  // Sort the schedules on the local copy to match the order on the server
  const sortedSchedules = [];
  defaultSchedules.forEach((defaultSchedule) => {
    sortedSchedules.push( // find the local schedule with the same name as the server one and add it (in order)
      schedules.find(schedule => defaultSchedule.name === schedule.name),
    );
  });

  store.commit('setSchedules', sortedSchedules);
}
