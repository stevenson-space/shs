const fs = require("fs");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const oldLunch = require("../src/data/lunch.json");

const url = "https://www.d125.org/student-life/food-services/latest-menu";

main();

async function main() {
	const { lunch, numLunches } = await scrapeLunches();

	// replace values in oldLunch with new ones from lunchObject
	// (not just using lunchObject directly in case lunchObject is missing certain dates)
	const newLunch = { ...oldLunch };
	for (const [key, value] of Object.entries(lunch)) {
		newLunch[key] = value;
	}

	saveLunch(newLunch);
	printMissingLunches(lunch, numLunches);
}

// calculates the number of days since epoch time
const toDays = date =>
	parseInt((date.getTime() / 1000 / 60 - date.getTimezoneOffset()) / 60 / 24);

var numbers = [];
for (var i = 31; i >= 0; i--) {
	numbers.push(i)
}

async function scrapeLunches() {
	try {
		const response = await axios.get(url);
		const lunchObject = {};
		let numLunches = 0;

		const dom = new JSDOM(String(response.data));
		for (var x of dom.window.document.querySelectorAll("h5")) {
			var dateText = x.textContent
			var lunchesText = x.nextSibling.nextSibling.textContent
			dateText = dateText.substring(0, dateText.indexOf(" ")) + "," + dateText.substring(dateText.indexOf(" "))
			console.log(dateText)
			// we only want to attempt parsing the lunch if the text actually contains lunch items
			// (sometime's it's empty on no school days or contains text such as "Chef's Choice" or "Breakfast all day")
			if (lunchesText.match(/Comfort Food/i)) {
				numLunches++;
				const date = parseDate(dateText);

				// set the respective date on cycle of 28 days to the lunch
				lunchObject[String(toDays(date) % 28)] = processLunches(
					lunchesText
				);
			} else {
				console.log(
					`warning: skipping the day "${dateText}" due to invalid lunch text: "${lunchesText}"`
				);
			}

		}
		return { lunch: lunchObject, numLunches };
	} catch (err) {
		exitWithError(`Request to "${url}" failed because:\n${err}`);
	}
}

// parses date from string formatted like "Thursday, Nov. 14 - Late Arrival"
function parseDate(dateText) {
	const longMonths = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	];

	var month = "";
	for (var m of longMonths) {
		if (dateText.includes(m)) {
			month = m;
			break;
		}
	}

	for (var x of numbers) {
		if (dateText.includes(x)) {
			console.log("month:" + month + " day: " + x)
			return new Date(`${month} ${x}, 2021`);
		}
	}

}

// Converts this:
// "Comfort Food: Roasted Turkey Breast Plate
// Sides: Brussel Sprouts, Mashed Sweet Potatoes
// ..."

// to this:
// {
//   "Comfort Food": ["Roasted Turkey Breast Plate"],
//   "Sides": ["Brussel Sprouts", "Mashed Sweet Potatoes"]
// }
function processLunches(lunchesText) {
	const lunches = {};
	lunchesText.split("\n").forEach(lunchItem => {
		const [lunchType, lunch] = lunchItem.split(":");
		lunches[lunchType] = lunch.split(",").map(x => x.trim());
	});
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
