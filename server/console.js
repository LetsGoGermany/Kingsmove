let io = require("./app.js").io

function consoleClient(socket,io) {
    socket.emit("connected",)
    sendMSG({type:"info",msg:"Connection to server established"})
}

function sendMSG({type,msg}) {
    io.emit("consoleMSG", {
        type,
        msg,
    })
}

module.exports = {consoleClient}