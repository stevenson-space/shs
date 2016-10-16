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

	//Get first monday
	var monday = (new Date()).today().previous().monday();


	$(".tile-cal").each(function(index)
	{
		console.log(index+1);
		$(this).text(index+1);
	});
	
});