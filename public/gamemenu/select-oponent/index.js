const params = new URLSearchParams(window.location.search);
const time = params.get("time");
const bonusTime = params.get("bonustime");
const color = params.get("color");

function startGameByCode() {
    const settings = {
        time: [time,bonusTime],
        color: color,
        sessionID: localStorage.getItem("sessionId")
    }
    socket.emit("startGameByCode", settings); 
}

socket.on("gameRequestAccepted",(code) => {
    window.location.href = `code?code=${code}`
})