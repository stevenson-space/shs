//When loaded, setup auxilary functions
$(function()
{
	//Add a "getMMDDYYYString()" function to the Date object
	Date.prototype.getMMDDYYYYString = function()
	{
		return (this.getMonth() + 1) + "/" + this.getDate() + "/" + this.getFullYear();
	}

	//Add a "getMinutesOffset()"" function to the Date object
	Date.prototype.getMinutesOffset = function()
	{
		//Returns minutes since midnight
		return this.getHours()*60 + this.getMinutes();
	}

})

function getBell(d)
{
	//Use right now if there's no date provided
	var date = d || new Date();

	//Create empty bell data object
	var bell = {};

	//Weekend and Holidays, find the next starting date
    if (!(date.getDay() % 6) || constants.holidays.indexOf(date.getMMDDYYYYString()) != -1)
    {
        bell.schedule = "No school";
        //Find the next school day
        while (!(date.getDay() % 6) || constants.holidays.indexOf(date.getMMDDYYYYString()) != -1)
        {
            date.setDate(date.getDate() + 1);
        }
        bell.resumeString = "School resumes on " + getDateString(date, "/");
    }
    //Late Arrival
    else if (constants.latearrival.indexOf(date) != -1)
    {
        bell = getPeriod(constants.latearrival_s, constants.latearrival_e, constants.latearrival_p);
        bell.schedule = "Late Arrival";
    }
    //Activity Period
    else if (constants.activityperiod.indexOf(date) != -1)
    {
        bell = getPeriod(constants.activityperiod_s, constants.activityperiod_e, constants.activityperiod_p);
        bell.schedule = "Activity";
    }
    //PM Assembly
    else if (constants.pmassembly.indexOf(date) != -1)
    {
        bell = getPeriod(constants.pmassembly_s, constants.pmassembly_e, constants.pmassembly_p);
        bell.schedule = "PM Assembly";
    }
    //Finals, some special checking here to get the proper day (3 cyclic)
    else if(constants.finals.indexOf(date) != -1)
    {
        //Get the proper finals period set
        
        //This gets td to the day before finals begins
        var td = new Date();
        while(constants.finals.indexOf(getDateString(td)) != -1)
            td.setDate(td.getDate() - 1);

        //So we take the distance from today to find which day of finals we're on
        var d = new Date().getDate() - td.getDate()
        //And assign the proper period set
        if(d == 1)
            finals_p = constants.finals_p1;
        else if(d == 2)
            finals_p = constants.finals_p2;
        else
            finals_p = constants.finals_p3;

        bell = getPeriod(constants.finals_s, constants.finals_e, finals_p);
        bell.schedule = "Finals";
    }
    //Standard Schedule
    else
    {
        bell = getPeriod(constants.standard_s, constants.standard_e, constants.standard_p);
        bell.schedule = "";
    }

    return bell;



}

