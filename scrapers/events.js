const fs = require('fs');
const superagent = require('superagent');
const path = require('path');

const eventsFilepath = path.resolve(__dirname, '../src/data/events.json');
const calendarId = 'AF5167036E214C99B84D252995DB9199';
const url = `https://www.d125.org/data/calendar/icalcache/feed_${calendarId}.ics`;

const oldEvents = require(eventsFilepath);

main();

async function main() {
  const events = (await getEvents(url))
    .map(fixBrokenDescription)
    .map(processDates)
    .map(processAllDay)
    .map(processText)
    .map(processUnnecessary);

  const sortedEvents = sortEventsByDate(events);
  const orderedEvents = orderEvents(sortedEvents);
  const combinedEvents = combine(oldEvents, orderedEvents);
  const json = JSON.stringify(combinedEvents, null, 2);

  console.log('Done updating events. Saving...\n');

  fs.writeFile(eventsFilepath, json, (err) => {
    if (err) console.log(err);
    else console.log('\nEvents saved.\n')
  });

  findSpecialDays(combinedEvents);
}

function getEvents(icsUrl) {
  return new Promise((resolve, reject) => {
    superagent
      .get(icsUrl)
      .then((res) => {
        const events = parseICS(res.text);
        resolve(events);
      })
      .catch(err => reject(err));
  });
}

function parseICS(ics) {
  const eventStart = 'BEGIN:VEVENT';
  const eventEnd = 'END:VEVENT';
  const truncatedICS = ics.substring(ics.indexOf(eventStart) + eventStart.length, ics.lastIndexOf(eventEnd))
    .replace(/\r\n/g, '\n') // normalize new lines
    .replace(/\\,/g, ',') // unescape commas

  const eventStrings = truncatedICS.split(`\n${eventEnd}\n${eventStart}\n`);
  const events = eventStrings.map((eventString) => {
    const properties = eventString.split('\n');
    const event = {};
    properties.forEach((property) => {
      const colonIndex = property.indexOf(':');
      const index = colonIndex > -1 ? colonIndex : property.length;
      event[property.substring(0, index)] = property.substring(index + 1);
    });
    return event;
  });

  return events;
}


function removeProperties(event, properties) {
  const newEvent = {};
  for (const property in event) {
    if (!properties.includes(property)) {
      newEvent[property] = event[property];
    }
  }
  return newEvent;
}

function parseDate(date, inUTC = false) {
  const year = Number(date.substr(0, 4));
  const month = Number(date.substr(4, 2)) - 1; // - 1 since month is 0-indexed in JavaScript
  const day = Number(date.substr(6, 2));
  const hour = Number(date.substr(9, 2));
  const minute = Number(date.substr(11, 2));
  const second = Number(date.substr(13, 2));

  const parsedDate = inUTC ? new Date(Date.UTC(year, month, day, hour, minute, second))
    : new Date(year, month, day, hour, minute, second);
  return parsedDate.getTime();
}

function fixBrokenDescription(event) {
  const validProperties = ['ORGANIZER', 'DTSTART', 'DTEND', 'TZNAME', 'LOCATION', 'UID', 'DTSTAMP', 'SUMMARY',
    'DESCRIPTION', 'PRIORITY', 'CLASS', 'DTSTART;VALUE=DATE', 'DTEND;VALUE=DATE', 'CATEGORIES'];

  let description = '';
  const propertiesToRemove = ['DESCRIPTION'];
  for (const property in event) {
    if (!validProperties.includes(property)) {
      description += `\n${property}`;
      propertiesToRemove.push(property);
      if (event[property]) {
        description += `:${event[property]}`;
      }
    }
  }

  const fixedEvent = removeProperties(event, propertiesToRemove);
  fixedEvent.DESCRIPTION = event.DESCRIPTION + description;
  return fixedEvent;
}

function processDates(event) {
  if (event.DTSTART) {
    const processedEvent = removeProperties(event, ['DTSTART', 'DTEND', 'TZNAME']);
    processedEvent.start = parseDate(event.DTSTART);
    if (event.DTEND) processedEvent.end = parseDate(event.DTEND);
    return processedEvent;
  }
  return event;
}

function processAllDay(event) {
  if (event['DTSTART;VALUE=DATE']) {
    const processedEvent = removeProperties(event, ['DTSTART;VALUE=DATE', 'DTEND;VALUE=DATE', 'TZNAME']);
    processedEvent.allDay = true;
    processedEvent.start = parseDate(`${event['DTSTART;VALUE=DATE']}000000`);
    // if (event['DTEND;VALUE=DATE']) processedEvent.end = parseDate(event['DTEND;VALUE=DATE'] + '000000', false);
    return processedEvent;
  }
  return event;
}

function processText(event) {
  const processedEvent = removeProperties(event, ['ORGANIZER', 'LOCATION', 'SUMMARY', 'DESCRIPTION', 'CATEGORIES']);
  processedEvent.location = event.LOCATION;
  processedEvent.name = event.SUMMARY;
  processedEvent.description = event.DESCRIPTION
    .replace(/\\n/g, '\n') // replace escaped newlines with real ones
    .replace(/^\n+/, '') // remove any newlines at the beginning
    .replace(/\n+$/, '') // remove any newlines at the end
    .replace(/\n{3,}/g, '\n\n'); // replace any streches of newlines >= 3 with 2 newlines
  if (event.CATEGORIES) processedEvent.categories = Array.from(new Set(event.CATEGORIES.split(','))); // remove duplicates
  return processedEvent;
}

function processUnnecessary(event) {
  return removeProperties(event, ['UID', 'DTSTAMP', 'PRIORITY', 'CLASS']);
}

function sortEventsByDate(events) {
  const sortedEvents = {};
  events.forEach((event) => {
    const date = new Date(event.start).toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' });
    if (!sortedEvents[date]) {
      sortedEvents[date] = [];
    }
    sortedEvents[date].push(event);
  });
  return sortedEvents;
}

function orderEvents(events) {
  const orderedEvents = {};
  const orderedKeys = Object.keys(events).sort((a, b) => {
    const date1 = new Date(a).getTime();
    const date2 = new Date(b).getTime();
    return date1 - date2;
  });
  orderedKeys.forEach((key) => {
    orderedEvents[key] = events[key];
  });
  return orderedEvents;
}

function combine(events, newEvents) {
  const eventsKeys = Object.keys(events); // the keys would be a list of dates
  const newEventsKeys = Object.keys(newEvents);
  if (arrEqual(eventsKeys, newEventsKeys)) { // if both newEvents and events contain the same dates
    let same = true;

    // checking if newEvents and events contain the same event names for each date
    eventsKeys.forEach((key) => {
      if (!arrEqual(extractProperty(events[key], 'name'), extractProperty(newEvents[key], 'name'))) {
        same = false;
      }
    });

    if (same) { // if both events and newEvents hold the same events, return newEvents in case description (or time, location, ...) was changed
      console.log('No new events added');
      return newEvents;
    }
  }

  newEventsKeys.forEach((key) => {
    if (!events[key]) { // if events doesn't have a certain date, set the value for that date to that of newEvents
      events[key] = newEvents[key];
    } else {
      newEvents[key].forEach((event) => {
        const index = indexOfEventInList(event, events[key]);
        if (index > -1) { // if there is already an event with the same name
          events[key].splice(index, 1, event); // replace event in case description (or time, location, ...) was changed
        } else {
          events[key].push(event); // add event
        }
      });
    }
  });

  return events;
}

function arrEqual(arr1, arr2) {
  return arr1.length === arr2.length && arr1.filter(el => !arr2.includes(el)).length === 0;
}

// [{name: 'A'}, {name: 'B'}] would become ['A', 'B']
function extractProperty(arr, property) {
  return arr.map(el => el[property]);
}

function indexOfEventInList(event, list) { // get the index of the event with the same name
  for (let i = 0; i < list.length; i++) {
    if (event.name === list[i].name) {
      return i;
    }
  }
  return -1;
}


function findSpecialDays(events) {
  const specialSchedules = { // schedule: [event names that indicate that schedule]
    'Late Arrival': ['Late Arrival'],
    'Activity Period': ['Activity Period'],
    'PM Assembly': ['PM Assembly Schedule'],
    'Early Dismissal': ['Early Dismissal'],
    Finals: ['Semester Exams', 'Final Exams'],

    // 'No School' isn't included because all the days marked 'No School' are recurring holidays that are already handled in schedules.json
    'No School': ['Non-Attendance Day', 'Winter Break', 'Spring Break'],
  };

  const scheduleDates = {};
  Object.keys(specialSchedules).forEach(scheduleType => scheduleDates[scheduleType] = []);

  for (const [date, dayEvents] of Object.entries(events)) {
    dayEvents.forEach((event) => {
      for (const [scheduleType, eventNames] of Object.entries(specialSchedules)) {
        let eventIsSpecialSchedule = false;
        eventNames.forEach((eventNamePart) => {
          if (event.name.indexOf(eventNamePart) > -1) {
            eventIsSpecialSchedule = true;
          }
        });
        if (eventIsSpecialSchedule) {
          scheduleDates[scheduleType].push(date);
        }
      }
    });
  }

  // TODO: Automate updating date arrays for schedules, checking existing dates first
  console.log('If necessary, paste the following date arrays into schedules.json under the appropriate schedules:\n');
  for (const [scheduleType, dates] of Object.entries(scheduleDates)) {
    const combinedDates = combineDaySequences(dates);
    console.log(`${scheduleType}: ["${combinedDates.join('", "')}"]`);
  }
}

function combineDaySequences(dates) {
  dates = dates.slice(0); // prevent modification of the original dates object
  for (let i = 0; i < dates.length; i++) {
    // the for loop will keep incrementing j as long as the jth date and the jth date + 1 are sequential
    // using var instead of let so that i have access to j outside of for loop
    for (var j = i; isSequential(dates[j], dates[j + 1]) && j < dates.length; j++) {}

    if (j != i) { // means that there is a sequence of dates
      dates[i] = `${dates[i]}-${dates[j]}`; // replace the first date with the range
      dates.splice(i + 1, j - i); // delete all the other dates in the range
    }
  }
  return dates;
}

function isSequential(date1, date2) {
  return (new Date(date2).getTime() - new Date(date1).getTime()) == (24 * 60 * 60 * 1000);
}
