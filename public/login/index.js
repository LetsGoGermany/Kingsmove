const loginErrorOutput = document.getElementById('loginErrorOutput');

function tryToLogIn() {
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;
    if(email.trim() === "") return loginErrorOutput.textContent = "Please enter your email.";
    if(password.trim() === "") return loginErrorOutput.textContent = "Please enter your password.";
    const data = {
        user_mail: email,
        user_password: password
    }
    socket.emit("userAttemptToLogIn",data)
}

socket.on("errorInLogIn", (data) => loginErrorOutput.textContent = data)

socket.on("userLoggedInSucess",(data) => {
    localStorage.setItem("user_id",data.user_id)
    localStorage.setItem("sessionId",data.sessionId)
    localStorage.setItem("loggedIn", true)
    window.location.replace("/")
})

