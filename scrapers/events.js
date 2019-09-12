const superagent = require('superagent');
const ical = require('ical.js');
const fs = require('fs');
const path = require("path");


const eventsFilepath = path.resolve(__dirname, "../src/data/events.json");


superagent
  .get(
    'https://www.d125.org/data/calendar/icalcache/feed_AF5167036E214C99B84D252995DB9199.ics',
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

    fs.writeFile(eventsFilepath, JSON.stringify(processedEvents, null, 2), (err) => {
      if (err) console.log(err);
      else console.log('\nEvents saved.\n');
    });
  });
