const socket = io();

socket.on("gameStarted", (data) => {
    localStorage.setItem("currentGameID", data);
    window.location.href = "/"
})

