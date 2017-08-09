function getLunch(date)
{
    var day = new Date(date || Date.now());
    var days = constants.daysInMonth.join(".").substring(0, day.getMonth() * 3 - 1).split(".").reduce((a, b) => {
        return parseInt(a) + parseInt(b);
    }, day.getDate());
    return constants.lunches[days % 28 + ""];
}

$(function()
{
    var lunchStr = "";
    var expanded = false;
    var lunch;

    var today = new Date();
    if(today.getHours()*60 + today.getMinutes() > 821) //After 6th period, temp hack
    {
        today.setDate(today.getDate() + 1);
        lunch = getLunch(today)
        $('#lunch-tile-header').text("Tomorrow's Lunch");
    }
    else
    {
        lunch = getLunch();
    }

    for(var i = 0; i < lunch.length; i++)
    {
        lunchStr += lunch[i] + "\n";
    }

    $('#lunch-text').text(lunchStr);

    $('#toggle-lunch-dropdown').click(function()
    {
        if(expanded)
        {
            //$('#tile-lunch-dropdown').css('height', '');
            //$('#range-timer').css('height', '');
            //$('#lunch-text').css('padding','');
            //$('#lunch-text').text('');
            $('#lunch-text').css('white-space', 'pre-wrap')
            $('#tile-lunch-dropdown').prop('id', 'tile-lunch')
            expanded = false;
        }
        else
        {
           // $('#tile-lunch-dropdown').css('height', 'auto');
            //$('#range-timer').css('height', '350px');
            //$('#lunch-text').css('padding','5px');
            
            $('#tile-lunch').prop('id', 'tile-lunch-dropdown')
            expanded = true;
        }
    });

    
    //console.log(lunchStr);
    //$('#lunch').text(lunchStr);
});