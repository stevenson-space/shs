var calendar = {};

$(function() {
	setDays();
	showMonth();
});

function showMonth(month, year) {
	//Get all dates and events in specified month
	var today = new Date();
	month = (month === undefined)? today.getMonth() : month;
	year = (year === undefined)? today.getFullYear() : year;
	var date = new Date(year, month);
	var dates = [];
	for(var i = 1; i <= constants.daysInMonth[date.getMonth()]; i++) {
		date.setDate(i);
		if(!(date.getDay() % 6)) continue; //skips weekends
		dates.push({
			date: i,
			day: date.getDay(),
			event: getEvent(date)
		});
	}

	//Show dates and events on calendar
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	$("#tile-cal-header .month").text(months[month] + " " + year);
	$(".tile-cal").html("");
	var start = dates[0].day - 1;
	for(i = 0; i < dates.length; i++) {
		$(".tile-cal:eq(" + (i + start) + ")").html("<div class='date'><span" +
			((year == today.getFullYear() && month == today.getMonth() && dates[i].date == today.getDate())? " class='today'>" : ">") +
			dates[i].date + "</span></div><div class='event'>" + dates[i].event + "</div>");
	}

	calendar.month = month;
	calendar.year = year;
}

function getEvent(date) {
	var dateString = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
	if(constants.latearrival.indexOf(dateString) > -1) return "Late Arrival";
	if(constants.activityperiod.indexOf(dateString) > -1) return "Activity Period";
	if(constants.pmassembly.indexOf(dateString) > -1) return "PM Assembly";
	if(constants.finals.indexOf(dateString) > -1) return "Finals";
	if(constants.holidays.indexOf(dateString) > -1) return "No School";
	return "";
}

function next() {
	if(calendar.month >= 11){
		showMonth(0, calendar.year + 1);
	} else {
		showMonth(calendar.month + 1, calendar.year);
	}
}

function previous() {
	if(calendar.month <= 0){
		showMonth(11, calendar.year - 1);
	} else {
		showMonth(calendar.month - 1, calendar.year);
	}
}
$("#next").click(next);
$("#previous").click(previous);
$(document).keydown(function(e) {
	switch (e.which) {
		case 37:
			previous()
			break;
		case 39:
			next()
	}
})

//If width is less than min tablet size, days are shortened to first 3 letters
function setDays() {
	var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
	$(".tile-cal-head").each(function(index) {
		var day = (window.innerWidth < 768)? days[index].substr(0, 3) : days[index];
		$(this).text(day);
	})
}

$(window).resize(setDays);
