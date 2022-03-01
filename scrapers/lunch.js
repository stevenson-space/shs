const fs = require("fs");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");
const oldLunch = require("../src/data/lunch.json");
const pdf = require('pdf-parse');

// calculates the number of days since epoch time
const toDays = date =>
  parseInt((date.getTime() / 1000 / 60 - date.getTimezoneOffset()) / 60 / 24);

// TODO: disabling for now since lunch is not available at https://www.d125.org/student-life/food-services/latest-menu anymore
// Reenable when lunch is available on the website again, or write parser for PDF linked on https://www.d125.org/student-life/food-services
main();

async function parseLunchTable() {
  var data = fs.readFileSync(__dirname + '/lunchData.csv', 'utf8');
  rows = data.split("\n");
  var parsedData = rows.map(function (row) {
    return (row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g));
  });
  for (var i = 0; i < parsedData.length; i++) {
    if (parsedData[i] == null) {
      parsedData.splice(i, 1);
    } else {
      parsedData[i] = parsedData[i].map(e => e.replace(/"/g, '')).filter(function (x) {
        return x != '';
      });
    }
  }
  data = parsedData

  const lunchObject = {};
  var dates = [];
  var lunchText = [];

  for (var i = 0; i < data.length; i++) { //for every row
    for (var j = 0; j < data[i].length; j++) { //for every column in row
      if (i % 2 == 0) { //if it's the dates row
        dates.push(getDateInfo(data[i][j]).day)
      } else { // the menu row/
        lunchText.push(data[i][j])
      }
    }
  }
  lunchText = lunchText.map(function(e,i){
    const internationalMenus = ["Burrito Bowl", "Mac & Cheese", "Mediterranean Week 🥙", "Pasta Week 🍝","Pasta Week 🍝"];
    var date = dates[i];
    // get week of month
    var week = Math.floor((date - 0) / 7);
    if(e.includes("Comfort Food")){
      return `International Station: ${internationalMenus[week]}` + e
    }
    return e
  })
  // lunchText.forEach(e => console.log("test", e))

  lunchText.forEach((lunch, index) => {
    var lunchData = processLunches(lunch);
    var keys = Object.keys(lunchData).reverse()
    var newLunchData = {};
    keys.forEach(x => newLunchData[x] = lunchData[x]);
    lunchData = newLunchData
    if (Object.keys(lunchData).length > 0) {
      const date = new Date();
      date.setDate(dates[index])
      // set the respective date on cycle of 28 days to the lunch
      lunchObject[String(toDays(date) % 28)] = lunchData
    }
  })
  return { lunch: lunchObject, numLunches: dates.length };

}

//THIS IS A WIP
// parsePDF();
async function parsePDF() {

  let dataBuffer = fs.readFileSync('./menu.pdf');

  pdf(dataBuffer).then(function (data) {

    const categories = ["Comfort Food", "Mindful", "Sides", "Soup"];
    let lunchData = [];
    let temp = [];
    const containsCategory = function (e) {
      for (var x of categories) {
        if (e.includes(x)) {
          return true
        }
      }
      return false
    }
    data.text.split("\n").forEach(e => {
      if (e.includes("Comfort Food")) {
        lunchData.push(temp);
        temp = [];
      } else if (!containsCategory(e)) {
        console.log(e)
        var x = temp[temp.length > 0 ? temp.length - 1 : 0]
        temp[temp.length > 0 ? temp.length - 1 : 0] = ((x == undefined ? "Comfort Food:" : x) + " " + e).trim();

      } else {
        temp.push(e);
      }
    })
    console.log(lunchData)
  });

}
async function main() {
  const { lunch, numLunches } = await parseLunchTable();
  // replace values in oldLunch with new ones from lunchObject
  const newLunch = { ...oldLunch };
  for (const [key, value] of Object.entries(lunch)) {
    // if the old lunch has any extra properties (i.e. "International Station"), keep those and only replace the others
    newLunch[key] = { ...oldLunch[key], ...value };
  }
  saveLunch(newLunch);
  printMissingLunches(lunch, numLunches);
}

// async function scrapeLunches() {
//   try {
//     const response = await axios.get(url);
//     const lunchObject = {};
//     let numLunches = 0;

//     const dom = new JSDOM(String(response.data));
//     for (var x of dom.window.document.querySelectorAll("h5")) { //all day labels have an h5 tag
//       var dateText = x.textContent
//       var lunchesText = x.nextSibling.nextSibling.textContent
//       // we only want to attempt parsing the lunch if the text actually contains lunch items
//       // (sometime's it's empty on no school days or contains text such as "Chef's Choice" or "Breakfast all day")
//       if (lunchesText.match(/Comfort Food/i)) {
//          var parsedDate = getDateInfo(dateText);
//          var month = parsedDate.month;
//          var day = parsedDate.day;
//          if (month.length > 0 &&  day > 0) {
//            numLunches++;
//            console.log(`${month} ${day}, ${new Date().getFullYear()}`)
//           const date = new Date(`${month} ${day}, ${new Date().getFullYear()}`);
//           // set the respective date on cycle of 28 days to the lunch
//           lunchObject[String(toDays(date) % 28)] = processLunches(
//             lunchesText
//           );
//         } else {
//           console.log(
//             `warning: skipping the day "${dateText}" due to invalid date text: "${dateText}"`
//           );
//         }
//       } else {
//         console.log(
//           `warning: skipping the day "${dateText}" due to invalid lunch text: "${lunchesText}"`
//         );
//       }
//     }
//     return { lunch: lunchObject, numLunches };
//   } catch (err) {
//     exitWithError(`Request to "${url}" failed because:\n${err}`);
//   }
// }

//gets month and day from string formatted like "April 5 - Late Arrival"
function getDateInfo(dateText) {
  var numbers = [];
  for (var i = 31; i >= 0; i--) {
    numbers.push(i)
  }

  for (var x of numbers) {
    if (dateText.includes(x)) {
      return { "day": x }
    }
  }
  return { "day": -1 }
}

// Converts this:
// "Comfort Food: Home Made Chicken Pot Pie Mindful: Tofu Stir Fry Sides: Lemon Pepper Green Beans, Rice Soup: Tomato Basil, Chicken Tortilla" 

// to this:
// {
//   "Comfort Food": ["Roasted Turkey Breast Plate"],
//   "Sides": ["Brussel Sprouts", "Mashed Sweet Potatoes"]
// }
function processLunches(lunchesText) {
  const categories = ["International Station","Comfort Food", "Mindful", "Sides", "Soup"];
  var lunchStr = lunchesText;
  var lunches = {};
  var areRemainingCategories = function (e) {
    for (var x of categories) {
      if (e.includes(x)) {
        return true
      }
    }
    return false
  }
  while (areRemainingCategories(lunchStr)) {
    for (var x of categories.reverse()) {
      console.log(x)
      if (lunchStr.includes(x)) {
        var menuItem = lunchStr.substring(lunchStr.indexOf(x), lunchStr.length).trim();
        console.log("menu item ", menuItem)
        var removedCategory = menuItem.replace(x, "").replace(":", "")
        lunches[x] = removedCategory.split(",").map(x => x.trim());
        lunchStr = lunchStr.replace(menuItem, "").trim();
      }
    }
    return lunches
  }
  return lunches;
}



function saveLunch(lunch) {
  fs.writeFile(
    path.join(__dirname, "..", "src", "data", "lunch.json"),
    JSON.stringify(lunch, null, 2),
    err => {
      if (err) {
        exitWithError(`Error saving file:\n${err}`);
      } else {
        console.log("Data saved to lunch.json");
      }
    }
  );
}

function printMissingLunches(lunch, numLunches) {
  console.log(`${numLunches}/20 dates found`);

  // the website doesn't contain all the lunches at the moment
  if (numLunches < 20) {
    // the relative days on the 28-day cycle that are missing from lunches
    const missing = [];
    // example dates to display in order to make manually filling in the lunches easier
    const exampleDates = [];
    const date = new Date();
    for (let i = 0; i < 28; i++) {
      // if day is a weekday
      if (date.getDay() % 6 !== 0) {
        // day on the 28-day cycle
        const cyclicDay = String(toDays(date) % 28);
        // if the lunch for this day does not exist
        if (!lunch[cyclicDay]) {
          missing.push(cyclicDay);
          exampleDates.push(
            date.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric"
            })
          );
        }
      }

      date.setDate(date.getDate() + 1);
    }

    console.log(
      "\nThe website currently does not contain information for the following days on the " +
      `28-day cycle: \n - ${missing.join("\n - ")}`
    );
    console.log(
      "\nPlease manually add lunch information for those days when possible."
    );
    console.log(
      "Possible dates that could be used to provide the missing information are: " +
      `\n - ${exampleDates.join("\n - ")}`
    );
    console.log(
      "or any other date that is obtained by adding a multiple of 28 days to the ones above.\n"
    );
  }
}

function exitWithError(errMessage) {
  console.log(errMessage);
  process.exit(1);
}
function exitWithErrorIf(condition, errMessage) {
  if (condition) exitWithError(errMessage);
}
