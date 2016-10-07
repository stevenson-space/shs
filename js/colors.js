$(function()
{	
	var colors;
	var logo;
	if(!constants.isHolday)
	{
		colors = constants.colors;
		logo = "img/logo.png";
	}
	else 
	{
		colors = constants.holiday_colors;
		logo = constants.holiday_logo;
	}

	$("#header-logo").attr("src",logo);

	shuffle(colors);

	$("#tiles").children().each(function(index)
	{
		$(this).css("backgroundColor", colors[index])
	});
});

function shuffle(a, b, c, d)
{	
	c = a.length; while (c) b = Math.random() * c-- | 0, d = a[c], a[c] = a[b], a[b] = d
}
