const startGame = require('./boardModel');
const board = require("./generateBoard")
const db = require("./../database")
const sessionLoader = require("./../session/session")
const userSession = require("./../session/sessionModel")


async function startGameByCode(settings, socket) {

  if (!checkForValidGameSettings(settings)) return

  const userID = await sessionLoader.checkusersSession(settings.sessionID)
  if (userID === undefined) return

  const colors = await makeColors(settings, userID)
  const code = Math.floor(100000 + Math.random() * 900000)
  const gameSettings = new Game(settings, colors, code)
  const game = new startGame(gameSettings)
  await game.save()
  socket.emit("gameRequestAccepted", code)
}

class Game {
  constructor(settings, colors, code) {
    this.board = board.loadBoard()
    this.moves = []
    this.white = colors[0]
    this.black = colors[1]
    this.hasStarted = false
    this.toMove = "white"
    this.finished = false
    this.startDate = new Date()
    this.time = settings.time[0]
    this.bonusTime = settings.time[1]
    this.timerPerMove = false
    this.gameCode = code
  }
}

function checkForValidGameSettings(settings) {

  if (JSON.stringify(Object.keys(settings)) != JSON.stringify(["time", "color", "sessionID"])) return false

  const colors = ["white", "black", "random"]
  if (!colors.includes(settings.color)) return false

  const isValidTime = validTimes().some(setting => setting.every((value, index) => settings.time[index] == value))

  if (!isValidTime) return false

  return true
}


function validTimes() {
  return [
    [1, 0],
    [2, 0],
    [2, 1],
    [3, 0],
    [5, 0],
    [5, 10],
    [10, 0],
    [20, 0],
    [20, 60],
    [30, 0],
    [60, 0],
    [60, 300],
  ];
}

async function makeColors(settings, userID) {

  if (settings.color === "white") return [userID.user_id, null]
  if (settings.color === "black") return [null, userID.user_id]

  const random = Math.floor(Math.random() * 2)
  let result = [null, null]
  result[random] = userID.user_id
  return result
}


async function joinGameByCode(data) {
  if (!/^\d+$/.test(data.code)) return
  const userID = await sessionLoader.checkusersSession(data.sessionId)
  const game = await startGame.findOne({ gameCode: data.code })
  if (!checkIfUserCanJoinGame(userID, game)) return console.trace("Unable to join Game")
  game.white === null ? game.white = userID.user_id : game.black = userID.user_id
  game.hasStarted = true
  await game.save();
  sendGameStarted(game.white, game.black, game._id)
}

function checkIfUserCanJoinGame(userID, game) {
  if (userID === undefined) return false
  if (game === null) return false
  if (game.white === userID.user_id || game.black === userID.user_id) return false
  if (game.hasStarted) return false
  return true
}

function sendGameStarted(white, black, gameID) {
  const accounts = sessionLoader.getAllSessionFromGame(white, black)
  accounts.forEach(element => {
    element[0].emit("gameStarted", gameID)
  });
}

async function sendGame(sessionID, gameID, socket) {
  try {

    const game = await getGame(gameID, sessionID)
    const names = await db.getNamesById([game.white, game.black])
    if (game === null) return console.trace("Game Undefinded")
    const id = await sessionLoader.getIdBySession(sessionID)
    const myColor = game.white === id ? "white" : "black"

    socket.emit("newBoard", await makeBoardObject(game, myColor, names, sessionID))

  } catch (error) { console.trace(error) }
}

async function getGame(gameID, sessionID) {
  try {
    const game = await startGame.findById(gameID)
    const session = await userSession.findById(sessionID)
    if (session === null) return null
    if (game?.white !== session.user_id && game.black !== session.user_id) return null
    return game
  } catch (error) {
    console.trace(error)
    return null
  }
}

async function saveMove(gameID, updatedBoard, color, ending, move) {
  const game = await startGame.findById(gameID)
  if (game?.toMove !== color) return console.trace("Fehler beim Ausführen")

  newGame = updateGame(game, ending, updatedBoard, move)
  try { await newGame.save() } catch (error) { console.trace("/") }

  const accounts = sessionLoader.getAllSessionFromGame(game.white, game.black)
  const names = await db.getNamesById([game.white, game.black])

  for (element of accounts) {
    const games = await sendAllGamesOfAccount(element[1]._id)
    const {user_id,_id} = element[1]
    element[0].emit("userLoggedInSucess",{_id,user_id,games})
  }
}

async function makeBoardObject(game, myColor, names, sessionID) {
  return {
    game: game,
    color: myColor,
    names: names,
    openGames: await getOpenGamesLengthByID(sessionID)
  }
}

function updateGame(game, ending, updatedBoard, move) {
  game.board = updatedBoard
  game.toMove = game.toMove === "white" ? "black" : "white"
  game.finished = ending.ending
  game.winner = ending.winner
  game.moves.push(move)
  return game
}

async function getGames(id) {
  if (id === null) return null
  const games = await startGame.find({
    $or: [
      { white: id },
      { black: id }
    ],
    hasStarted: true
  })
  return games
}

async function sendAllGamesOfAccount(sessionId) {
  const id = await sessionLoader.getIdBySession(sessionId)
  const games = await getGames(id)
  const nameGames = []
  for (const game of games) {
    const gameObject = game.toObject()
    const players = await Promise.all([
      db.getNameById(gameObject.white),
      db.getNameById(gameObject.black)
    ])
      nameGames.push({...gameObject,players})
  }
  return nameGames
}

async function getOpenGamesLength(session) {
  const id = await sessionLoader.getIdBySession(session)
  return await getOpenGamesLengthByID(id)
}

async function getOpenGamesLengthByID(id) {
  const games = await getGames(id)
  return games.filter(game => {
    const myMove = game[game.toMove] === id
    const gameEnd = game.finished
    return myMove && !gameEnd
  }).length
}


module.exports = {
  startGameByCode,
  joinGameByCode,
  sendGame,
  saveMove,
  sendAllGamesOfAccount,
  getOpenGamesLength,
  getGame,
}