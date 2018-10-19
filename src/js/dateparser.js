const types = ['weekend', 'weekday'];
const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

// Use the following instead of Date.toLocaleDateString() due to performance issues on Safari
const toLocaleDateString = date => `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

/**
 * Parses the custom date, filling in any missing information using testDate
 * since that is the only date that will eventually be compared against
 * @param {string} date the custom date to be parsed in the format m/d/yyyy or m/d or d or keyword
 * @param {Date} testDate today's date (or whichever date is being tested)
 * @returns {Date}
 */
function parseDate(date, testDate) {
  const dayIndex = daysOfWeek.indexOf(date);
  const monthIndex = months.indexOf(date);

  // Initialize parsedDate to testDate (will be modified later)
  let parsedDate = new Date(testDate);
  if (date === '*') {
    // matches everything, so we don't need to do anything since testDate (what parsedDate is initialized to)
    // is guaranteed to match against testDate
  }
  else if (dayIndex > -1) { // date is one of the days of week
    // shift the parsedDate to fall on the specified day of week in the same week
    // if testDate is on that day of week, parsedDate will match it
    const dayDifference = dayIndex - testDate.getDay();
    parsedDate.setDate(parsedDate.getDate() + dayDifference);
  }
  else if (monthIndex > -1) { // date is a month
    // shift parsedDate to fall on the specified month in the same year
    // if testDate is in that month, it will match parsedDate, since year and date remain
    parsedDate.setMonth(monthIndex);
  }
  else {
    let [month, day, year] = toLocaleDateString(testDate).split('/');
    let [m, d, y] = date.split('/');

    if (!d && m.length === 4) { // only one argument (m) is defined and is interpreted as year
      parsedDate = new Date(`${month}/${day}/${m}`);
    }
    else if (!d) { // only m is defined and is interpreted as day
      parsedDate = new Date(`${month}/${m}/${year}`);
    }
    else if (!y) { // two arguments (m, d) are defined
      parsedDate = new Date(`${m}/${d}/${year}`);
    }
    else { // all arguments are defined
      parsedDate = new Date(date);
    }
  }
  return parsedDate;
}

/**
 * Checks if two dates are the same day (not necessarily the same time)
 * @param {Date} date1 
 * @param {Date} date2 
 * @returns {boolean}
 */
function isSameDay(date1, date2) {
  // new Date(toLocaleDateString(date)) gets the date for time 0:00 on the same day
  date1 = new Date(toLocaleDateString(date1)).getTime();
  date2 = new Date(toLocaleDateString(date2)).getTime();
  return date1 === date2;
}

function isNthDay(date, condition) {
  const [year, month] = [date.getFullYear(), date.getMonth()]
  const [index, keywords] = condition.split(' ');

  // using date as 0 gets the last day of the previos month
  // so setting month to month + 1 will get the last day of the specified month
  const lastDay = new Date(year, month + 1, 0).getDate();

  if (index === 'last') {
    // Need to get the last day in the month that matches the keywords
    // Go through each day of the month starting from the end and get the first matching date
    // Determine if date matches that day
    for (let i = lastDay; i >= 1; i--) {
      const date2 = new Date(year, month, i);
      
      // Keywords could contain any of the normal operators (or, and, range, ...)
      // so need to go through each step again starting with 'or' to determine if date2 matches keywords
      if (processOr(date2, keywords)) {
        return isSameDay(date2, date);
      }
    }
  } else {
    // Strip away any extraneous letters from the index (e.g. '3rd' -> 3)
    const n = parseInt(index, 10);

    // Need to get to the nth day in month that matches keywords
    // Go through each day in the month, counting each date that matches keywords
    // When count reaches n, determine whether the date matches that day
    for (let i = 1, count = 0; i <= lastDay; i++) {
      const date2 = new Date(year, month, i);

      // keywords could contain any of the normal operators (or, and, range, ...)
      // so need to go through each step again starting with 'or' to determine if date2 matches keywords
      if (processOr(date2, keywords)) {
        count++;
        if (count === n) {
          return isSameDay(date2, date);
        }
      }
    }
  }

  return false;
}

/**
 * Tests if the date is within the specified range (inclusive)
 * @param {Date} date 
 * @param {string} range 
 * @returns {boolean}
 */
function inRange(date, range) {
  // set date to be the beginning of the day to ignore the time and only consider the date
  date = new Date(toLocaleDateString(date));

  // get the date in milliseconds for the days on either side of the range symbol (hyphen)
  const hyphen = range.indexOf('-');
  const date1 = parseDate(range.substring(0, hyphen), date).getTime();
  const date2 = parseDate(range.substring(hyphen + 1), date).getTime();

  // return whether the given date falls between the two dates
  return (date1 <= date.getTime()) && (date.getTime() <= date2);
}

function isSelected(date, condition) {
  // determines which type of condition and uses the appropriate function to determine
  // if the given date is selected by the condition
  let selected = false;
  if (condition.includes('-')) { // test for range
    selected = inRange(date, condition);
  } else if (condition.search(/(\d+(st|nd|rd|th))|(last)/) > -1) { // tests for nth day in month
    selected = isNthDay(date, condition);
  } else { // test dates and keywords
    // parseDate will return a date that matches condition and is as close as possible to the specified date
    // if the specified date matches condition, parsedDate should be the same date
    const parsedDate = parseDate(condition, date);
    selected = isSameDay(parsedDate, date);
  }
  return selected;
}

function processNot(date, selector) {
  // if selector prepended by !, removes the ! and inverts the result
  if (selector[0] === '!') {
    return !isSelected(date, selector.substring(1));
  }
  // otherwies does nothing and moves on to the next step, isSelected
  return isSelected(date, selector);
}

function processOr(date, selector) {
  // checks if date matches any of the conditions split by |
  const conditions = selector.split('|');
  for (let condition of conditions) {
    // processNot will then handle any !s
    if (processNot(date, condition)) {
      // short circuits after first condition that matches date
      return true;
    }
  }
  return false;
}

function processAnd(date, selector) {
  // checks if date matches all the conditions split by &
  const conditions = selector.split('&');
  for (const condition of conditions) {
    // processOr is the next step and will handle any |s
    if (!processOr(date, condition)) {
      // short circuits after the first condition that is not met by date
      return false;
    }
  }
  return true;
}

/**
 * Tests whether the date matches any of the selectors
 * @param {Date} date
 * @param {Array} selectors
 * @returns {boolean}
 */
function testDate(date, selectors) {
  // Goes through each selector and determines whether date matches any of them
  for (let selector of selectors) {
    const keywords = [...types, ...daysOfWeek, ...months].join(')|(?:');
    const keywordsRegex = new RegExp(`((?:${keywords}))s?`, 'g')
    selector = selector
      .replace(/\s/g, '') // remove all whitespace
      .toLowerCase()
      .replace(keywordsRegex, '$1') // remove optional 's' at the end of keywords
      .replace(/(weekend)|(!weekday)/g, 'saturday|sunday')
      .replace(/(!weekend)|(weekday)/g, 'monday|tuesday|wednesday|thursday|friday')
      .replace(/(\d+(st|nd|rd|th))|(last)/g, '$& '); // add space after 'nth' (removed it in first replace)

    // processAnd is the first step and will handle any &s
    if (processAnd(date, selector)) {
      // short circuits after the first selector that matches date
      return true;
    }
  }
  return false;
}

export default testDate;
