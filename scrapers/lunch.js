const fs = require("fs");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");

const oldLunch = require("../src/data/lunch.json");

const url = "https://www.d125.org/students/food-servicelunch-menu/latest-menu";
const today = new Date();

if (today.getFullYear() > 2020) {
	main();
}

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

async function scrapeLunches() {
	try {
		const response = await axios.get(url);
		const lunchObject = {};
		let numLunches = 0;

		// cheerio works basically like jQuery
		const $ = cheerio.load(response.data);
		$(
			"#fsPageContent .fsPageLayout .fsPanelGroup .fsElementContent section.fsElement"
		).each(function() {
			const lunchesText = $(this)
				.children(".fsElementContent")
				.text()
				.trim();
			const dateText = $(this)
				.children("header")
				.text()
				.trim();

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
		});

		return { lunch: lunchObject, numLunches };
	} catch (err) {
		exitWithError(`Request to "${url}" failed because:\n${err}`);
	}
}

// parses date from string formatted like "Thursday, Nov. 14 - Late Arrival"
function parseDate(dateText) {
	// remove any text that is in parentheses
	dateText = dateText.replace(/\(.*?\)/g, "");

	// normalize separators (d125 sometimes uses hyphens, other times commas)
	dateText = dateText.replace(/-/g, ",");
	console.log(dateText);
	// replace a comma after the month with a period ('Thursday, Jan, 16' --> 'Thursday, Jan 16')
	dateText = dateText.replace(/\,(\s[0-9])/gm, ".$1"); // replace with period and retain rest of capturing group

	// get rid of any other text ('Monday, Aug 12 , First Day of School' -> 'Monday, Aug 12')
	dateText = dateText
		.split(",")
		.slice(0, 2)
		.join(",")
		.trim();

	// remove day of week and add year ('Monday, Aug 12' -> 'Aug 12 2019')
	dateText = `${dateText
		.slice(dateText.indexOf(",") + 1)
		.trim()} ${today.getFullYear()}`;

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

	const months = [
		"jan",
		"feb",
		"mar",
		"apr",
		"may",
		"jun",
		"jul",
		"aug",
		"sep",
		"oct",
		"nov",
		"dec"
	];

	// replace long instances of month names to short onces
	for (let i = 0; i < longMonths.length; i++)
		dateText = dateText.replace(longMonths[i], months[i]);

	exitWithErrorIf(
		!dateText.match(
			new RegExp(`^(${months.join("|")})\.?\\s+\\d{1,2}\\s+\\d{4}$`, "i")
		),
		`"${dateText}" failed to pass date check`
	);
	return new Date(dateText);
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
