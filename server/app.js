
import "./lib/mongoConncection.js";

import express from "express";
import http from "http";
import cors from 'cors';
import fs from "fs";

const app = express();
app.use(express.json())

const server = http.createServer(app);

import { Server } from "socket.io"
import { setIO } from "./lib/socket.js"

const io = new Server(server)
setIO(io)

import generateBoard from "./board/generateBoard.js"
import log from "./lib/console.js"
import sessionLoader from "./session/session.js";
import gameLoader from "./board/gameLoader.js";
import game from "./board/index.js";
import db from './lib/database.js';
import mail from './lib/mail.js';

app.use(cors());

server.listen(1887, () => {
  console.log("Server läuft auf Port 1887");
});





io.on('connection', onConnected);
io.on("connection",(socket) => {log.consoleClient(socket,io)})

function onConnected(socket) {

socket.on("loadGame",() => gameLoader.newGame(socket))

socket.on("requestGameByID", (data) => {
  gameLoader.sendGame(data[1],data[0],socket)
})

socket.on("newUserSignUp",(data, callback) => addUser(data,socket,callback || function(){})) //Adds new User to the Database

socket.on("verifyAccount", (data) => handleVerificationFeedback(data,socket))

socket.on("userVerificationCode", (data) => userTriedToVerifyAccount(data,socket))

socket.on("askForLegalMoves",async (data,callback) => {
  const moves = await game.legalMoves(data.splice(0,2),data[0],data[1]);
  callback(moves)
})

socket.on("sendMoveRequest",(data) => {
  game.processMove(data.splice(0,2),data[0],data[1],socket)
})

socket.on("checkSession",(data) => {
  sessionLoader.verifyUserSession(data,socket)
})

socket.on("sessionEndet",(data) => sessionLoader.endSession(data))

socket.on("userAttemptToLogIn",(data,callback) => {
  db.userLogInAttempt(data,socket,callback)
})

socket.on("startGameByCode",(data) => gameLoader.startGameByCode(data,socket))

socket.on("joinGameByCode", (data) => gameLoader.joinGameByCode(data,socket))

socket.on("disconnect", () => sessionLoader.removeAccount(socket))

//socket.on("requestAllGamesOnAccount", (data) => gameLoader.sendAllGamesOfAccount(data, socket)) 

socket.on("sendPawnConvertMove", (data) => game.processPawnConvert(data,socket))

socket.on("sendProfileInfo", async (data, callback) => callback(await gameLoader.getOpenGamesLength(data)))
}


const letters = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I",
  "J", "K", "L", "M", "N", "O", "P", "Q", "R",
  "S", "T", "U", "V", "W", "X", "Y", "Z", "0",
  "1", "2", "3", "4", "5", "6", "7", "8", "9",
];



async function addUser(data,socket,callback) {

  const inputCoreckt = await checkForChorrectInput(data,socket)
  if(inputCoreckt != true) return callback(inputCoreckt)
  console.log("z53:// ", inputCoreckt)

     let id = "RC-" + createID(12) 
  
    data.user_id = id

    const verification = db.newUser(data)

    socket.emit("userRegistrationSucess",data.user_id)
    mail.sendVerificationCode(data.user_mail,verification)
}

    async function handleVerificationFeedback(data,socket) {
      try {
    const signUpSucessfull = await db.tryToVerifyeUser(data.verificationCode,data.user_id)
        socket.emit("accountVerified",signUpSucessfull)
      } catch(err) {
        log.sendMSG({
          type:"error",
          msg: log.errorMSG(err),
          data: log.fullError(err)})
      }
    }


async function checkForChorrectInput(data) {
      if(JSON.stringify(Object.keys(data)) != JSON.stringify(["user_name","user_mail","user_password"])) return "Hacker detected"
  
      if(typeof(data.user_password) != "string" || typeof(data.user_mail) != "string" || typeof(data.user_name) != "string") return "Invalid Input"
      if(data.user_name.length > 15 || data.user_name.length < 4) return "Username must be between 4 and 15 characters long"
      if(data.user_mail.length > 254 || data.user_mail.length <= 5) return "Invalid Input"
      if(data.user_password.length > 72 || data.user_mail.length <= 0) return "Invalid Input"
      if(await db.doesUserExist(data.user_name,"name") == true) return "Username already exists"
      if(await db.doesUserExist(data.user_mail,"email") == true) return "Email already exists"
      return true
}

function createID(limit) {
  id = "";
  for(i=0;i<limit;i++) {
    id += letters[Math.floor(Math.random()*letters.length)]
  }
  return id
}

const deleteUserInterval = setInterval(() => {db.deleteInactiveUsers()},1000)



async function userTriedToVerifyAccount(data,socket) {
  if(JSON.stringify(Object.keys(data)) != JSON.stringify(["code","user_id"]) || data.code === null) return console.log("Ungültige Eingabe")
    const verifySucess = await db.verifyAccount(data)
  if(typeof verifySucess !== "object") return socket.emit("userVerificationError",verifySucess)
    const sessionID = await sessionLoader.addUserSession(verifySucess)
  result = {user_id: verifySucess[0],sessionId: sessionID}
  socket.emit("userLoggedIn", result)
  
}


app.get("/api/standartBoard", (req,res) => {
  res.json(generateBoard())
})

app.use("/api", express.static("board"));


app.get("/",(req,res) => {
  res.send("Das ist der Server")
})

app.use(express.static(new URL("./console", import.meta.url).pathname));

app.get("/console", (req,res) => {

  res.sendFile("console/index.html", {root:__dirname})
})



import Todos from "./todos/Todo.js"
Todos(app)

