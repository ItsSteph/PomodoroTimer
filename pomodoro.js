document.addEventListener("DOMContentLoaded", () => {

const startButton = document.getElementById("pomodoro-start");
const refreshButton = document.getElementById("pomodoro-refresh");
const pauseButton = document.getElementById("pomodoro-pause");
const settingsButton = document.getElementById("pomodoro-settings");
const itemToHide = document.getElementById("pomodoro-clock-inputs");
const stopButton = document.getElementById('pomodoro-stop')
const playAudioButton = document.getElementById("play-audio");
const pauseAudioButton = document.getElementById("pause-audio");
const stopAudioButton = document.getElementById("stop-audio");
const audio = new Audio("alarm.mp3");
const studyAudio = new Audio("studymusic.mp3");
let isClockRunning = false;
let workSessionDuration = 1500;
let currentTimeLeftSession = 1500;
let breakSessionDuration = 300;
let timeSpentInCurrentSession = 0;
let type = 'Work';
let updatedWorkSessionDuration;
let updatedBreakSessionDuration;
let workDurationInput = document.getElementById("input-work-duration");
let breakDurationInput = document.getElementById("input-break-duration");
let isClockStopped = true;

//Progressbar
const progressBar = new ProgressBar.Circle("#pomodoro-timer", {
    strokeWidth: 10,
    text: {
      value: "00:00"
    },
    color: "#B8DFF0"
  });

//Listens for userinput from the input tags in index.html
workDurationInput.addEventListener("input", () => {
    updatedWorkSessionDuration = minuteToSeconds(workDurationInput.value)
});

breakDurationInput.addEventListener("input", () => {
    updatedBreakSessionDuration = minuteToSeconds(breakDurationInput.value)
});

//Refresh the page
function Refresh() {
    setTimeout("location.reload(true);");
    targetDiv.style.display = "none";
};

//Converts minutes into seconds
const minuteToSeconds = (mins) => {
    return mins * 60
};

//start the timer
startButton.onclick = function () {
    clockTimer = setInterval(() => {
        stepDown();
        progressBar.set(calculateSessionProgress());
    }, 1000);
    isClockRunning = true;
};

//pause the timer
pauseButton.onclick = function () {
    while (isClockRunning === true){
        clearInterval(clockTimer);
        isClockRunning = false;
    }
};

//stop the timer
stopButton.onclick = function () {
    setUpdatedTimers();
    clearInterval(clockTimer);
    isClockStopped = true;
    isClockRunning = false;
    currentTimeLeftSession = workSessionDuration;
    displayCurrentTimeLeftInSession();
    type = "Work";
    timeSpentInCurrentSession = 0;
  };

//refresh page
refreshButton.onclick = function () {
    Refresh();
};

//show/hide settings
settingsButton.onclick = function () {
    if (itemToHide.style.display !== "none") {
        itemToHide.style.display = "none";
    } else {
        itemToHide.style.display = "block";
    }
  };

//Adds zeros to the time and display the current time in the progressbar
const displayCurrentTimeLeftInSession = () => {
    const secondsLeft = currentTimeLeftSession;
    let result = "";
    const seconds = secondsLeft % 60;
    const minutes = parseInt(secondsLeft / 60) % 60;
    const minutesZero = ("0" + minutes).slice(-2);
    const secondsZero = ("0" + seconds).slice(-2);
    result += `${minutesZero}:${secondsZero}`;
    //diplays the result in the progressbar text field
    progressBar.text.innerText = result.toString();
};

//Checks the session time and updates the lables and timers depending on how much time is left/spent
const stepDown = () => {
    if (currentTimeLeftSession > 0){
    //decrease time lef/ increase time spent
    currentTimeLeftSession--;
    timeSpentInCurrentSession++;
    } else if (currentTimeLeftSession === 0){
        timeSpentInCurrentSession = 0;
        audio.play();
        if(type === 'Work'){
            currentTimeLeftSession = breakSessionDuration;
            type = 'Break';
            setUpdatedTimers()
        } else{
            currentTimeLeftSession = workSessionDuration;
            type = 'Work'
            setUpdatedTimers()
        }
        updateSession();
    }
    displayCurrentTimeLeftInSession()
};

//Update the sessions
const updateSession = () => {
    if(type === work){
        currentTimeLeftSession = breakSessionDuration
        type = 'Break'
    } else {
        currentTimeLeftSession = workSessionDuration
        type = 'Work'
    }
};

//Updates the timers
const setUpdatedTimers = () => {
    if(type === 'Work'){
        currentTimeLeftSession = updatedWorkSessionDuration ? updatedWorkSessionDuration : workSessionDuration
        workSessionDuration = currentTimeLeftSession
    } else {
        currentTimeLeftSession = updatedBreakSessionDuration ? updatedBreakSessionDuration : breakSessionDuration
        breakSessionDuration = currentTimeLeftSession
    }
};

//Calculates the completion rate of the current session
const calculateSessionProgress = () => {
    const sessionDuration =
      type === "Work" ? workSessionDuration : breakSessionDuration;
    return (timeSpentInCurrentSession / sessionDuration) * 1;
};

//Plays, pauses and stops/resets the audio when button is clicked
playAudioButton.onclick = function () {
    studyAudio.play();	 
};

pauseAudioButton.onclick = function () {
    studyAudio.pause();
};

stopAudioButton.onclick = function () {
    studyAudio.pause();
    studyAudio.currentTime = 0;
};
});

