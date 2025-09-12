
require("./mongoConncection");

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

server.listen(1887, () => {
  console.log("Server läuft auf Port 1887");
});


io.on('connection', onConnected);

const sessionLoader = require("./session/session");
const gameLoader = require("./board/gameLoader");
const game = require("./board/index")

function onConnected(socket) {

socket.on("loadGame",() => gameLoader.newGame(socket))

socket.on("requestGameByID", (data) => {
  gameLoader.sendGame(data[1],data[0],socket)
})

socket.on("newUserSignUp",(data, callback) => addUser(data,socket,callback)) //Adds new User to the Database

socket.on("verifyAccount", (data) => handleVerificationFeedback(data,socket))

socket.on("userVerificationCode", (data) => userTriedToVerifyAccount(data,socket))

socket.on("askForLegalMoves",async (data,callback) => {
  const moves = await game.legalMoves(data.splice(0,2),data[0],data[1]);
  console.log(callback)
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


const db = require('./database');

const mail = require('./mail');
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
    const signUpSucessfull = await db.tryToVerifyeUser(data.verificationCode,data.user_id)
        socket.emit("accountVerified",signUpSucessfull)
    }

async function checkForChorrectInput(data) {
      if(JSON.stringify(Object.keys(data)) != JSON.stringify(["user_name","user_mail","user_password"])) return "Hacker detected"

      if(typeof(data.user_password) != "string" || typeof(data.user_mail) != "string" || typeof(data.user_name) != "string") return "Invalid Input"
      if(data.user_name.length > 15 || data.user_name.length < 4) return "Username must be between 4 and 15 characters long"
      if(data.user_mail.length > 254 || data.user_mail.length <= 5) return "Invalid Input"
      if(data.user_password.length > 72 || data.user_mail.length <= 0) return "Invalid Input"
      if(userExist = await db.doesUserExist(data.user_name,"name") == true) return "Username already exists"
      if(userExist = await db.doesUserExist(data.user_mail,"email") == true) return "Email already exists"
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

