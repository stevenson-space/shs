$(function()
{	
	var logo;
	if(!constants.isHolday)
	{
		$("#header-logo").attr("src",constants.logo);
	}
	else 
	{
		$("#header-logo").attr("src",constants.holiday_logo);
	}

	$("#tiles").children().each(function(index)
	{
		$(this).css("backgroundColor", constants.colors[index%constants.colors.length]);
	});

	var date = new Date()
	date.setDate(1)
	for(var i = 2; i <= 7; i++)
	{
		if (date.getDay() == 1) break;
		date.setDate(i);
	}
	console.log(date)

	var month = date.getMonth() + 1;
	var day = date.getDate();
	var year = date.getFullYear();

	$(".tile-cal").each(function(index)
	{
		var t = day + index;
		
		$(this).text(t);
	});

	
});