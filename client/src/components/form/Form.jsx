import "./Form.css"
import { Link } from "react-router-dom"
import socket from "../../lib/socket"
import { useState } from "react"
export default function Form(form) {

    const [feedback, setFeedback] = useState("")

    function sendForm(msg) {
        const values = {}
        document.querySelectorAll(".form-input").forEach(input => {
            values[input.name] = input.value
        })
        socket.emit(msg, values, (data) => {
            setFeedback(data)
        })
    }

    return (
        <div className="form-main">
            <h1 className="title">{form.title}</h1>
            {form.inputs.map(input => <Input input={input} key={input.name} />)}
            <p className="feedback">{feedback}</p>
            <button className="send-btn" onClick={() => { sendForm(form.msg) }}>Log IN</button>
            {form.links.map(link => <Link
                to={link.to}
                key={link.to}
                className="link"
            >

                {link.title}
            </Link>)}
        </div>
    )
}

function Input({ input }) {
    return (
        <input
            className="form-input"
            type={input.type}
            name={input.name}
            placeholder={input.placeholder}
        ></input>
    )
}

