const workTime = 25*60;
const shortBreakTime = 5*60;
const longBreakTime = 20*60;
const cycles = 6;
currentCycle = 0;
countWorkTime = 0;
paused = true;
var seconds = workTime;


function pad(seconds){
	minutes = Math.floor(seconds/60);
	seconds = seconds%60;
	return ("00" + minutes).slice(-2)+":"+("00" + seconds).slice(-2);
}

var intv = setInterval(function() {
	if(seconds == 0){
		if(currentCycle%2 == 0) {
			seconds = shortBreakTime;
			countWorkTime++;
			notifyMe('shortBreakTime');
		} else if(currentCycle%2 == 1){
			seconds = workTime;	
			notifyMe('workTime');
		}
		
		if(currentCycle == cycles) {
			seconds = longBreakTime;
			notifyMe('longBreakTime');
			currentCycle = 0;
		} else{
			currentCycle++;
		}
	} else{
		if(!paused) {
			seconds--;
		}
	}
	document.getElementById('demo').innerHTML = pad(seconds);
}, 1000);


function notifyMe(texttt) {
	var audio = new Audio('slow-spring-board.mp3');
	audio.play();
	new Notification(texttt);
}


function pause() {
	paused = !paused;
	if(paused) {
		document.getElementById('pauseButton').innerHTML = "Start";
	} else {
		document.getElementById('pauseButton').innerHTML = "Pause";
	}
}


document.addEventListener('DOMContentLoaded', () => {
	if (Notification.permission !== "granted") {
		Notification.requestPermission();
	}
});
