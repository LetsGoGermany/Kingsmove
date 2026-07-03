
const socket = io();
const status = document.querySelector(".status")

socket.on("connected", (data) => {
  status.classList.remove("offline")
  status.classList.add("online")
  status.textContent = "ONLINE"
})


socket.on("consoleMSG", (data) => {
  console.log(data)
  makeLog(data)
})

const logContainer = document.querySelector(".log-container")

socket.on("disconnect", () => {
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

document.addEventListener("click", e => {
  if (!e.target.classList.contains("toggle")) return

  const log = e.target.closest(".log")
  log.classList.toggle("open")
})


function makeLog({ type, msg, data}) {
  console.log(typeof data)
  if(data) {
  data = data.replace(/\\n/g, "<p></p>")
  }
  const time = new Date().toLocaleTimeString()
  logContainer.innerHTML += `
      <div class="log ${type}">
  <span class="time">${time}</span>
  <span class="level">${type.toUpperCase()}</span>
  <span class="text">
    ${msg}
    <button class="toggle">Details</button>
  </span>

  <div class="details">
    <p>${data || "No further Information"}</p>
  </div>
</div>`
}