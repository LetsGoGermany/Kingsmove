import userSession from './sessionModel.js';
import mongoose from 'mongoose';
import log from "../lib/console.js"
import gameLoader from "../board/gameLoader.js"

const connectedAccounts = new Map()

async function addUserSession(object) {
  const sessionObject = { user_id: object[0] }
  const session = new userSession(sessionObject)
  await session.save()
  return session._id
}

async function verifyUserSession(session, socket) {
  

  const object = await checkusersSession(session)
  if(object === undefined) return
  if (object) {
    connectedAccounts.set(socket, object)
  }
  const games = await gameLoader.sendAllGamesOfAccount(object._id)
  const {_id, user_id} = object

  socket.emit("userLoggedInSucess",{_id,user_id,games})
}

async function checkusersSession(sessionID) {
  if (!mongoose.Types.ObjectId.isValid(sessionID)) return console.trace("Fehler beim ausführen, checkUserSession")
  const id = new mongoose.Types.ObjectId(sessionID)
  const object = await userSession.findOne({ _id: id })
  return object
}

async function endSession(sessionID) {
  if (!mongoose.Types.ObjectId.isValid(sessionID)) return  log.sendMSG({type:"warn",msg:`Failed to end session.`,data:`The SessionID: ${sessionID} is not Valid`})
  log.sendMSG({type:"info",msg:`Die Session wurde mit der ID: ${sessionID} wurde beendet`})
  await userSession.findByIdAndDelete(sessionID)
}

function removeAccount(socket) {
  connectedAccounts.delete(socket)
}

async function getIdBySession(session) {
  try {
    const object = await userSession.findById(session)
    return object.user_id
  } catch (error) {
    console.warn(error, "\n l.188 mongo")
  }
}

function getAllSessionFromGame(white, black) {
  return [...connectedAccounts.entries()].filter(account => account[1].user_id == white || account[1].user_id == black)
}

export default {
  addUserSession,
  verifyUserSession,
  checkusersSession,
  removeAccount,
  getIdBySession,
  endSession,
  getAllSessionFromGame,
}