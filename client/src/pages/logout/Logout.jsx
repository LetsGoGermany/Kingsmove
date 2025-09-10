import { useEffect } from "react";
import socket from "../../lib/socket";
import { useNavigate } from "react-router-dom";

export default function LogOut() {
    const navigate = useNavigate()
    useEffect(() => {
          socket.emit("sessionEndet", localStorage.getItem("sessionid"))
          localStorage.removeItem("sessionid")
          navigate("/")
          console.log("sessionOver")
    },[navigate])
    
  
    return (
        <h1>Du wirst in kürze zur Startseite zurück geleitet</h1>
    )
}