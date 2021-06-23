import lunches from '@/data/lunch.json';

function getLunch(date) {
  // get the number of days since epoch time
  const minutesSinceEpoch = (date.getTime() / 1000 / 60) - date.getTimezoneOffset();
  const daysSinceEpoch = Math.floor(minutesSinceEpoch / 60 / 24);

  // lunch schedule repeats every 28 days, so get the corresponding day in the 28-day cycle
  const lunch = lunches[String(daysSinceEpoch % 28)];

  // If date is a weekend, lunch will be undefined
  if (lunch) {
    return lunch;
  }

  return null;
}

export default getLunch;
