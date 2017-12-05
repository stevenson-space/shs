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
	var bell = new Bell(today, true);

	if(bell.school && !bell.schoolOver)
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

	


}
