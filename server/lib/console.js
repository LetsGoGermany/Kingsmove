import { getIO } from "./socket.js"


function consoleClient(socket) {
    socket.emit("connected",)
    socket.emit("consoleMSG", { type: "info", msg: "Connection to server established" })
}

function sendMSG(data) {
    const io = getIO()
    io.emit("consoleMSG", data)
}

function fullError(err) {
    return JSON.stringify(err, Object.getOwnPropertyNames(err))
}

function errorMSG(err) {
    return err.toString()
}

export default {
    consoleClient,
    sendMSG,
    fullError,
    errorMSG,
}