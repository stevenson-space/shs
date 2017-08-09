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
	    	inSession: false
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
	                end: ends[i]
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
	    end: starts[last + 1]
	}
}


/** Bell Class **/
class Bell
{
	constructor(date)
	{
		this.date = date;
		var minutesOffset = date.getMinutesOffset();
		var dateString = date.toLocaleString();
		
		//Check if we have school or not: weekends/holidays
		if (!(date.getDay() % 6) || constants.holidays.indexOf(dateString) != -1)
		{
			this.school = false;
			this.inSession = false;
			return; //No need to run the rest of the constructor
		}
		//Otherwise check all the types of schedules
		this.school = true;
		var bellData = {}
		//Late Arrival
   		if (constants.latearrival.indexOf(dateString) != -1)
   		{
   		    bellData = getPeriod(constants.latearrival_s, constants.latearrival_e, constants.latearrival_p, minutesOffset);
   		    bellData.schedule = "Late Arrival";
   		}
   		//Activity Period
   		else if (constants.activityperiod.indexOf(dateString) != -1)
   		{
   		    bellData = getPeriod(constants.activityperiod_s, constants.activityperiod_e, constants.activityperiod_p, minutesOffset);
   		    bellData.schedule = "Activity";
   		}
   		//PM Assembly
   		else if (constants.pmassembly.indexOf(dateString) != -1)
   		{
   		    bellData = getPeriod(constants.pmassembly_s, constants.pmassembly_e, constants.pmassembly_p, minutesOffset);
   		    bellData.schedule = "PM Assembly";
   		}
   		else
   		{
   			bellData = getPeriod(constants.standard_s, constants.standard_e, constants.standard_p, minutesOffset);
       		bellData.schedule = "Standard Schedule";
   		}

   		this.inSession = bellData.inSession;
   		this.schedule = bellData.schedule;
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