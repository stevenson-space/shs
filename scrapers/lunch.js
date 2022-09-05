const fs = require("fs");
const path = require("path");
const oldLunch = require("../src/data/lunch.json");

// calculates the number of days since epoch time
const toDays = date =>
  parseInt((date.getTime() / 1000 / 60 - date.getTimezoneOffset()) / 60 / 24);

main();

// https://sebhastian.com/javascript-csv-to-array/
function csvToArray(str, delimiter = ",") {
  const headers = str.slice(0, str.indexOf("\n")).split(delimiter);

  const rows = str.slice(str.indexOf("\n") + 1).split("\n");

  const replaceAllCommas = (str) => {
    let copy = str; 
    while(copy.includes('%COMMA%')){
      copy = copy.replace("%COMMA%", ',');;
    }
    return copy
  }

  const arr = rows.map(function (row) {
    const values = row.split(delimiter);
    const el = headers.reduce(function (object, header, index) {
      if(['Comfort Food', 'Mindful', 'Sides', 'International Station', 'Soup', 'Paninis', 'Day Number'].includes(header)){
        object[header] = replaceAllCommas(values[index]).split(',');
      }
      return object;
    }, {});
    return el;
  });
  // return the array
  return arr;
}

async function parseLunchTable() {
  var data = fs.readFileSync(__dirname + '/lunchData.csv', 'utf8');
  // rows = data.split("\n");

  const lunchObject = {};

  
  csvToArray(data).forEach((menu, index) => {
    lunchObject[menu['Day Number'][0]] = menu;
    delete menu['Day Number']
  })
  return { lunch: lunchObject, numLunches: data.split("\n").length -1 }; // subtract the 1 from the length because it's the header

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
        const cyclicDay = String(toDays(date) % 29);
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
