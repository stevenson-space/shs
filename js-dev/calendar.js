$(function()
{	
	var date = new Date()
	date.setDate(1)
	for(var i = 2; i <= 7; i++)
	{
		if (date.getDay() == 1) break;
		date.setDate(i);
	}
	console.log(date)

	//Generate dates
	dates = []
	for (var i = 0; i < 20; i++)
	{
		dates[i] = date.getDate();
		date.setDate(date.getDate() + 1);
		if(date.getDay() == 6) date.setDate(date.getDate() + 2);

		if( constants.latearrival.indexOf(date.getMonth() + 1 + "/" + date.getDay() + "/" + date.getFullYear()) > -1) console.log("kek");
	}


	$(".tile-cal").each(function(index)
	{
		
		$(this).text(dates[index]);
	});

	
});