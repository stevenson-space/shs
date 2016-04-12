var today;
var minutes;
$(function() { main(); });
$(document).on("scrollstop", function() { main(); });
$(document).focus(function() { main(); });
function main()
{
	today = new Date();
	minutes = today.getHours()*60 + today.getMinutes();


	var sdow = ["8.25.2015", "9.1.2015", "9.9.2015", "9.16.2015", "9.22.2015", "9.29.2015", "10.6.2015", "10.14.2015", "10.20.2015", "10.27.2015",
	"11.3.2015", "11.10.2015", "11.17.2015", "11.24.2015", "12.1.2015", "12.8.2015", "12.15.2015", "1.5.2016", "1.26.2016", "2.2.2016",
	"2.17.2016", "2.23.2016", "3.1.2016", "3.9.2016", "3.15.2016", "3.22.2016", "4.5.2016", "4.12.2016", "4.19.2016", "4.26.2016", "5.3.2016",
	"5.10.2016", "5.17.2016", "5.24.2016"];

	var latearriv = ["8.27.2015", "12.10.2015", "9.3.2015", "9.11.2015", "9.17.2015", "10.22.2015", "11.19.2015", "1.28.2016", "2.18.2016", "3.17.2016", "4.21.2016"];
	var actper = [];
	var pmasm = [];
	var holidays = ["4.1.2016"]
	var date = (today.getMonth() + 1) + "." + today.getDate() + "." + today.getFullYear();

	var display = {};

	if(!(today.getDay() % 6) || holidays.indexOf(date) != -1)
	{
		display.schedule = "No school";
		display.period = "";
		while(!(today.getDay() % 6) || holidays.indexOf(date) != -1) today.setDate(today.getDate()+1);
		display.range = "School resumes: " + (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
		display.end = false;
	}
	else if(sdow.indexOf(date) != -1)
	{
		display.schedule = "SDOW";
		var periodData = getPeriod([515,569,618,667,697,722,752,777,807,832,881], [564,613,662,687,717,742,772,797,827,876,925], ['1','2','3','4A','4B','5A','5B','6A','6B','7','8']);
		display.period = periodData.period;
		display.end = periodData.end;
		display.range = periodData.range;
		
	}
	else if(latearriv.indexOf(date) != -1)
	{
		display.schedule = "Late Arrival";
		var periodData = getPeriod([630,670,705,740,780,820,860,895], [665,700,735,775,815,855,890,925], ['1','2','3','4','5','6','7','8']);
		display.period = periodData.period;
		display.end = periodData.end;
		display.range = periodData.range;
		
	}
	else if(actper.indexOf(date) != -1)
	{
		display.schedule = "Activity Period";
		var periodData = getPeriod([485,535,580,630,675,705,730,760,785,815,840,885], [530,575,625,670,695,725,750,780,805,835,880,925], ['1','2','Activity','3','4A','4B','5A','5B','6A','6B','7','8']);
		display.period = periodData.period;
		display.end = periodData.end;
		display.range = periodData.range;
	}
	else if(pmasm.indexOf(date) != -1)
	{
		display.schedule = "PM Assembly";
		var periodData = getPeriod([],[],[]);
		display.period = periodData.period;
		display.end = periodData.end;
		display.range = periodData.range;
	}
	else
	{
		display.schedule = "Standard Schedule";
		var periodData = getPeriod([485,545,600,655,685,710,740,765,795,820,875],[540,595,650,675,705,730,760,785,815,870,925],['1','2','3','4A','4B','5A','5B','6A','6B','7','8']);
		display.period = periodData.period;
		display.end = periodData.end;
		display.range = periodData.range;
	}
	
	$("#range").text(display.range);
	$("#schedule").text(display.schedule);
	$("#period").text(display.period);
 	
 	var secondsLeft = (display.end - minutes - 1) * 60 + (60 - today.getSeconds());
 	var seconds;
 	var countdown = function(){
 	 	seconds = secondsLeft % 60;
 		$("#timer").text(Math.floor(secondsLeft / 60) + ":" + (seconds < 10 ? "0" + seconds : seconds));
		if(secondsLeft <= 0)
		{
			clearInterval(timer);
			$("#timer").text("");
			main();		
		}
 		secondsLeft--;
 	}
 	if(display.end) 
 	{
 			var timer = setInterval(countdown, 1000);
 			countdown();
 	}
}

function getPeriod(starts, ends, periods)
{
	if(minutes < starts[0] || minutes >= ends[ends.length - 1]) return {period: "None", end: false, range: ""}
	var last;
	for(var i = 0; i < starts.length; i++)
	{
		if(minutes >= starts[i])
		{
			last = i
	    	if(minutes < ends[i])
			{
				return  { period: "Period " + periods[i], end: ends[i], range: toHours(starts[i]) + "-" + toHours(ends[i]) }
			}
		}
	}

	return { period: "Passing", end: starts[last+1], range: "Next: " + toHours(starts[last+1]) + "-" + toHours(ends[last+1])}
}

function toHours(minutes)
{
	var hours = Math.floor(minutes / 60);
	if(hours > 12) hours -= 12;
	var minutes = minutes % 60;
	if(minutes < 10) minutes = "0" + minutes;
	return hours + ":" + minutes;
}