const workTime = 2;
const shortBreakTime = 5*60;
const longBreakTime = 20*60;
const cycles = 6;
var currentCycle = 0;
var countWorkTime = 0;
var paused = true;
var seconds = workTime;
var phaseText = "";
var phases = ['Work Phase', 'Short Break', 'LongBreak', 'Break', 'Pause'];
var phaseIndex = 0;


function pad(seconds){
	minutes = Math.floor(seconds/60);
	seconds = seconds%60;
	return ("00" + minutes).slice(-2)+":"+("00" + seconds).slice(-2);
}

// Astrid mode, currently broken
function automatic() {
	return setInterval(function() {
		if(seconds == 0){
			if(currentCycle == cycles) {
				seconds = longBreakTime;
				phaseIndex = 2;
				phaseText = phases[phaseIndex];
				currentCycle = 0;
			} else if(currentCycle%2 == 0) {
				seconds = shortBreakTime;
				phaseIndex = 1;
				phaseText = phases[phaseIndex]
				currentCycle++;
			} else if(currentCycle%2 == 1){
				seconds = workTime;	
				countWorkTime++;
				phaseIndex = 0;
				phaseText = phases[phaseIndex] + ' ' + countWorkTime;
				currentCycle++;
			}
			log('started ' + phaseText);
			notifyMe(phaseText);
			
		} else{
			if(!paused) {
				seconds--;
				document.getElementById('timer_display').innerHTML = pad(seconds);
			}
		}
	}, 1000);
}

//Robin mode
function manual() {
	return setInterval(function() {
		if(paused)
			return;
		if(seconds == 0) {
			seconds = workTime;
			phaseIndex = 3;
			phaseText = phases[phaseIndex];
			pause('started');
		} else{
			seconds--;
		}
		document.getElementById('timer_display').innerHTML = pad(seconds);
	}, 1000);
}
var interval = automatic();



function notifyMe(texttt) {
	var audio = new Audio('slow-spring-board.mp3');
	audio.play();
	new Notification(texttt);
}

function log(customText) {
	var li = document.createElement("LI");
	li.innerHTML = (new Date()).toLocaleTimeString("de-DE") + " " + customText;
	document.getElementById('log').appendChild(li)
}


function pause(optionalText) {
	paused = !paused;
	if(seconds == workTime && !paused) {
		// starting new work phase from manual mode?
		countWorkTime++;
		phaseIndex = 0;
		phaseText = phases[phaseIndex] + ' ' + countWorkTime;
	}
	var prefix = ""
	if(paused) {
		document.getElementById('pause_button').innerHTML = "Start";
		prefix = "paused";
	} else {
		document.getElementById('pause_button').innerHTML = "Pause";
		prefix = "started";
		if((phaseIndex == 0 && seconds < workTime) || (phaseIndex == 1 && seconds < shortBreakTime) || (phaseIndex == 2 && seconds < longBreakTime)) {
			prefix = 'resumed';
		}
	}
	if(typeof optionalText !== "undefined")
		prefix = optionalText;
	log(prefix + ' ' + phaseText);
}

function setMode(val) {
	clearInterval(interval);
	if(val == 0) {
		interval = automatic();
	} else {
		interval = manual();
	}
	sessionStorage.mode = val;
}


document.addEventListener('DOMContentLoaded', () => {
	document.getElementById('timer_display').innerHTML = pad(workTime)
	
	document.getElementById('mode_switcher').onchange = function() {
		// change mode
		setMode(this.value)
	}

	if(sessionStorage.mode) {
		document.getElementById('mode_switcher').value = sessionStorage.mode;
		setMode(sessionStorage.mode);
	} else {
		sessionStorage.mode = document.getElementById('mode_switcher').value;
	}


	if (Notification.permission !== "granted") {
		Notification.requestPermission();
	}
});
