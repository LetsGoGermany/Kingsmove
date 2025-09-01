function editVerifyInput(input) {
    input.value = input.value.replace(/[^0-9]/g, '')
}


socket.on("sessionCorrect", (correct) => {

if(correct === null) return

const params = new URLSearchParams(window.location.search).get("code");
 
const userLoggedIn = localStorage.getItem("loggedIn");
if(userLoggedIn === "false") window.location.replace("/")

const sessionId = localStorage.getItem("sessionId");

const data = {
    "code": params,
    "sessionId": sessionId
}

if(params !== null && params.length === 6) socket.emit("joinGameByCode",data)

})

