const socket = io()


const inputs = Array.from(document.querySelectorAll(".input-section input"))
const output = document.getElementById("loginErrorOutput")
inputs.forEach(element => element.addEventListener("keydown", jumpBack))

function editVerifyInput(input) {
    inputs.forEach(element => element.value = element.value.replace(/[^0-9]/g, ''))
    const number = inputs.indexOf(input)
    if(input.value != "" && number < 5) {
        inputs[number+1].focus()
    }
}

function jumpBack(key) {
    if(key.key != "Backspace") return
    const number = inputs.indexOf(key.target)
    if(number == 0 || number == 5 && key.target.value != "") return
    inputs[number -1 ].focus()
}


const verifyConfirmButton = document.getElementById("verifyConfirmButton")

verifyConfirmButton.addEventListener("click", sendVerification)

function sendVerification() {
        code = inputs.map(element => element.value).join("")
    const data = {
            code: code,
            user_id: localStorage.getItem("user_id")
    }
    socket.emit("userVerificationCode",data)
}

socket.on("userLoggedIn",(data) => {
    localStorage.setItem("user_id",data.user_id)
    console.log(data.sessionId)
    localStorage.setItem("sessionId",data.sessionId)
    localStorage.setItem("loggedIn", true)
    window.location.replace("/")
})

socket.on("userVerificationError",(data) => {
    output.textContent = data
})