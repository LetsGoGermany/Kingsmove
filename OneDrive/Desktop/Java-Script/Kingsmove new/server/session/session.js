const userSession = require('./sessionModel');
const mongoose = require('mongoose');

const connectedAccounts = new Map()

async function addUserSession(object) {
    const sessionObject = { user_id: object[0] }
    const session = new userSession(sessionObject)
    await session.save()
    return session._id
}

async function verifyUserSession(session, socket) {
    const object = await checkusersSession(session)

    if (object) {
        connectedAccounts.set(socket, object.user_id)
    }

    socket.emit("userLoggedInSucess", object)
}

async function checkusersSession(sessionID) {
    if (!mongoose.Types.ObjectId.isValid(sessionID)) return console.log("Fehler beim ausführen, checkUserSession")
    const id = new mongoose.Types.ObjectId(sessionID)
    const object = await userSession.findOne({ _id: id })
    return object
}

async function endSession(sessionID) {
  console.log(sessionID)
  if (!mongoose.Types.ObjectId.isValid(sessionID)) return console.log("Fehler beim ausführen, endSession")
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

function getAllSessionFromGame(white,black) {
  return [...connectedAccounts.entries()].filter(account => account[1] == white || account[1] == black)
}

module.exports = {
    addUserSession,
    verifyUserSession,
    checkusersSession,
    removeAccount,
    getIdBySession,
    endSession,
    getAllSessionFromGame,
}