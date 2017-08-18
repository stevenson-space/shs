/**
 * Bell.js
 * Implements the Bell object
 */

//Get the corresponding period given start/stop times, their corresponding periods, and the current time
function getPeriod(starts, ends, periods, minutesOffset)
{
	//Check if school hasn't started or if it's already over
	if (minutesOffset < starts[0] || minutesOffset >= ends[ends.length - 1])
	{
		return {
	    	schoolStarted: !(minutesOffset < starts[0]),
	    	schoolOver: minutesOffset >= ends[ends.length -1]
		}
	}
	//Else we can go on and find the period
	var last;
	for (var i = 0; i < starts.length; i++)
	{
	    if (minutesOffset >= starts[i]) //if we are into the i-th period
	    {
	        last = i //then its also the "last" period
	        if (minutesOffset < ends[i]) //if we're also before the end of the i-th period,
	        					   //then this is the current period
	        {
	            return {
	            	inSession: true,
	                period: periods[i],
	                start: starts[i],
	                end: ends[i],
	                schoolStarted: true,
	                schoolOver: false,
	            }
	        }
	    }
	}

	//If the loop terminates without finding a period that means we must be in a passing period
	//(after the start of a period but not before the end)
	return {
		inSession: true,
	    period: "!Passing",
	    start: ends[last],
	    end: starts[last + 1],
	    schoolStarted: true,
	    schoolOver: false
	}
}


/** Bell Class **/
class Bell
{
	constructor(date)
	{
		this.date = date;

		var minutesOffset = date.getMinutesOffset();
		var dateString = date.toLocaleDateString();

		//Check if we have school or not: weekends/holidays
		if (!(date.getDay() % 6) || constants.holidays.indexOf(dateString) != -1)
		{
			this.school = false;
			this.schoolStarted = false;
			this.schoolOver = false;
			return; //No need to run the rest of the constructor
		}
		//Otherwise check all the types of schedules
		this.school = true;

		//Default schedule type
		var schedule = "Standard Schedule";

		//Iterate through the dates of each schedule type and determine the schedule
		for(var prop in constants.dates)
			if(constants.dates[prop].indexOf(dateString) > -1)
				schedule = prop;
		var periods = constants.schedules[schedule].periods

		//Check if periods is a 2D array, indicating that the period names vary by day (e.g. Finals)
		if(periods[0].constructor === Array) {
			//Starts at -1 and adds one for every date preceding today including today
			var day = -1;
			while(constants.dates[schedule].indexOf(date.toLocaleDateString()) > -1) {
				day++;
				date.setDate(date.getDate() - 1);
			}
			//Sets the periods to respective set of periods
			periods = periods[day];
		}

		var bellData = getPeriod(constants.schedules[schedule].start, constants.schedules[schedule].end, periods, minutesOffset);

   		this.schoolOver = bellData.schoolOver;
   		this.schoolStarted = bellData.schoolStarted;
   		this.schedule = schedule;
   		this.period =
   		{
   			period: bellData.period,
   			start: bellData.start,
   			end: bellData.end,
   		}

	}

	nextPeriod()
	{
		//Return a bell object created when the next period begins
		this.date.setMinutesOffset(this.period.end + 5);
		return new Bell(this.date);

	}

}


$(function()
{
	//Add a "getMinutesOffset()"" function to the Date object
	Date.prototype.getMinutesOffset = function()
	{
		//Returns minutes since midnight
		return this.getHours()*60 + this.getMinutes();
	}

	Date.prototype.setMinutesOffset = function(minutes)
	{
		var hours = Number.parseInt(minutes / 60);
		var minutes = minutes % 60;

		this.setHours(hours);
		this.setMinutes(minutes);
	}

})
