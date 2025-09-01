const socket = io();

const registerButton = document.getElementById('registerButton');
const loginErrorOutput = document.getElementById('loginErrorOutput');
const acceptTerms = document.getElementById('acceptTerms');

registerButton.addEventListener("click", tryToRegistrate);

function tryToRegistrate() {
    const inputs = Array.from(document.querySelectorAll('.input-section input'));

    const gapsFilled = inputs.every(element => element.value.trim() != "")
     
    if(!gapsFilled) {
            loginErrorOutput.textContent = "Please fill all fields!";
    } else  if(!acceptTerms.classList.contains("checked")) {
            loginErrorOutput.textContent = "Please accept the terms & conditions!";
    } else {
        socket.emit("newUserSignUp",userVerificationData(inputs))
    }
}

socket.on("userRegistrationInError",value => loginErrorOutput.textContent = value)

function userVerificationData(inputs) {
        return {
            "user_name": inputs[0].value.trim(),
            "user_mail": inputs[1].value.trim(),
            "user_password": inputs[2].value.trim(),
        }
}


socket.on("userRegistrationSucess",(data) => {userRegistrationSucess(data)})

function userRegistrationSucess(userID) {
    localStorage.setItem("user_id",userID)
    window.location.href = "/verify-account"
}