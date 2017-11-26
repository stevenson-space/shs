/**
 * index.js
 * Bell schedule, timer, lunch, event functionality for the home page
 */

//Ensure the timer is memory so we can attach listeners to it
var timer;

//Run main function on document load
$(main);

//Reset timer and rerun on regained focus or a touch on mobile device
$(window).on("touchend focus", function()
{
    clearInterval(timer);
    main();
});
$("#half-periods-checkbox").change(function()
{
	clearInterval(timer);
	main();
})

function main()
{
	//Always get the bell data for right now
	var today = getCurrentDate();
	var bell = new Bell(today);

	//Get events
	var events = getNextEvents();

	//If there's no school or it's already over:
	//Hide the timer
	//Indicate the day's schedule when school resumes and that day's lunch
	if(!bell.school || bell.schoolOver)
	{
		//Hide the timer and projector mode tiles
		$('#tile-bell').hide();
		$('#tile-projector').hide();

		//Find the next school day/date
		nextSchoolDay = getCurrentDate();
		nextSchoolDay.setDate(nextSchoolDay.getDate()  + 1);
		bell = new Bell(nextSchoolDay);
		while(!bell.school)
		{
			nextSchoolDay.setDate(nextSchoolDay.getDate() + 1);
			bell = new Bell(nextSchoolDay);
		}
		var nextDay = nextSchoolDay.toLocaleDateString('en-US', { weekday: 'long' });

		//Show the next day's schedule
		$('#event1').text(bell.schedule + ' ' + nextDay);
		//Events
		$('#event2').text(events[0]);
		$('#event3').text(events[1]);

		//Set the lunch menu for the next day school resumes
		$('#lunch-header').text(nextDay + "'s Lunch");
		$('#lunch-text').text(getLunchString(nextSchoolDay));


	}
	//If school just hasn't started yet:
	//Hide the timer tile
	//Indicate today's schedule and lunch
	else if(!bell.schoolStarted)
	{
		//Hide the timer tile
		$('#tile-bell').hide();

		//Show today's lunch
		$('#lunch-text').text(getLunchString(today))

		$('#event1').text(bell.schedule + ' today');
		$('#event2').text(events[0]);
		$('#event3').text(events[1]);

	}
	//If we are in school right now:
	//Show bell information
	//Indicate today's schedule and lunch
	else
	{

		//Show bell information

		//Get the period string, check for special case such as "!Activity" --> Activity
		var periodString;
		if(bell.period.period[0] == "!")
        	periodString = bell.period.period.substring(1, bell.period.length);
		else
        	periodString = "Period " + bell.period.period;

        //Set the static bell information
        $("#schedule").text(bell.schedule);
    	$("#period").text(periodString);
    	//Generate a range string
    	var d = getCurrentDate();
    	d.setMinutesOffset(bell.period.start);
    	var t1 = d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}).split(" ")[0];
    	d.setMinutesOffset(bell.period.end);
    	var t2 = d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}).split(" ")[0];
    	var range = t1 + " - " + t2;
    	$("#range").text(range);

    	//Create the timer
    	var secondsLeft = (bell.period.end - bell.date.getMinutesOffset() - 1) * 60 + (60 - bell.date.getSeconds());
    	var seconds;
    	var countdown = function()
    	{
    	    seconds = secondsLeft % 60;
          var minutes = Math.floor(secondsLeft / 60) % 60;
          var hours = Math.floor(secondsLeft / 60 / 60);
    	    //set timer to hours + minutes + seconds
    	    $("#timer").text((hours > 0 ? hours + ':' : '') + //hours is only displayed if > 0
                            (minutes < 10 && hours > 0 ? '0' : '') + minutes + ":" + //minutes always has 2 digits if hours are displayed
                            (seconds < 10 ? '0' : '') + seconds); //ensures seconds always has 2 digits
    	    //reset if time has expired
    	    if (secondsLeft <= 0)
    	    {
    	        clearInterval(timer);
    	        $("#timer").text("");
    	        //Re-run this file
    	        main();
    	    }
    	    secondsLeft--;
    	}
    	//Start the timer
    	timer = setInterval(countdown, 1000);
    	countdown();


		$('#event1').text(events[0]);
    	$('#event2').text(events[1]);
		$('#event3').text(events[2]);



	}

	//Check for > 6th period in order to see what lunch to display
	//Note this check occurs for both if school is out of session (after school)
	//or we're just after 6th period
	if(today.getMinutesOffset() > 821) // this is a hack to check 6th period :(
	{
		//Find the next school day
		var nextSchoolDay = getCurrentDate();
		nextSchoolDay.setDate(nextSchoolDay.getDate() + 1);
		var b = new Bell(nextSchoolDay, true);
		while(!b.school)
		{
      		nextSchoolDay.setDate(nextSchoolDay.getDate() + 1);
			b = new Bell(nextSchoolDay, true);
		}


		$('#lunch-header').text(nextSchoolDay.toLocaleDateString('en-US', { weekday: 'long' }) + "'s Lunch");
		$('#lunch-text').text(getLunchString(nextSchoolDay))

	}
	else if(bell.school) //Not after 6th period, but we still have to be in school
	{
		$('#lunch-text').text(getLunchString(today))
	}



}
