const types = ['weekend', 'weekday'];
const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

// Use the following instead of Date.toLocaleDateString() due to performance issues on Safari
const toLocaleDateString = date => `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

/**
 * Parses the custom date, filling in any missing information using currentDate
 * since that is the only date that will eventually be compared against
 * @param {string} date the custom date to be parsed in the format m/d/yyyy or m/d or d
 * @param {Date} currentDate today's date (or whichever date is being tested)
 * @returns {Date}
 */
function parseDate(date, currentDate) {
  let parsedDate = new Date(currentDate);
  const dayIndex = daysOfWeek.indexOf(date);
  const monthIndex = months.indexOf(date);
  if (date === '*') { // matches everything, so returning currentDate guarantees a match
  }
  else if (dayIndex > -1) { // return date of selected day of week in currentDate's week
    const dayDifference = dayIndex - currentDate.getDay();
    parsedDate.setDate(parsedDate.getDate() + dayDifference);
  }
  else if (monthIndex > -1) { // return date of selected month in currentDate's year
    parsedDate.setMonth(monthIndex);
  }
  else {
    let [month, day, year] = toLocaleDateString(currentDate).split('/');
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
  date1 = new Date(toLocaleDateString(date1)).getTime();
  date2 = new Date(toLocaleDateString(date2)).getTime();
  return date1 === date2;
}

function isNthDay(date, condition) {
  const [year, month] = [date.getFullYear(), date.getMonth()]
  const [index, keywords] = condition.split(' ');

  // using date as 0 gets the last day of the previos month
  const lastDay = new Date(year, month + 1, 0).getDate();

  if (index === 'last') {
    for (let i = lastDay; i >= 1; i--) {
      const date2 = new Date(year, month, i);
      if (processOr(date2, keywords)) {
        return isSameDay(date2, date);
      }
    }
  } else {
    const num = parseInt(index, 10);
    for (let i = 1, j = 0; i <= lastDay; i++) {
      const date2 = new Date(year, month, i);
      if (processOr(date2, keywords)) {
        j++;
        if (j === num) {
          return isSameDay(date2, date);
        }
      }
    }
  }
  return false;
}

/**
 * Tests if the date is within the specified range
 * @param {Date} date 
 * @param {string} range 
 * @returns {boolean}
 */
function inRange(date, range) {
  // set date to be the beginning of the day to stay within the range in case it is equal to the end date (date2)
  date = new Date(toLocaleDateString(date));

  const hyphen = range.indexOf('-');
  const date1 = parseDate(range.substring(0, hyphen), date).getTime();
  const date2 = parseDate(range.substring(hyphen + 1), date).getTime();
  return (date1 <= date.getTime()) && (date.getTime() <= date2);
}

function isSelected(date, condition) {
  let selected = false;
  if (condition.includes('-')) { // test for range
    selected = inRange(date, condition);
  } else if (condition.search(/(\d+(st|nd|rd|th))|(last)/) > -1) {
    selected = isNthDay(date, condition);
  } else { // test dates and keywords
    selected = isSameDay(parseDate(condition, date), date);
  }
  return selected;
}

function processNot(date, selector) {
  if (selector[0] === '!') {
    return !isSelected(date, selector.substring(1));
  }
  return isSelected(date, selector);
}

function processOr(date, selector) {
  const conditions = selector.split('|');
  for (let condition of conditions) {
    if (processNot(date, condition)) {
      return true;
    }
  }
  return false;
}

function processAnd(date, selector) {
  const conditions = selector.split('&');
  for (const condition of conditions) {
    if (!processOr(date, condition)) {
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
  for (let selector of selectors) {
    const keywords = [...types, ...daysOfWeek, ...months].join(')|(?:');
    const keywordsRegex = new RegExp(`((?:${keywords}))s?`, 'g')
    selector = selector
      .replace(/\s/g, '') // remove all whitespace
      .toLowerCase()
      .replace(keywordsRegex, '$1') // remove optional 's' at the end of keywords
      .replace(/(weekend)|(!weekday)/g, 'saturday|sunday')
      .replace(/(!weekend)|(weekday)/g, 'monday|tuesday|wednesday|thursday|friday')
      .replace(/(\d+(st|nd|rd|th))|(last)/g, '$& '); // add space after 'nth'

    if (processAnd(date, selector)) {
      return true;
    }
  }
  return false;
}

export default testDate;
