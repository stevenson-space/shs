$(function()
{	
	var colors;
	var logo;
	if(!constants.isHolday)
	{
		colors = constants.colors;
		logo = constants.logo;
	}
	else 
	{
		if(constants.holiday_colors.length)
			colors = constants.holiday_colors;
		else
			colors = constants.colors;
		logo = constants.holiday_logo;
	}

	$("#header-logo").attr("src",logo);

	shuffle(colors);

	$("#tiles").children().each(function(index)
	{
		$(this).css("backgroundColor", colors[index%colors.length])
	});
});

function shuffle(a, b, c, d)
{	
	c = a.length; while (c) b = Math.random() * c-- | 0, d = a[c], a[c] = a[b], a[b] = d
}
