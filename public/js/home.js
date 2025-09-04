
let gameID = localStorage.getItem("currentGameID")
let index = null;
let game = null;

socket.emit("requestGameByID",[gameID,localStorage.getItem("sessionId")])

socket.on("sendLegalMoves",(data) => showMovesMarker(data))



socket.on("newBoard",(data) => {
    showOpenGames(data.openGames)
    if(data.game._id !== localStorage.getItem("currentGameID")) return
    game = data
    if(data.game.finished === true) showResultScreen(data)
    clearFieldTags()
    const len = data.game.moves.length
    const currentMove = index+2 === len && index != null
    showNames(data.names,data.color,data.game.toMove)

    if(currentMove) return skipGameForward(data)

    const move = data.game.moves[len-1]

    index = data.game.moves.length - 1 
    placeFigures(data.game.board,board)
    makeMoveHandler(board)
    makeFieldMoveMarkers(move)
    if(data.color == "black") rotateBoard(board)
})


function showNames(names, color, toMove) {
    const upperName = document.querySelector(".upper-section .profile-info-name")
    const lowername = document.querySelector(".lower-section .profile-info-name")

    document.querySelectorAll(".profile-info-name").forEach(element => element.classList.remove("currentnameToPlay"))
    const whiteName = color === "white" ? upperName : lowername
    const blackName = color === "black" ? upperName : lowername
    whiteName.textContent = names[0].user_name
    blackName.textContent = names[1].user_name
    const currentNameToMove = toMove === "white" ? blackName : whiteName
    currentNameToMove.classList.add("currentnameToPlay")
}

socket.on("pawnConvertRequest", (data) => {
    moveFigureByone(data)
    const y = data[1][1]
    const x = data[1][0]
    const fieldIndex = (7-y) * 8 + x
    const element = document.querySelector(".pawn-convert-menu")
    element.dataset.positionBefore = data[0]
    element.style.display = "grid"
    board.children[fieldIndex].appendChild(element)
})

document.addEventListener("keydown", (event) => {
    if(event.key === "ArrowLeft") skipGameBack(game)
})

document.addEventListener("keydown", (event) => {
    if(event.key === "ArrowRight") skipGameForward(game)
})

const board = chessboard

createBoard(board)
designFigures("classic")

function skipGameBack(game) {
    placeFigures(standartBoard ,board)
    if(game.color === "black") {
    const figures = Array.from(board.querySelectorAll(".figure"))
    figures.forEach(figure => figure.style.transform = "rotate(180deg)")
   }
      if(index<0) return
    const moves = game.game.moves
    index--
   for(i=0;i<=index;i++) {
    moveFigureByone(moves[i])
   }
   if(game.color === "black") {
    const figures = Array.from(board.querySelectorAll(".figure"))
    figures.forEach(figure => figure.style.transform = "rotate(180deg)")
   }
   isCurrentGameSkipped = true
}

function moveFigureByone(move) {
    const oldY = move[0][1]
    const oldX = move[0][0]
    const newY= move[1][1]
    const newX = move[1][0]
    const oldIndex = (7 - oldY) * 8 + oldX
    const newIndex = (7 - newY) * 8 + newX
    board.children[newIndex].innerHTML = ""

    makeFieldMoveMarkers(move)

    
    board.children[newIndex].appendChild(board.children[oldIndex].firstChild)
    specialMoves(move,newIndex)
}

function makeFieldMoveMarkers(move) {
    if(move === undefined) return
    const newIndex = (7-move[1][1]) * 8 + move[1][0]
    const oldIndex = (7-move[0][1]) * 8 + move[0][0]
    const fields = Array.from(board.querySelectorAll(".field"))
    fields.forEach(field => {
        field.classList.remove("new-field-marker")
        field.classList.remove("old-field-marker")
    })
    board.children[newIndex].classList.add("new-field-marker")
    board.children[oldIndex].classList.add("old-field-marker")

}

function specialMoves(move,newIndex) {
    if(move.length < 3) return
      if(move[2].includes("=")) {
        const pawn = board.children[newIndex].firstChild
        const newFigure = move[2].split("=").join("")
        pawn.dataset.figureType = newFigure
        designFigures("classic")
    }
    if(move[2] === "O-O") {
        const rookX = move[1][0] === 1 ? 0 : 7
        const newRookX = rookX === 0 ? 3 : 5
        const row = (7- move[1][1]) * 8
        board.children[row+newRookX].appendChild(board.children[row+rookX].firstChild) 
    }
    if(move[2] === "e.P.") {
        const row = (7-move[0][1]) * 8
        const col = move[1][0]
        board.children[row+col].innerHTML = ""
    }
}

function skipGameForward(game) {
    const moves = game.game.moves
    const length = moves.length
    if(index+1 >= length) return 
    if(index+2==length) makeMoveHandler(board)
    index++
    moveFigureByone(moves[index])
}


function askToConvertPawn(figure,field) {
    const x = parseInt(field.parentNode.parentNode.dataset.x)
    const y = parseInt(field.parentNode.parentNode.dataset.y)
    const oldMove = field.parentNode.dataset.positionBefore
    const oldX = parseInt(oldMove[0])
    const oldY = parseInt(oldMove[2])
        const move = {
            from: [oldX,oldY],
            to: [x,y],
            sessionId: localStorage.getItem("sessionId"),
            gameID: localStorage.getItem("currentGameID"),
            figure: figure
        }
    socket.emit("sendPawnConvertMove",move)
}

const standartBoard = loadBoard()