
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
    placeFigures(data.game.board,board,data.color)
    makeMoveHandler(board)
    makeFieldMoveMarkers(move,data.color)
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
    moveFigureByone(data,game.color)
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
    placeFigures(standartBoard ,board, game.color)

    if(index<0) return
    const moves = game.game.moves
    index--

    for(i=0;i<=index;i++) {
    moveFigureByone(moves[i],game.color)
   }

   isCurrentGameSkipped = true
}

function moveFigureByone(move,color) {

    const [newY,newX,oldY,oldX] = getMoveFieldsIndexes(move,color)

    const oldIndex = oldY * 8 + oldX
    const newIndex = newY * 8 + newX
    board.children[newIndex].innerHTML = ""

    makeFieldMoveMarkers(move,color)
    
    board.children[newIndex].appendChild(board.children[oldIndex].firstChild)
    specialMoves(move,[newY,newX,oldY],newIndex,color)
}

function makeFieldMoveMarkers(move,color) {
    if(move === undefined) return

    const [newY,newX,oldY,oldX] = getMoveFieldsIndexes(move,color)

    const newIndex = newY * 8 + newX
    const oldIndex = oldY * 8 + oldX

    clearFieldTags()

    board.children[newIndex].classList.add("new-field-marker")
    board.children[oldIndex].classList.add("old-field-marker")
}


function getMoveFieldsIndexes(move,color) {
    const [start, modifyer] = color === "white" ? [0,1] : [7,-1]

    const newY = start + modifyer * (7-move[1][1])
    const newX = start + modifyer * move[1][0] 
    const oldY = start + modifyer * (7-move[0][1])
    const oldX = start + modifyer * move[0][0]

    return [newY,newX,oldY,oldX]
}


function specialMoves(move,[newY,newX,oldY],newIndex,color) {
    const [r1,r2] = color === "white" ? [3,5] : [2,4]
    if(move.length < 3) return
      if(move[2].includes("=")) {
        const pawn = board.children[newIndex].firstChild
        const newFigure = move[2].split("=").join("")
        pawn.dataset.figureType = newFigure
        designFigures("classic")
    }
    if(move[2] === "O-O") {
        const rookX = newX === 1 ? 0 : 7
        const newRookX = rookX === 0 ? r1 : r2
        const row = newY * 8
        board.children[row+newRookX].appendChild(board.children[row+rookX].firstChild) 
    }
    if(move[2] === "e.P.") {
        const row = oldY * 8
        const col = newX
        board.children[row+col].innerHTML = ""
    }
}

function skipGameForward(game) {
    const moves = game.game.moves
    const length = moves.length
    if(index+1 >= length) return 
    if(index+2==length) makeMoveHandler(board)
    index++
    moveFigureByone(moves[index],game.color)
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