const superagent = require('superagent');
const ical = require('ical.js');
const fs = require('fs');
const path = require("path");

const eventsFilepath = path.resolve(__dirname, "../src/data/events.json");
const calendarURL = 'https://www.d125.org/data/calendar/icalcache/feed_AF5167036E214C99B84D252995DB9199.ics';

function exitWithError(errMessage) {
  console.log(errMessage);
  process.exit(1);
}
function exitWithErrorIf(condition, errMessage) {
  if (condition) exitWithError(errMessage);
}

process.exit(0); // TODO: temporary, until fetching events is fixed

superagent
  .get(
    calendarURL,
  )
  .then((res) => {
    const calendar = new ical.Component(ical.parse(res.text));
    const processedEvents = {};

    calendar.getAllSubcomponents().forEach((component) => {
      const event = new ical.Event(component);

      const processedEvent = {
        // isData <=> all day event
        allDay: event.startDate.isDate,
        start: event.startDate.toJSDate().getTime(),
        end: event.endDate.toJSDate().getTime(),
        name: event.summary,
        description: event.description.trim(),
        location: event.location,
        // ical.Event doesn't implement categories, so we extract it manually later
        categories: null
      };

      // allow multiple "categories" properties to capture all
      const categoryProperties = component.getAllProperties('categories');
      let categories = [];
      // categories are nested within each properties' value array
      categoryProperties.forEach(p => p.getValues().forEach(v => categories.push(v)));

      processedEvent.categories = Array.from(new Set(categories));

      const key = event.startDate.toJSDate().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });

      if (!processedEvents[key]) {
        processedEvents[key] = [];
      }
      processedEvents[key].push(processedEvent);
    });

    exitWithErrorIf(Object.keys(processedEvents).length == 0, "Fetched 0 events");

    fs.writeFile(eventsFilepath, JSON.stringify(processedEvents, null, 2), (err) => {
      if (err) console.log(err);
      else console.log('\nEvents saved.\n');
    });
  })
  .catch(err => exitWithError(`Request to "${calendarURL}" failed because:\n${err}`))
