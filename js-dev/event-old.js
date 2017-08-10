$(function()
{
    //Get the next upcoming event from a given
    var getEvent = function(date)
    {
        var dateString = date.toLocaleDateString();

        //If there is a specific event for this date, return that
        var index = constants.calendar_events.indexOf(dateString);
        if (index > -1) return constants.calendar_event_names[index];


        /*if (constants.latearrival.indexOf(dateString) > -1) return "Late Arrival";
        if (constants.activityperiod.indexOf(dateString) > -1) return "Activity Period";
        if (constants.pmassembly.indexOf(dateString) > -1) return "PM Assembly";
        if (constants.finals.indexOf(dateString) > -1) return "Finals";*/

        //Otherwise check to see if it's a holiday
        if (constants.holidays.indexOf(dateString) > -1) return "No School";
        
        //If neither, return null
        return null;
    }
    

    var events = constants.latearrival.concat(constants.activityperiod).concat(constants.pmassembly)
        .concat(constants.finals).concat(constants.holidays).concat(constants.calendar_events);
    var today = new Date();
    var upcoming = new Date(today.getFullYear() + 1000, 0);
    events.forEach(function(item)
    {
        var date = item.split('/').map(parseFloat);
        date = new Date(date[2], date[0] - 1, date[1]);
        if (date.getTime() > today.getTime() && date.getTime() < upcoming.getTime())
        {
            upcoming = date;
        }
    });

    if (upcoming.getFullYear() != today.getFullYear() + 1000)
    {
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var eventString = "";
        eventString += getEvent(upcoming) + " ";
        //$("#upcoming-event").text(getEvent(upcoming));
        //$("#upcoming-event-date").text((upcoming.getFullYear() == today.getFullYear() && upcoming.getMonth() == today.getMonth()
        //&& upcoming.getDate() == today.getDate() + 1)? "Tomorrow" : months[upcoming.getMonth()] + " " + upcoming.getDate());

        eventString += (upcoming.getFullYear() == today.getFullYear() && upcoming.getMonth() == today.getMonth() &&
            upcoming.getDate() == today.getDate() + 1) ? "tomorrow" : months[upcoming.getMonth()] + " " + upcoming.getDate()

        $('#upcoming-event-text').text(eventString);

        console.log(eventString);

    }
});