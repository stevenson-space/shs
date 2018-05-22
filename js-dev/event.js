/**
 * Event.js
 * Provides N events that are not the current day's schedule
 */


function getEvent(date)
{
    var todayString = getCurrentDate().toLocaleDateString();
    var dateString = date.toLocaleDateString();

    //Check holidays and calendar events first (calendar events override all other schedules)
    var index = constants.calendar_events.indexOf(dateString);
    if (index > -1) return constants.calendar_event_names[index];
    if (constants.holidays.indexOf(dateString) > -1) return "No school";

    //If the specified date is not today, search schedule dates for date and return corresponding schedule
    //We don't wan't to do this if date is today since schedule would already be displayed
    if(todayString != dateString)
      for(var schedule in constants.dates)
        if(constants.dates[schedule].indexOf(dateString) > -1)
          return schedule;

    return null;
}

function getNextEvents()
{
  var events = []

  var date = getCurrentDate();
  for(var i = 0; i < 3; i++)
  {
      var event = getEvent(date);
      while(event == null && date.getTime() - Date.now() < 365 * 24 * 60 * 60 * 1000) // within 1 year
      {
        date.setDate(date.getDate() + 1);
        event = getEvent(date);
      }
      if (event) {
        events.push(event + " - " + date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }));
        date.setDate(date.getDate() + 1);
      }
  }

  return events;

}
