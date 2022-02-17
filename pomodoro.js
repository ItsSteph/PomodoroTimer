document.addEventListener("DOMContentLoaded", () => {

const startButton = document.getElementById("pomodoro-start");
const refreshButton = document.getElementById("pomodoro-refresh");
const pauseButton = document.getElementById("pomodoro-pause");
const settingsButton = document.getElementById("pomodoro-settings");
const itemToHide = document.getElementById("pomodoro-clock-inputs");
const stopButton = document.getElementById('pomodoro-stop')
const playAudioButton = document.getElementById("play-audio");
const pauseAudioButton = document.getElementById("pause-audio");
const audio = new Audio("alarm.mp3");
const studyAudio = new Audio("studymusic.mp3");
let isClockRunning = false;
let workSessionDuration = 1500;
let currentTimeLeftSession = 1500;
let breakSessionDuration = 300;
let timeSpentInCurrentSession = 0;
let type = 'Work';
let currentTaskLabel = document.getElementById("pomodoro-clock-task");
let updatedWorkSessionDuration;
let updatedBreakSessionDuration;
let workDurationInput = document.getElementById("input-work-duration");
let breakDurationInput = document.getElementById("input-break-duration");
workDurationInput.value = "25";
breakDurationInput.value = "5";
let isClockStopped = true;

const progressBar = new ProgressBar.Circle("#pomodoro-timer", {
    strokeWidth: 10,
    text: {
      value: "00:00"
    },
    color: "#B8DFF0"
  });

workDurationInput.addEventListener("input", () => {
    updatedWorkSessionDuration = minuteToSeconds(workDurationInput.value)
});

breakDurationInput.addEventListener("input", () => {
    updatedBreakSessionDuration = minuteToSeconds(breakDurationInput.value)
});

function Refresh() {
    setTimeout("location.reload(true);");
    targetDiv.style.display = "none";
};

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
    if (isClockRunning === true){
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

const displayCurrentTimeLeftInSession = () => {
    const secondsLeft = currentTimeLeftSession;
    let result = "";
    const seconds = secondsLeft % 60;
    const minutes = parseInt(secondsLeft / 60) % 60;
    function addLeadingZeroes(time) {
        return time < 10 ? `0${time}` : time;
    }
    result += `${addLeadingZeroes(minutes)}:${addLeadingZeroes(seconds)}`;
    progressBar.text.innerText = result.toString();
};
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
            currentTaskLabel.value = 'Break';
            currentTaskLabel.disabled = true;
        } else{
            currentTimeLeftSession = workSessionDuration;
            type = 'Work'
            setUpdatedTimers()
            if (currentTaskLabel.value === 'Break'){
                currentTaskLabel.value = workSessionLabel;
            }
            currentTaskLabel.disabled = false;
        }
    if(type === work){
        currentTimeLeftSession = breakSessionDuration
        type = 'Break'
    } else {
        currentTimeLeftSession = workSessionDuration
        type = 'Work'
        }
    }
    displayCurrentTimeLeftInSession()
};

const setUpdatedTimers = () => {
    if(type === 'Work'){
        currentTimeLeftSession = updatedWorkSessionDuration ? updatedWorkSessionDuration : workSessionDuration
        workSessionDuration = currentTimeLeftSession
    } else {
        currentTimeLeftSession = updatedBreakSessionDuration ? updatedBreakSessionDuration : breakSessionDuration
        breakSessionDuration = currentTimeLeftSession
    }
};

const calculateSessionProgress = () => {
    // calculate the completion rate of this session
    const sessionDuration =
      type === "Work" ? workSessionDuration : breakSessionDuration;
    return (timeSpentInCurrentSession / sessionDuration) * 1;
};

playAudioButton.onclick = function () {
    studyAudio.play();	 
};

pauseAudioButton.onclick = function () {
    studyAudio.pause();
};
});

