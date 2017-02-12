$(function()
{
	//Set the header-logo source image depending on if it's a holiday or not
	$("#header-logo").attr("src", constants.isHolday ? constants.holiday_logo : constants.logo);
});