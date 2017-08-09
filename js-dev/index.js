$(function()
{
	var bell = getBell()

	if(bell.schedule == "No school")
	{
		$('#tile-projector').hide()
		$('#tile-timers').hide()
		//$('#tile-docs').css('order', '0');
	}


})