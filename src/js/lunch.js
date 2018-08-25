import lunch from 'src/data/lunch.json';

const lunchNames = ['Comfort Food', 'Mindful', 'Sides', 'Soups'];

function getLunch(date) {
  // get the number of days since epoch time
  const minutesSinceEpoch = (date.getTime() / 1000 / 60) - date.getTimezoneOffset();
  const daysSinceEpoch = Math.floor(minutesSinceEpoch / 60 / 24);

  // lunch schedule repeats every 28 days, so get the corresponding day in the 28-day cycle
  const lunches = lunch[String(daysSinceEpoch % 28)];

  // If date is a weekend, lunches will be undefined
  if (lunches) {
    // format the lunch to make it easier to display later
    const formattedLunch = {};
    lunchNames.forEach((name, i) => {
      // lunches[i] could be a string containing multiple items separated by a comma
      formattedLunch[name] = lunches[i].split(',').map(str => str.trim());
    });

    return formattedLunch;
  }

  return null;
}

export default getLunch;