
function getHue(seconds) {
	// given the seconds since midnight
	// and the seconds of the minute
	// calculate a hue

	// there are 60*60*24 seconds in a day
	// so divide by 60*60*24/360 = 240 to get a value between 0 and 360
	return (seconds/240).toFixed(3);
}

function getSat(seconds) {
	// calculate a saturation using seconds since the minute
	var minSat = 1/3;

	// find a point on a cosine curve oscillating between 0.25 and 0.75
	// peaking at 0/60 and minimising at 30
	var satFloat = (1-minSat)/2 * Math.cos((seconds/60)*2*Math.PI) + (1-minSat)/2 + minSat;
	return (satFloat * 100).toFixed(2) + "%";
}

function getLight(minutes, seconds) {
	// given seconds since the hour
	// calculate a lightness based on some sort of magical
	// oscillating function.

	var totalSeconds = minutes * 60 + seconds

	// cosine curve between 0.2 and 1
	// peaking at 0/3600 seconds and
	// minimising at 1800
	var lightFloat = 1/5 + (1 + Math.cos((totalSeconds/3600)*Math.PI))/5;
	return (lightFloat * 100).toFixed(2) + "%";
}

function refreshColor(d) {
 	var h = d.getHours();
 	var m = d.getMinutes();
 	var s = d.getSeconds();

    var midnight = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        0,0,0);
    // find the seconds since midnight
    var diff = Math.floor((d.getTime() - midnight.getTime())/1000);

    var hue = getHue(diff);
    var sat = getSat(s);
    var light = getLight(m, s);
 	var	color = "hsl(" + hue + ", " + sat + ", " + light + ")";
 	
 	// set any coloured element of the site
 	// (logo, main background) to use the calculated colour
    $(".apps-chromophage-bg").css("background-color", color);

}

function refreshTime(d) {
 	var h = d.getHours();
 	var m = d.getMinutes();
 	var s = d.getSeconds();

	// ternary magic!
	// ensures the time is always two digits
	h = h > 9 ? h : "0" + h;
	m = m > 9 ? m : "0" + m;
	s = s > 9 ? s : "0" + s;

	var time = h + ":" + m + ":" + s;

    // update the time
    $(".time").text(time);
}

setInterval(function(){
	var d = new Date();
	refreshColor(d);
	refreshTime(d);
}, 1000);

var d = new Date()
refreshColor(d);
refreshTime(d);
