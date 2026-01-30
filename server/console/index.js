
const socket = io();
const status = document.querySelector(".status")

socket.on("connected", (data) => {
    status.classList.remove("offline")
    status.classList.add("online")
    status.textContent = "ONLINE"
})


socket.on("consoleMSG",(data) => {
    makeLog(data)
})
const logContainer = document.querySelector(".log-container")

socket.on("disconnect",() => {
    status.classList.remove("online")
    status.classList.add("offline")
    status.textContent = "OFFLINE"
    makeLog({
    type: "warn",
    msg: "Connection to the server lost"
  })
})

socket.io.on("reconnect_attempt", () => {
  makeLog({
    type: "warn",
    msg: "Attempting to reconnect to the server"
  })
})

function makeLog({type,msg}) {
    const time = new Date().toLocaleTimeString()
    logContainer.innerHTML += `
      <div class="log ${type}">
        <span class="time">${time}</span>
        <span class="level">${type.toUpperCase()}</span>
        <span class="text">${msg}</span>
      </div>`
}