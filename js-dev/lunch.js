function getLunch(date)
{
  // Get today's date if date is not specified
  date = date || getCurrentDate();

  // calculates the number of days since epoch time
  var toDays = date => parseInt((date.getTime() / 1000 / 60 - date.getTimezoneOffset()) / 60 / 24);

  var days = toDays(date);

  // Lunch schedule repeats every 28 days, so get the day out of 28 and return the corresponding lunch
  return constants.lunches[String(days % 28)];
}

function getLunchString(date)
{
  var lunchMenu = getLunch(date);
  var lunchString = "";

  //for(var lunchItem of lunchMenu)
   // lunchString += lunchItem + "\n";

   for(var i = 0; i < lunchMenu.length; i++)
   {
     lunchString += lunchMenu[i] + "\n";
   }
 

  return lunchString;
}
