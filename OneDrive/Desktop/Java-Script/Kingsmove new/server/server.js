const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Erlaube alle Domains, nur für Testing. Später auf Frontend-Domain einschränken.
  },
});

io.on("connection", (socket) => {
    socket.on("msg", (msg) => console.log(msg))
});

server.listen(1887, () => {
  console.log("Server läuft auf Port 1887");
});