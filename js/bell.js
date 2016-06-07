var today;
var minutes;
var timer;
$(function() { main(); });
$(window).on("ontouchup", function()
{
	clearInterval(timer);
	main();
});
$(window).focus(function()
{ 
	clearInterval(timer);
	main();
});

function main()
{
	today = new Date();
	minutes = today.getHours()*60 + today.getMinutes();


	var sdow = ["8.25.2015", "9.1.2015", "9.9.2015", "9.16.2015", "9.22.2015", "9.29.2015", "10.6.2015", "10.14.2015", "10.20.2015", "10.27.2015",
	"11.3.2015", "11.10.2015", "11.17.2015", "11.24.2015", "12.1.2015", "12.8.2015", "12.15.2015", "1.5.2016", "1.26.2016", "2.2.2016",
	"2.17.2016", "2.23.2016", "3.1.2016", "3.9.2016", "3.15.2016", "3.22.2016", "4.5.2016", "4.12.2016", "4.19.2016", "4.26.2016", "5.3.2016",
	"5.10.2016", "5.17.2016", "5.24.2016"];

	var latearriv = ["8.27.2015", "12.10.2015", "9.3.2015", "9.11.2015", "9.17.2015", "10.22.2015", "11.19.2015", "1.28.2016", "2.18.2016", "3.17.2016", "4.21.2016"];
	var actper = ["4.13.2016","5.16.2016"];
	var pmasm = ["5.27.2016"];
	var holidays = ["4.1.2016","6.6.2016","6.17.2016","6.24.2016","7.1.2016","7.4.2016","7.15.2016","7.22.2016","7.29.2016"];
	
	var finals = ["5.31.2016","6.1.2016","6.2.2016"];
	var summer = ["6.7.2016","6.8.2016","6.9.2016","6.10.2016","6.13.2016","6.14.2016","6.15.2016","6.16.2016","6.20.2016","6.21.2016","6.22.2016","6.23.2016",
	"6.27.2016","6.28.2016","6.29.2016","6.30.2016","7.5.2016","7.6.2016","7.7.2016","7.8.2016","7.11.2016","7.12.2016","7.13.2016","7.14.2016",
	"7.18.2016","7.19.2016","7.20.2016","7.21.2016","7.25.2016","7.26.2016","7.27.2016","7.28.2016"];
	
	var date = (today.getMonth() + 1) + "." + today.getDate() + "." + today.getFullYear();

	var display = {};
	
	if(!(today.getDay() % 6) || holidays.indexOf(date) != -1)
	{
		display.schedule = "No school";
		display.period = "";
		while(!(today.getDay() % 6) || holidays.indexOf(date) != -1){
			today.setDate(today.getDate()+1);
			date = (today.getMonth() + 1) + "." + today.getDate() + "." + today.getFullYear();
		}
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
		var periodData = getPeriod([485,535,580,625,675,725,775,825,865],[530,575,620,670,720,770,820,860,925],["1","2","3","4","5","6","7","8","Assembly"]);
		display.period = periodData.period;
		display.end = periodData.end;
		display.range = periodData.range;
	}
	else if(finals.indexOf(date) != -1)
	{
		display.schedule = "Finals";
		var periodData = getPeriod([485,585,685], [575, 675, 775],["1, 3, 8","2, 7, 6","4, 5, Makeup"])
		display.period = periodData.period;
		display.end = periodData.end;
		display.range = periodData.range;
	}
	else if(summer.indexOf(date)!= -1){
		display.schedule = "Summer School";
		if(localStorage.break1 && localStorage.break2) {
			var br1 = parseInt(localStorage.break1), br2 = parseInt(localStorage.break2);
			var periodData = getPeriod([465,br1,br1+15,br2,br2+25],[br1,br1+15,br2,br2+15,770],["School","Break 1","School","Break 2","School"]);
			$("#clearBreaks").css("display","initial");
		}
		else{
			var periodData = getPeriod([465],[770],[""]);
			$("#clearBreaks").css("display","none");
			setTimeout(function(){ $("#summer").css("display", "initial"); $("#summer").animate({top: "10px"},"slow"); },1000);
		}
		display.period = null
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
 			timer = setInterval(countdown, 1000);
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

function setBreaks(){
	localStorage.break1 = $("#br1 option:selected").val();
	localStorage.break2 = $("#br2 option:selected").val();
	$("#summer").animate({top: "-150px"},"slow");
	setTimeout(function() { $("#summer").css("display","none"); }, 1500);
	clearInterval(timer);
	main();
}

function clearBreaks(){
	localStorage.removeItem("break1");
	localStorage.removeItem("break2");
	clearInterval(timer);
	main();
}