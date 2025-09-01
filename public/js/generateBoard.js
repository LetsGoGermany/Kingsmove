
let currentFigureSelected = null;
let currentFieldSelected = null;
let currentFigureMoving = null;
let isCurrentGameSkipped = false
let moveMade = false;

function createBoard(gameBoard) {
    gameBoard.innerHTML = "";
    for (y = 7; y >= 0; y--) {
        for (x = 0; x < 8; x++) {
            newField(x, y, gameBoard)
        }
    }
    switchBoardTheme("classic")
}


function newField(x, y, gameBoard) {
    const div = document.createElement('div');
    div.classList.add("field")
    div.dataset.x = x
    div.dataset.y = y
    div.id = `field_${x}_${y}`;
    div.setAttribute("dragenter", "console.log(1)");
    gameBoard.appendChild(div)
}

function placeFigures(data, gameBoard) {
    currentFigureSelected = null
    createBoard(gameBoard)
    for (y = 7; y >= 0; y--) {
        for (x = 0; x < 8; x++) {
            placeFigure(data[y][x], x, y, gameBoard)
        }
    }
    designFigures("classic")
}

function placeFigure(fig, x, y, gameBoard) {
    if (fig.fieldType != "figure") return
    const figure = document.createElement("img")
    figure.dataset.figureType = fig.figureType
    figure.dataset.figureColor = fig.figureColor
    figure.classList.add("figure")
    figure.draggable = false;
    figure.addEventListener("mousedown", startDraggingFigure)

    const row = 7 - y
    const element = 8 * row + x
    field = gameBoard.children[element]
    field.appendChild(figure)

}

 document.addEventListener("mousemove", moveFigureWithmouse)
 document.addEventListener("mouseup", endDraggingFigure)

function makeMoveHandler(board) {
    const fields = board.children
    Array.from(fields).forEach(field => {
        field.addEventListener("click", (event) => handleFigureInput(event.currentTarget))
    })
    isCurrentGameSkipped = false

}


function handleFigureInput(field) {
    if(field === null) return false
    if (field.classList.contains("movable-field")) return sendPieceMove(field)
    if (field.childElementCount > 0) return getPossibleMoves(field.firstChild)
}

function getPossibleMoves(figure) {
    const x = parseInt(figure.parentNode.dataset.x)
    const y = parseInt(figure.parentNode.dataset.y)
    currentFigureSelected = figure
    socket.emit("askForLegalMoves", [x, y, localStorage.getItem("currentGameID"), localStorage.getItem("sessionId")])
}

function showMovesMarker(data) {
    clearFieldTags()
    data.forEach(field => {
        const fieldDiv = document.getElementById(`field_${field[0]}_${field[1]}`)
        fieldDiv.classList.add("movable-field")
        if (fieldDiv.childElementCount > 0) fieldDiv.classList.add("takeable-field")
    })
}

function clearFieldTags() {
    const fields = Array.from(document.querySelectorAll(".field"))
    fields.forEach(field => {
        field.classList.remove("movable-field")
        field.classList.remove("takeable-field")
    })
}

function sendPieceMove(field) {
    const newX = parseInt(field.dataset.x)
    const newY = parseInt(field.dataset.y)
    const oldX = parseInt(currentFigureSelected.parentNode.dataset.x)
    const oldY = parseInt(currentFigureSelected.parentNode.dataset.y)
    socket.emit("sendMoveRequest", [[oldX, oldY], [newX, newY], localStorage.getItem("currentGameID"), localStorage.getItem("sessionId")])
}

function rotateBoard(board) {
    board.classList.add("rotated")
}

const resultDialog = document.getElementById("resultDialog")

function showResultScreen(game) {

    resultDialog.showModal()
    const title = document.querySelector(".result-screen-title")
    if (game.game.winner === null) {
        title.textContent = `Stalemate! Nobody has won the game.`
    } else {
        title.textContent = `${game.game.winner} has won the game by Mate!`
    }
}

function startDraggingFigure(event) {
    event.preventDefault()
    if(isCurrentGameSkipped) return
    currentFigureMoving = event.target
    setPositonOfFigure(event, currentFigureMoving)
    event.target.classList.add("movable-figure")
    handleFigureInput(event.target.parentNode)
}

function setPositonOfFigure(event, figure) {
    const boardBox = figure.parentNode.getBoundingClientRect()
    
    const x = event.clientX - boardBox.left
    const y = event.clientY - boardBox.top
    console.log(board.classList.contains("rotated"))
    if(board.classList.contains("rotated")) {
        figure.style.right = x + "px"
        figure.style.bottom = y + "px"
    } else {
        figure.style.left = x + "px"
        figure.style.top = y + "px"
    }

}

function endDraggingFigure(event) {
    event.preventDefault()
    if(currentFigureMoving === null) return
  
    currentFigureMoving.classList.remove("movable-figure")

    handleFigureInput(document.elementFromPoint(event.clientX,event.clientY))
    
    if(board.classList.contains("rotated")) {
        currentFigureMoving.style.bottom = 0;
        currentFigureMoving.style.right = 0;
    } else {
         currentFigureMoving.style.top = 0;
         currentFigureMoving.style.left = 0;
    }

    if(document.elementFromPoint(event.clientX,event.clientY).classList.contains("movable-field")) {
        document.elementFromPoint(event.clientX,event.clientY).innerHTML = ""
        document.elementFromPoint(event.clientX,event.clientY).appendChild(currentFigureMoving)
        moveMade = true;
        
    }
    currentFigureMoving = null
}

function moveFigureWithmouse(event) {
    if(currentFigureMoving === null) return
    setPositonOfFigure(event,currentFigureMoving)
}
