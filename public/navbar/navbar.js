
const sessionID = localStorage.getItem("sessionId")
const ID = localStorage.getItem("user_id")
const loggedIn = localStorage.getItem("loggedIn")

function loadNavbar() {
fetch("/navbar/")
  .then(res => res.text())
  .then(data => {
    document.getElementById("navbar").innerHTML = data;
  })
  .then(() => {
    if (loggedIn === "false") return
    socket.emit("checkSession", sessionID)
  })
}

socket.on("sessionCorrect", (data) => {
  if (data === null) return
  document.getElementById("loginIMG").src = "/gamedesign/navabar_logo/logout.png"
  document.getElementById("loginStatusText").textContent = "Log Out"
  document.getElementById("loginButtonLink").href = "#"
  document.getElementById("loginButtonLink").setAttribute("onclick", "logOut()")
  socket.emit("sendProfileInfo", data, (response) => {
    showOpenGames(response)
  })
})

function showOpenGames(response) {
  const navbarText = document.querySelector(".history-navbar-text")
  navbarText.dataset.value = response;//TODO:
  if(response > 0) {
    navbarText.classList.remove("hide-before")
  } else {
    navbarText.classList.add("hide-before")
  }
}

function logOut() {
  localStorage.removeItem("user_id")
  localStorage.setItem("loggedIn", false)
  window.location.href = "/"
  socket.emit("sessionEndet", localStorage.getItem("sessionId"))
  localStorage.removeItem("sessionId")
}

function toggleDarkmode() {
  const darkmode = localStorage.getItem("darkmode")

  switch (darkmode) {
    case "true":
      disableDarkMode()
      break;
    default:
      enableDarkMode()
      break;
  }
}


function enableDarkMode() {
  localStorage.setItem("darkmode", true)
  document.body.classList.remove("lightmode")
}

function disableDarkMode() {
  localStorage.setItem("darkmode", false)
  document.body.classList.add("lightmode")
}

function initiateDarkMode() {
  const darkmode = localStorage.getItem("darkmode")

  if (darkmode === "true") {
    enableDarkMode()
  } else {
    disableDarkMode()
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initiateDarkMode();
  loadNavbar()
});