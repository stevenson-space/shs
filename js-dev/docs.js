$(function()
{
	$('.subject-header').click(function(event)
	{
		//Get the closest subject tile which is the one we need to expand
		var subjectTile = $(event.target).closest('.doc-subject-tile');

		//Show the class documents if they were hidden
		if(subjectTile.attr('data-hidden') == 'true')
		{
			subjectTile.css('height', 'auto');
			subjectTile.find('.class').css('display', 'initial');
			//Toggle the hidden flag
			subjectTile.attr('data-hidden', 'false');
		}
		else //Otherwise hide them
		{
			subjectTile.css('height', '');
			subjectTile.find('.class').css('display', '');
			//Toggle the hidden flag
			subjectTile.attr('data-hidden', 'true');
		}

		
	})
})