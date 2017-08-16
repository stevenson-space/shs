/**
 * Event.js
 * Provides N events that are not the current day's schedule
 */


function getEvent(date)
{


    var todayString = new Date().toLocaleDateString();
    var dateString = date.toLocaleDateString();

    //Possible events if the date is not today are calendar events or holidays
    if(todayString == dateString)
    {
        var index = constants.calendar_events.indexOf(dateString);
        if (index > -1) return constants.calendar_event_names[index];
        if (constants.holidays.indexOf(dateString) > -1) return "No school";
    }
    else
    {
      if (constants.latearrival.indexOf(dateString) > -1) return "Late Arrival";
      if (constants.activityperiod.indexOf(dateString) > -1) return "Activity Period";
      if (constants.pmassembly.indexOf(dateString) > -1) return "PM Assembly";
      if (constants.finals.indexOf(dateString) > -1) return "Finals";
    }
    
    return null;
}
  
function getNextEvents()
{
  var events = []

  var date = new Date();
  for(var i = 0; i < 3; i++)
  {
      var event = getEvent(date);
      while(event == null)
      {
        date.setDate(date.getDate() + 1);
        event = getEvent(date);
      }
      events.push(event + " - " + date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }));
      date.setDate(date.getDate() + 1);
  }

  return events;

}