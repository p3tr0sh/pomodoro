
var Phase = {
	titles: ['Work Phase', 'Short Break', 'LongBreak', 'Break', 'Pause'],
	times: [25*60, 5*60, 20*60],
	WORK: 0,
	SHORT: 1,
	LONG: 2,
	BREAK: 3,
	index: 0,
	workCycles: 1,
	getTitle: function() {
		if(this.index == this.WORK) {
			return this.titles[this.index] + " " + this.workCycles;
		}
		return this.titles[this.index];
	},
	getTime: function() {return this.times[this.index];}
}

const cycles = 4;
var paused = true;
var seconds = Phase.getTime();

// keyboard listener space bar

function pad(seconds){
	minutes = Math.floor(seconds/60);
	seconds = seconds%60;
	return ("00" + minutes).slice(-2)+":"+("00" + seconds).slice(-2);
}

// Astrid mode
function automatic() {
	return setInterval(function() {
		if(seconds == 0){
			if(Phase.index != Phase.WORK){ // work
				Phase.index = 0;
				log('started ' + Phase.getTitle());
			} else {
				if(Phase.index == Phase.WORK && Phase.workCycles % cycles == 0) { // long break
					Phase.index = 2;
					Phase.workCycles++; // increment work counter once at end of work phase
				} else if(Phase.index == Phase.WORK) { // short break
					Phase.index = 1;
					Phase.workCycles++; // increment work counter once at end of work phase
				}
				log('started ' + Phase.getTitle());
			}
			seconds = Phase.getTime();
			notifyMe(Phase.getTitle());
			
		} else{
			if(!paused) {
				seconds--;
			}
		}
		document.getElementById('timer_display').innerHTML = pad(seconds);
	}, 1000);
}

//Robin mode
function manual() {
	return setInterval(function() {
		if(paused)
			return;
		if(seconds == 0) {
			seconds = Phase.times[Phase.WORK];
			Phase.index = 3;
			pause('started');
			notifyMe(Phase.getTitle());
			Phase.workCycles++; // increment work counter once at end of work phase
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
	if(Phase.index == Phase.BREAK && !paused) {
		// starting new work phase from manual mode
		Phase.index = 0;
	}
	var prefix = ""
	if(paused) {
		document.getElementById('pause_button').innerHTML = "Start";
		prefix = "paused";
	} else {
		document.getElementById('pause_button').innerHTML = "Pause";
		prefix = "started";
		if((Phase.index == Phase.WORK && seconds < Phase.times[Phase.WORK]) || 
			(Phase.index == Phase.SHORT && seconds < Phase.times[Phase.SHORT]) || 
			(Phase.index == Phase.LONG && seconds < Phase.times[Phase.LONG])) {
			prefix = 'resumed';
		}
	}
	if(typeof optionalText !== "undefined")
		prefix = optionalText;
	if(Phase.index == Phase.WORK) {
		log(prefix + ' ' + Phase.getTitle());
	} else {
		log(prefix + ' ' + Phase.getTitle());
	}
}

function reset_phase() {
	seconds = Phase.getTime();
	log('reset ' + Phase.getTitle());
	document.getElementById('timer_display').innerHTML = pad(seconds);
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
	document.getElementById('timer_display').innerHTML = pad(Phase.getTime())
	
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
