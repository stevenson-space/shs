function getLunch(date)
{
    var day = new Date(date || Date.now());
    var days = constants.daysInMonth.join(".").substring(0, day.getMonth() * 3 - 1).split(".").reduce((a, b) => {
        return parseInt(a) + parseInt(b);
    }, day.getDate());
    return constants.lunches[days % 28 + ""];
}

function getLunchString(date)
{
    var lunchMenu = getLunch(date);
    var lunchString = "";
    for(var lunchItem of lunchMenu)
        lunchString += lunchItem + "\n";
    return lunchString;
}