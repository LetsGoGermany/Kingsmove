const timeButtons = Array.from(document.querySelectorAll(".time-class-button:not(.select-color-button):not(.continue-button)"))
timeButtons.forEach(button => button.addEventListener("click",(event) => switchTime(event.target)))

let time;
let bonusTime;
let color;

const continueButton = document.querySelector(".continue-button");

function switchTime(selectedButton) {
    timeButtons.forEach(button => button.classList.remove("active"))
    selectedButton.classList.add("active")
    const timeValue = JSON.parse(selectedButton.value)
    time = timeValue[0]
    bonusTime = timeValue[1]
    checkToContinue()
}

const colorButtons = Array.from(document.querySelectorAll(".select-color-button"))
colorButtons.forEach(button => button.addEventListener("click", (event) => switchColor(event.target.parentNode)))

function switchColor(selectedButton) {
    colorButtons.forEach(button => button.classList.remove("active"))
    selectedButton.classList.add("active")
    color = selectedButton.value
    checkToContinue()
}

function checkToContinue() {
    if(time !== undefined && bonusTime !== undefined && color !== undefined) {
        continueButton.disabled = false
    }
}

function continueSelection() {
    window.location.href = `select-oponent?time=${encodeURIComponent(time)}&bonustime=${encodeURIComponent(bonusTime)}&color=${encodeURIComponent(color)}`;
}