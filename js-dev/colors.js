$(function()
{	

	//Set the colors based on if it's a holiday or not
	var colors;
	if(!constants.isHolday)
	{
		colors = constants.colors;
	}
	else 
	{
		if(constants.holiday_colors.length)
			colors = constants.holiday_colors;
		else
			colors = constants.colors;
	}

	shuffle(colors);

	//Assign a color to each tile
	$("#tiles").children().each(function(index)
	{
		$(this).css("backgroundColor", colors[index%colors.length])
	});
});

function shuffle(a, b, c, d)
{	
	c = a.length; while (c) b = Math.random() * c-- | 0, d = a[c], a[c] = a[b], a[b] = d
}
