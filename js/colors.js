$(function()
{	
	shuffle(constants.colors);

	$("#tiles").children().each(function(index)
	{
		$(this).css("backgroundColor", constants.colors[index])
	});
});

function shuffle(a, b, c, d)
{	
	c = a.length; while (c) b = Math.random() * c-- | 0, d = a[c], a[c] = a[b], a[b] = d
}
