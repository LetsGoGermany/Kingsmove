import logo from "./img/logo.png"
import settings from "./img/settings.png"
import friends from "./img/friends.png"
import play from "./img/play.png"
import gameHistory from "./img/game_history.png"
import login from "./img/login.png"
import logout from "./img/logout.png"
import darkmodePNG from "./img/dark-mode.png"
import lightmodePNG from "./img/light-mode.png"

import socket from "../../lib/socket"

import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

import "./navbar.css"

const links = [
  { name: "homeButtonLink", src: logo, to: "", displayName: "" },
  { name: "settingsLink", src: settings, to: "settings", displayName: "Settings" },
  { name: "friendsLink", src: friends, to: "friends", displayName: "Friends" },
  { name: "playLink", src: play, to: "play", displayName: "Play" },
  { name: "historyLink", src: gameHistory, to: "game-history", displayName: "History" },
]

const logButtons = {
  login: { name: "loginLink", src: login, to: "login", displayName: "Login" },
  logout: { name: "logoutLink", src: logout, to: "logout", displayName: "Logout" },
}

export default function Navbar() {
  const [logStatus, setLogStatus] = useState("login")

  useEffect(() => {
   if(localStorage.getItem("sessionid")) socket.emit("checkSession",localStorage.getItem("sessionid"))

    
    socket.on("userLoggedInSucess", handleLoginSucess)
  

    return () => {
    socket.off("userLoggedInSucess")
  }


  }, [])

  function handleLoginSucess(data) {
    if(data === null) return
    setLogStatus("logout")
    localStorage.setItem("sessionid",data._id)
  }

  return (
    <div id="navbar" className="nav">
      <MainList />
      <DarkModeContainer />
      <NavElement props={logButtons[logStatus]} />
    </div>
  )
}

function MainList() {
  return (
    <>
      {links.map(el => <NavElement key={el.displayName} props={el} />)}
    </>
  )
}

function NavElement({ props }) {
  return (
    <Link to={"/" + props.to} className="index-link" id={props.name}>
      <div className="menu-wrapper">
        <img
          src={props.src}
          alt=""
        />
        <p className={`menu-link-text ${props.name}-navbar-text`}>
          {props.displayName}
        </p>
      </div>
    </Link>
  )
}

function DarkModeContainer() {

  const [darkmode,setDarkmode] = useState(JSON.parse(localStorage.getItem("darkmode")) || false)

  function toggleDarkmode() {
    setDarkmode(prev => !prev)
  }

    useEffect(() => {
         document.body.classList.toggle("darkmode", darkmode)
         localStorage.setItem("darkmode", darkmode)
    },[darkmode])


  return (
    <article className="toggle-darkmode-container">
      <div className="toggle-darkmode-wrapper" onClick={() => { toggleDarkmode() }}>
        <button className="darkmode-toggle-button" 
            style={{backgroundImage: `url(${darkmode ? darkmodePNG : lightmodePNG})`}}
        />
      </div>
    </article>
  )
}
