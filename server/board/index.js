
const gameLoader = require("./gameLoader")
const sessionLoader = require("./../session/session")
const possibleMoves = require("./figureMoves")
const ending = require("./checkForGameEnd")


async function legalMoves(figure, gameID, sessionID) {
    const board = await gameLoader.getGame(gameID, sessionID)
    const playerID = await sessionLoader.getIdBySession(sessionID)

    if (!isValidMove(board, playerID, figure)) return []
    return possibleMoves.touchPiece(board.board, figure, playerID)
}

function isValidMove(board, playerID, figure) {
    if (!board , !(figure[0] >= 0), !(figure[1] >= 0)) return false
    const ismove = board[board.toMove] === playerID
    if (!ismove) return false
    if (board?.board[figure[1]][figure[0]].figureColor !== board.toMove) return false
    return true
}

function moveSpamDetected(socket) {
    const date = new Date()
    if (!socket.lastMoveAt) socket.lastMoveAt = 0;
    if(date - socket.lastMoveAt < 200) return true
    socket.lastMoveAt = date
    return false
}

async function processMove(move, gameID, sessionId, socket) {
    if(moveSpamDetected(socket)) return 
    if (invalidInput(move)) return console.trace("Invalid")
    
    const board = await gameLoader.getGame(gameID, sessionId)
    const playerID = await sessionLoader.getIdBySession(sessionId)

    if (!isValidMove(board, playerID, move[0])) return
    if (board.board[move[0][1]][move[0][0]].figureType === "pawn" && (move[1][1] === 0 || move[1][1] === 7)) return
    const figure = board.board[move[0][1]][move[0][0]]
    if (figure.fieldType === "empty") return
    const boardCopy = JSON.parse(JSON.stringify(board.board))

    const fields = possibleMoves.touchPiece(board.board, move[0])
    const invalidMove = fields.findIndex(field => JSON.stringify(field) == JSON.stringify(move[1])) === -1
    if (invalidMove) return

    moveFigure(boardCopy, move, gameID, playerID, move)
}

function resetEnPassent(board) {
    return board.map(row => row.map(element => {
        element.enPassentField = false
        return element
    }))
}

function checkForEnPassent(board,move) {
    const figure = board[move[0][1]][move[0][0]]
    const isPawn = figure.figureType === "pawn"
    if(!isPawn) return resetEnPassent(board)
    const direction = figure.figureColor === "white" ? 1 : -1
    const isDoubleMove = move[1][0] !== move[1][1] + (direction*2)
    if(!isDoubleMove) return resetEnPassent(board)
    board = resetEnPassent(board)
    const y = move[0][1] + direction
    const x = move[1][0]
    board[y][x].enPassentField = true
    return board
}

async function processPawnConvert(move,socket) {
    if(moveSpamDetected(socket)) return

    const board = await gameLoader.getGame(move.gameID, move.sessionId)
    const playerID = await sessionLoader.getIdBySession(move.sessionId)
    if (!isValidMove(board, playerID, move.from)) return
    const validFigures = ["knight", "bishop", "rook", "queen"]
    if(!validFigures.includes(move.figure)) return
    const boardCopy = JSON.parse(JSON.stringify(board.board))
    const fields = possibleMoves.touchPiece(board.board, move.from)
    const invalidMove = fields.findIndex(field => JSON.stringify(field) == JSON.stringify(move.to)) === -1
    if (invalidMove) return

    boardCopy[move.from[1]][move.from[0]].figureType = move.figure
    moveFigure(boardCopy, [move.from,move.to,`=${move.figure}`], move.gameID, playerID)
}

function moveFigure(boardCopy, move, gameID, playerID) {
    boardCopy[move[0][1]][move[0][0]].notMoved = false;
    moveFigurebySpecialMove(boardCopy,move)

    const color = boardCopy[move[0][1]][move[0][0]].figureColor
    boardCopy = checkForEnPassent(boardCopy,move)
    const updatedBoard = changeFields(move[0][0], move[0][1], move[1][0], [move[1][1]], boardCopy)

    
    const gameEndet = ending.status(color, updatedBoard)

    saveNewMove(gameID, updatedBoard, color, gameEndet, move)

}
function moveFigurebySpecialMove(boardCopy,move) {
       if (boardCopy[move[0][1]][move[0][0]].figureType === "king" && (move[1][0] == 2 || move[1][0] == 6) && move[0][0] === 4) {
        move.push("O-O")
        boardCopy = moveRook(boardCopy, move[1])
    }
     if (boardCopy[move[1][1]][move[1][0]].enPassentField === true) {
        move.push("e.P.")
        const y = move[0][1]
        const x = move[1][0]
        boardCopy[y][x] = {fieldType:"empty",movableField:false,enPassentField:false}
     }
    return boardCopy
}

async function saveNewMove(gameID, updatedBoard, playerID, ending, move) {
    await gameLoader.saveMove(gameID, updatedBoard, playerID, ending, move)
}

function moveRook(boardCopy, move) {
    const col = move[0] === 2 ? 0 : 7
    const newCol = move[0] === 2 ? 3 : 5
    boardCopy[move[1]][col].notMoved = false
    return changeFields(col, move[1], newCol, move[1], boardCopy)
}

function invalidInput(moves) {
    if (moves.length != 2) return true
    const result = moves.every(move => {
        if (move[0] < 0) return false
        if (move.length != 2) return false
        if (typeof move[0] != "number" || typeof move[1] != "number") return false
        if (move[0] > 7 || move[0] < 0) return false
        if (move[1] > 7 || move[1] < 0) return false
        return true
    })
    return !result
}

function changeFields(x1, y1, x2, y2, boardCopy) {
    boardCopy[y2][x2] = boardCopy[y1][x1]
    boardCopy[y1][x1] = { fieldType: "empty", movableField: false, enPassentField:false}
    return boardCopy
}

module.exports = { legalMoves, processMove, processPawnConvert }