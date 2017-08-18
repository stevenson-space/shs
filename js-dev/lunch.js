function getLunch(date)
{
  //Get today's date if date is not specified
  var day = new Date(date || Date.now());
  //Add up every day in the year up to the specified date
  var days = day.getDate();
  for(var i = 0; i < day.getMonth(); i++)
    days += parseInt(constants.daysInMonth[i]);
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
