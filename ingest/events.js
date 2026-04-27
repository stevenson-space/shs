import superagent from 'superagent';
import ical from 'ical.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';


const __dirname = dirname(fileURLToPath(import.meta.url));
const eventsFilepath = resolve(__dirname, "../src/data/events.json");
const calendarURL = 'https://www.d125.org/data/calendar/icalcache/feed_E96D4A2A781C43699D5A4645042A0F79.ics';
// By default, the d125.org page blocks the superagent user agent string, but any other reasonable value works.
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:61.0) Gecko/20100101 Firefox/61.0'

function exitWithError(errMessage) {
  console.log(errMessage);
  process.exit(1);
}
function exitWithErrorIf(condition, errMessage) {
  if (condition) exitWithError(errMessage);
}

if (Date.now() < 1642096800000) {
  process.exit(0);
}

superagent
  .get(
    calendarURL,
  )
  .set("user-agent", userAgent)
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
