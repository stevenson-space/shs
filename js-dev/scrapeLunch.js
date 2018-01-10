/* Node.js program */

const axios = require('axios');
const cheerio = require('cheerio');

const today = new Date();

// calculates the number of days since epoch time
const toDays = date => parseInt((date.getTime() / 1000 / 60 - date.getTimezoneOffset()) / 60 / 24);

axios.get('http://www.d125.org/students/food-service').then(response => {
  const lunchObject = {};
  let numLunches = 0;

  // cheerio works basically like jQuery
  const $ = cheerio.load(response.data);
  $('.sflistListItem.sflistitem').slice(4).each(function() {
    numLunches++;

    // parse the date from the lunch title on the website
    let dateText = $(this).children('.sftitle').text();
    dateText = dateText.slice(dateText.indexOf(',')).trim() + ' ' + today.getFullYear();
    const date = new Date(dateText);

    let lunches = $(this).children('.sfcontent').text().trim().split('  ');

    // remove the food type (Comfort Food, Mindful, ...)
    lunches = lunches.map(lunch => lunch.slice(lunch.indexOf(':') + 2));

    // set the respective date on cycle of 28 days to the lunch
    lunchObject[String(toDays(date) % 28)] = lunches;
  });

  console.log('\nCopy the following into "lunches" in const.js.\n');
  Object.keys(lunchObject).forEach(key => {
    const lunchString = `['${lunchObject[key].join("', '")}'],`;
    console.log(`'${key}': ${lunchString}`);
  });

  // the website doesn't contain all the lunches at the moment
  if (numLunches < 20) {
    // the relative days on the 28-day cycle that are missing from lunches
    const missing = [];
    // example dates to display in order to make manually filling in the lunches easier
    const exampleDates = [];
    const date = new Date();
    for (var i = 0; i < 28; i++) {
      // if day is a weekday
      if(date.getDay() % 6 !== 0) {
        // day on the 28-day cycle
        const cyclicDay = String(toDays(date) % 28);
        // if the lunch for this day does not exist
        if (!lunchObject[cyclicDay]) {
          missing.push(cyclicDay);
          exampleDates.push(date.toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'}));
        }
      }

      date.setDate(date.getDate() + 1);
    }

    console.log('\nThe website currently does not contain information for the following days on the '
      + `28-day cycle: \n - ${missing.join('\n - ')}`);
    console.log('\nPlease manually add lunch information for those days when possible.');
    console.log('Possible dates that could be used to provide the missing information are: '
      + `\n - ${exampleDates.join('\n - ')}`);
    console.log('or any other date that is obtained by adding a multiple of 28 days to the ones above.');
  }
});