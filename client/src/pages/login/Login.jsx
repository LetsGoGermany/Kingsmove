import { useEffect } from "react";
import Login from "../../components/form/Form"
import Navbar from "../../components/navbar/Navbar"
import socket from "../../lib/socket"
import { useNavigate } from "react-router-dom";

export default function LogIn() {
    const form = {
        inputs: [
            { type: "text", name: "user_mail", placeholder: "Email" },
            { type: "password", name: "user_password", placeholder: "Password" }
        ],
        conditions: false,
        title: "Log In",
        links: [
            { title: "You are new to Kingsmove? Click here to create an new Account", to: "/signup" },
        ],
        msg: "userAttemptToLogIn"
    }

    const navigate = useNavigate();

    useEffect(() => {
        socket.on("userLoggedInSucess", goBack)

        function goBack() {
            navigate("/");
        }
        return () => {
            socket.off("userLoggedInSucess", goBack)
        }
    },[])


    return (
        <>
            <Navbar />
            <div className="cover">
                <Login {...form} />
            </div>
        </>
    )
}

