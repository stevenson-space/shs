function getLunch(date)
{
  //Get today's date if date is not specified
  date = date || getCurrentDate();
  //Add up every day in the year from January 2017 up to the specified date
  var days = date.getDate();
  for(var i = 0; i < 12 * (date.getFullYear() - 2017) + date.getMonth(); i++)
    days += parseInt(constants.daysInMonth[i % 12]);
  //Lunch schedule repeats every 28 days, so get the day out of 28 and return the corresponding lunch
  return constants.lunches[days % 28 + ""];
}

function getLunchString(date)
{
  var lunchMenu = getLunch(date);
  var lunchString = "";
  for(var lunchItem of lunchMenu)
    lunchString += lunchItem + "\n";
  return lunchString;
}
