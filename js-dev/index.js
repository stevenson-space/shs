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

function main()
{
	//Always get the bell data for right now
	var today = new Date();
	var bell = new Bell(today);


	//If no school: hide the timer tile, indicate when school resumes,
	//and get lunch for the next school day
	if(!bell.school)
	{
		//Hide the timer tile
		$('#tile-bell').hide();

		//Find the next school day/date
		nextSchoolDay = new Date();
		while(!bell.school)
		{
			nextSchoolDay.setDate(nextSchoolDay.getDate() + 1);
			bell = new Bell(nextSchoolDay);
		}
		var nextDate = nextSchoolDay.toLocaleDateString();
		var nextDay = nextSchoolDay.toLocaleDateString('en-US', { weekday: 'long' });
		
		//Set the upcoming event to be when school resumes


		//Set the lunch menu for the next day school resumes
		$('#lunch-header').text(nextDay + "'s Lunch");
		$('#lunch-text').text(getLunchString(nextSchoolDay));


	}
	//If school is running today not in session: Hide the timer tile,
	//Add today's schedule to the upcoming tile, and show today's lunch
	else if (!bell.inSession)
	{
		//Hide the timer tile
		$('#tile-bell').hide();


		//Add today's schedule to the upcoming event tile
		

		//Show today's lunch
		$('#lunch-text').text(getLunchString(today))
	

	}
	//If school is running today and in session: show info, setup timer, set lunch, show upcoming events
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
    	var d = new Date();
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
    	    //set timer to minutes + seconds
    	    $("#timer").text(Math.floor(secondsLeft / 60) + ":" + (seconds < 10 ? "0" + seconds : seconds));
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
    	
	}

	//Check for > 6th period in order to see what lunch to display
	//Note this check occurs for both if school is out of session (after school)
	//or we're just after 6th period
	if(today.getMinutesOffset() > 821) // this is a hack to check 6th period :(
	{
		//Find the next school day
		nextSchoolDay = new Date();
		nextSchoolDay.setDate(nextSchoolDay.getDate() + 1);
		b = new Bell(nextSchoolDay);
		while(!b.school)
		{
			nextSchoolDay.setDate(nextSchoolDay.getDate() + 1);
			b = new Bell(nextSchoolDay);
		}

		$('#lunch-header').text(nextSchoolDay.toLocaleDateString('en-US', { weekday: 'long' }) + "'s Lunch");
		$('#lunch-text').text(getLunchString(nextSchoolDay))
		
		
	}
	else //Not after 6th period
	{
		$('#lunch-text').text(getLunchString(today))
	}



}
