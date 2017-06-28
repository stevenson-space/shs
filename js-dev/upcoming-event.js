$(function() {
  var getEvent = function(date) {
    var dateString = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
  	if(constants.latearrival.indexOf(dateString) > -1) return "Late Arrival";
  	if(constants.activityperiod.indexOf(dateString) > -1) return "Activity Period";
  	if(constants.pmassembly.indexOf(dateString) > -1) return "PM Assembly";
  	if(constants.finals.indexOf(dateString) > -1) return "Finals";
  	if(constants.holidays.indexOf(dateString) > -1) return "No School";
  	return "";
  }

  var events = constants.latearrival.concat(constants.activityperiod).concat(constants.pmassembly)
    .concat(constants.finals).concat(constants.holidays);
  console.log(events);
  var today = new Date();
  var upcoming = new Date(today.getFullYear() + 1000, 0);
  events.forEach(function(item) {
    var date = item.split('/').map(parseFloat);
    date = new Date(date[2], date[0] - 1, date[1]);
    if(date.getTime() > today.getTime() && date.getTime() < upcoming.getTime()) {
      upcoming = date;
    }
  });

  if(upcoming.getFullYear() != today.getFullYear() + 1000) {
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    $("#upcoming-event").text(getEvent(upcoming));
    $("#upcoming-event-date").text((upcoming.getFullYear() == today.getFullYear() && upcoming.getMonth() == today.getMonth()
      && upcoming.getDate() == today.getDate() + 1)? "Tomorrow" : months[upcoming.getMonth()] + " " + upcoming.getDate());
  }
});
