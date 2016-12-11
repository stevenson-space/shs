var minutes, timer;

//Run main function on document load
$(main);
//Reset timer and rerun on regained
//focus or a touch on mobile device
$(window).on("touchend focus", function() 
{
    clearInterval(timer);
    main();
}); 


function main()
{
    var today = new Date();
    minutes = today.getHours() * 60 + today.getMinutes(); //minutes offset

    var date = getDateString(today)

    var display = {};

    //Weekend and Holidays, find the next starting date
    if (!(today.getDay() % 6) || constants.holidays.indexOf(date) != -1)
    {
        display.schedule = "No school";
        display.period = "";
        //Find the next school day
        while (!(today.getDay() % 6) || constants.holidays.indexOf(date) != -1)
        {
            today.setDate(today.getDate() + 1);
            date = getDateString(today);
        }
        display.range = "School resumes: " + getDateString(today, "/");
        display.end = false;
    }
    //Late Arrival
    else if (constants.latearrival.indexOf(date) != -1)
    {
        display = getPeriod(constants.latearrival_s, constants.latearrival_e, constants.latearrival_p);
        display.schedule = "Late Arrival";
    }
    //Activity Period
    else if (constants.activityperiod.indexOf(date) != -1)
    {
        display = getPeriod(constants.activityperiod_s, constants.activityperiod_e, constants.activityperiod_p);
        display.schedule = "Activity";
    }
    //PM Assembly
    else if (constants.pmassembly.indexOf(date) != -1)
    {
        display = getPeriod(constants.pmassembly_s, constants.pmassembly_e, constants.pmassembly_p);
        display.schedule = "PM Assembly";
    }
    //Special Case - Finals!
    else if(constants.finals.indexOf(date) != -1)
    {
        display = getPeriod(constants.finals_s, constants.finals_e, constants.finals_p);
        display.schedule = "Finals";
    }
    //Standard Schedule
    else
    {
        display = getPeriod(constants.standard_s, constants.standard_e, constants.standard_p);
        display.schedule = "Standard Schedule";
    }

    //Update the UI
    $("#schedule").text(display.schedule);
    $("#period").text(display.period);
    $("#range").text(display.range);

    //Timer
    var secondsLeft = (display.end - minutes - 1) * 60 + (60 - today.getSeconds());
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
            main();
        }
        secondsLeft--;
    }
    //Only start the timer if we have an "end" value
    if (display.end)
    {
        timer = setInterval(countdown, 1000);
        countdown();
    }
}

//Returns the current period
function getPeriod(starts, ends, periods)
{
	//If school hasn't begun or has already ended
    if (minutes < starts[0] || minutes >= ends[ends.length - 1])
	{
		return {
        	period: "None",
        	end: false,
        	range: ""
    	}
	}
	//Else we can go on and find the period
    var last;
    for (var i = 0; i < starts.length; i++)
    {
        if (minutes >= starts[i]) //if we are into the i-th period
        {
            last = i //then its also the "last" period
            if (minutes < ends[i]) //if we're also before the end of the i-th period,
            					   //then this is the current period
            {
                return {
                    period: "Period " + periods[i],
                    end: ends[i],
                    range: toHours(starts[i]) + "-" + toHours(ends[i])
                }
            }
        }
    }

    //If we're in school but a current period is not found, we're in a passing period
    return {
        period: "Passing",
        end: starts[last + 1],
        range: "Next: " + toHours(starts[last + 1]) + "-" + toHours(ends[last + 1])
    }
}

//Returns the current date formatted as a string
function getDateString(date)
{
    return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
}

//Converts a minutes input into hours:minutes format
function toHours(minutes)
{
    var hours = Math.floor(minutes / 60);
    if (hours > 12) hours -= 12;
    var minutes = minutes % 60;
    if (minutes < 10) minutes = "0" + minutes;
    return hours + ":" + minutes;
}