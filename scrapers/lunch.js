const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const oldLunch = require('../src/data/lunch.json');

const today = new Date();

// calculates the number of days since epoch time
const toDays = date => parseInt((date.getTime() / 1000 / 60 - date.getTimezoneOffset()) / 60 / 24);

axios.get('https://www.d125.org/students/food-servicelunch-menu/latest-menu').then(response => {
  const lunchObject = {};
  let numLunches = 0;

  // cheerio works basically like jQuery
  const $ = cheerio.load(response.data);
  $('#fsPageContent .fsPageLayout .fsPanelGroup .fsElementContent section.fsElement').each(function() {
    if ($(this).text().indexOf("Chef") === -1) { // ignore the day if it is Chef's Choice
      numLunches++;

      // parse the date from the lunch title on the website
      let dateText = $(this).children('header').text().trim();
      dateText = dateText.split('-')[0].trim(); // get rid of any other text ('Monday, Aug 12 - First Day of School' -> 'Monday, Aug 12')
      dateText = dateText.slice(dateText.indexOf(',') + 1).trim() + ' ' + today.getFullYear(); // remove day of week and add year ('Monday, Aug 12' -> 'Aug 12 2019')
      const date = new Date(dateText);


      // Converts this:
      // "Comfort Food: Roasted Turkey Breast Plate
      // Sides: Brussel Sprouts, Mashed Sweet Potatoes
      // ..."
      
      // to this:
      // {
      //   "Comfort Food": ["Roasted Turkey Breast Plate"],
      //   "Sides": ["Brussel Sprouts", "Mashed Sweet Potatoes"]
      // }


      const lunchesText = $(this).children('.fsElementContent').text().trim();

      const lunches = {};

      lunchesText.split('\n').forEach(lunchItem => {
        const [lunchType, lunch] = lunchItem.split(':');
        lunches[lunchType] = lunch.split(',').map(x => x.trim());
      });

      // set the respective date on cycle of 28 days to the lunch
      lunchObject[String(toDays(date) % 28)] = lunches;
    }
  });

  // console.log(JSON.stringify(lunchObject, null, 2));

  // replace values in oldLunch with new ones from lunchObject
  // (not just using lunchObject directly in case lunchObject is missing certain dates)
  const newLunch = {...oldLunch};
  for (const [key, value] of Object.entries(lunchObject)) {
    newLunch[key] = value;
  }

  fs.writeFile(path.join(__dirname, '..', 'src', 'data', 'lunch.json'), JSON.stringify(newLunch), function(err) {
    if (err) {
      console.log('Error saving file:')
      console.log(err);
    } else {
      console.log("Data saved to lunch.json");
    }
  }); 

  console.log(`${numLunches}/20 dates found`);

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
    console.log('or any other date that is obtained by adding a multiple of 28 days to the ones above.\n');
  }
});