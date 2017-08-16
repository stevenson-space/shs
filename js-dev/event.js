//Returns any special "event" given a date
//Events are either coded events or holidays
function getEvent(date)
{
    var dateString = date.toLocaleDateString();

    //If there is a specific event for this date, return that
    var index = constants.calendar_events.indexOf(dateString);
    if (index > -1) return constants.calendar_event_names[index];

    if (constants.latearrival.indexOf(dateString) > -1) return "Late Arrival";
    if (constants.activityperiod.indexOf(dateString) > -1) return "Activity Period";
    if (constants.pmassembly.indexOf(dateString) > -1) return "PM Assembly";
    if (constants.finals.indexOf(dateString) > -1) return "Finals";

    //Otherwise check to see if it's a holiday
    if (constants.holidays.indexOf(dateString) > -1) return "No school";
    
    //If neither, return null
    return null;
}
  
function getNextEvent(date)
{
  var date = new Date(date);
  date.setDate(date.getDate() + 1);
  var event = getEvent(date);
  while(event == null)
  {
    date.setDate(date.getDate() + 1);
    event = getEvent(date);
  }
  var string;
  if(date == new Date())
    string = event + " today";
  else
    string = event + " " + date.toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric'});
  return {event: event, date: date, string: string};
}

function getNextEvents(amount)
{

}

var nextEvents = [];

$(function()
{
  d = new Date();
  nextEvents.push(getNextEvent(d));
  nextEvents.push(getNextEvent(nextEvents[0].date));
  nextEvents.push(getNextEvent(nextEvents[1].date));
})