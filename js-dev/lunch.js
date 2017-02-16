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
    var lunch = getLunch();
    for(var i = 0; i < lunch.length; i++)
    {
        lunchStr += lunch[i] + "\n";
    }
    console.log(lunchStr);
    $('#lunch').text(lunchStr);
});