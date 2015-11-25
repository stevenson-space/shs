var dates = ["9.3.2015","LA","9.11.2015","LA","9.17.2015","LA","10.22.2015","LA","11.19.2015","LA","12.10.2015","LA","1.28.2016","LA","2.18.2016","LA","3.17.2016","LA","4.21.2016","LA","8.25.2015","SDOW","9.1.2015","SDOW","9.9.2015","SDOW","9.16.2015","SDOW","9.22.2015","SDOW","9.29.2015","SDOW","10.6.2015","SDOW","10.14.2015","SDOW","10.20.2015","SDOW","10.27.2015","SDOW","11.3.2015","SDOW","11.10.2015","SDOW","11.17.2015","SDOW","11.24.2015","SDOW","12.1.2015","SDOW","12.8.2015","SDOW","12.15.2015","SDOW","1.5.2016","SDOW","1.26.2016","SDOW","2.2.2016","SDOW","2.17.2016","SDOW","2.23.2016","SDOW","3.1.2016","SDOW","3.9.2016","SDOW","3.15.2016","SDOW","3.22.2016","SDOW","4.5.2016","SDOW","4.12.2016","SDOW","4.19.2016","SDOW","4.26.2016","SDOW","5.3.2016","SDOW","5.10.2016","SDOW","5.17.2016","SDOW","5.24.2016","SDOW"]

var today = new Date();
var period;
var tf;

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0'+minutes : minutes;
  return hours + ':' + minutes + ' ' + ampm;

}

function getInfo() {
	
	var date = (today.getMonth() + 1) + "." + today.getDate() + "." + today.getFullYear();
	
	eval((dates.indexOf(date) != -1 ?  dates[dates.indexOf(date) + 1] : "normal") + "(today.getHours()*60 + today.getMinutes())");
	
}


function normal(minutes) {
	
	if (minutes >= 925 || minutes < 485) period = "None", tf = formatAMPM(today);
	else if (inRange(485,540,minutes)) period = '1', tf = '8:05 - 9:00';
	else if (inRange(545,595,minutes)) period = '2', tf = '9:05 - 9:55';
	else if (inRange(600,650,minutes)) period = '3', tf = '10:00 - 10:50';
	else if (inRange(655,675,minutes)) period = '4A', tf = '10:55 - 11:15';
	else if (inRange(685,705,minutes)) period = '4B', tf = '11:25 - 11:45';
	else if (inRange(710,730,minutes)) period = '5A', tf = '11:50 - 12:10';
	else if (inRange(740,760,minutes)) period = '5B', tf = '12:20 - 12:40';
	else if (inRange(765,785,minutes)) period = '5A', tf = '12:45 - 1:05';
	else if (inRange(795,815,minutes)) period = '6B', tf = '1:15 - 1:35';
	else if (inRange(820,870,minutes)) period = '7', tf = '1:40 - 2:30';
	else if (inRange(875,925,minutes)) period = '8', tf = '2:35 - 3:25'
	else period = "Passing", tf = formatAMPM(today);
	
	
	draw(period,tf);
	
	
}

function SDOW(minutes) {
	
	if (minutes >= 925 || minutes < 515) period = "None", tf = formatAMPM(today);
	else if (inRange(515,564,minutes)) period = '1', tf = '8:35 - 9:24';
	else if (inRange(569,613,minutes)) period = '2', tf = '9:29 - 10:13';
	else if (inRange(618,662,minutes)) period = '3', tf = '10:18 - 11:02';
	else if (inRange(667,687,minutes)) period = '4A', tf = '11:07 - 11:27';
	else if (inRange(697,717,minutes)) period = '4B', tf = '11:37 - 11:57';
	else if (inRange(722,742,minutes)) period = '5A', tf = '12:02 - 12:22';
	else if (inRange(752,772,minutes)) period = '5B', tf = '12:32 - 12:52';
	else if (inRange(777,797,minutes)) period = '6A', tf = '12:57 - 1:17';
	else if (inRange(807,827,minutes)) period = '6B', tf = '3:27 - 1:47';
	else if (inRange(832,876,minutes)) period = '7', tf = '1:52 - 2:36';
	else if (inRange(881,925,minutes)) period = '8', tf = '2:41 - 3:25';
	else period = "Passing", tf = formatAMPM(today);
	
	draw(period, tf);
	
	
}

function LA(minutes) {
	
	if (minutes >= 925 || minutes < 630) period = "None", tf = formatAMPM(today);
	else if (inRange(630,665,minutes)) period = '1', tf = '10:30 - 11:05';
	else if (inRange(670,700,minutes)) period = '2', tf = '11:10 - 11:40';
	else if (inRange(705,735,minutes)) period = '3', tf = '11:45 - 12:15';
	else if (inRange(740,775,minutes)) period = '4', tf = '12:20 - 12:55';
	else if (inRange(780,815,minutes)) period = '5', tf = '1:00 - 1:35';
	else if (inRange(820,855,minutes)) period = '6', tf = '1:40 - 2:15';
	else if (inRange(860,890,minutes)) period = '7', tf = '2:20 - 2:50';
	else if (inRange(895,925,minutes)) period = '8', tf = '2:55 - 3:25';
	else period = "Passing", tf = formatAMPM(today);
	
	draw(period, tf);
	
}

function inRange(time1, time2, test) 
{
	return (test >= time1 && test < time2);	
}

function draw(period, tf)
{
	document.getElementById("bhead").innerHTML = period;
	document.getElementById("bp").innerHTML = tf;
	
}