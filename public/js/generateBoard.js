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
    gameBoard.addEventListener("touchmove", moveFigureWithmouse)
    gameBoard.addEventListener("touchend", endDraggingFigure)
}


function newField(x, y, gameBoard) {
    const div = document.createElement('div');
    div.classList.add("field")
    div.dataset.x = x
    div.dataset.y = y
    div.id = `field_${x}_${y}`;
    div.addEventListener("mouseenter", (e) => currentFigureMoving === null || e.target.classList.add("hovered-field"))
    div.addEventListener("mouseleave", (e) => e.target.classList.remove("hovered-field"))
    gameBoard.appendChild(div)
}



function placeFigures(data, gameBoard, color) {
    currentFigureSelected = null

    const [start, modifyer] = color === "white" ? [0, 1] : [7, -1]

    createBoard(gameBoard)
    for (y = 7; y >= 0; y--) {
        for (x = 0; x < 8; x++) {
            const posX = start + modifyer * x
            const posY = start + modifyer * y
            placeFigure(data[posY][posX], x, y, gameBoard)
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
    figure.addEventListener("touchstart", startDraggingFigure)
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
        field.addEventListener("click", (event) => {
            if (!event.currentTarget.classList.contains("movable-field")) return
            handleFigureInput(event.currentTarget)
        })
    })
    isCurrentGameSkipped = false

}


function handleFigureInput(field) {
    if (field === null) return false
    console.log(field)
    if (field.classList.contains("movable-field")) return sendPieceMove(field)
    if (field.childElementCount > 0) return getPossibleMoves(field.firstChild)
}

function getPossibleMoves(figure) {
    const x = parseInt(figure.parentNode.dataset.x)
    const y = parseInt(figure.parentNode.dataset.y)
    const [start, modifyer] = game.color === "white" ? [0, 1] : [7, -1]
    const realX = start + modifyer * x
    const realY = start + modifyer * y

    currentFigureSelected = figure
    socket.emit("askForLegalMoves", [realX, realY, localStorage.getItem("currentGameID"), localStorage.getItem("sessionId")])
}

function showMovesMarker(data) {
    clearFieldTags()
    const [start, modifyer] = game.color === "white" ? [0, 1] : [7, -1]
    data.forEach(field => {
        const fieldname = `field_${start + modifyer * field[0]}_${start + modifyer * field[1]}`
        const fieldDiv = document.getElementById(fieldname)
        fieldDiv.classList.add("movable-field")
        if (fieldDiv.childElementCount > 0) fieldDiv.classList.add("takeable-field")
    })
}

function clearFieldTags() {
    const fields = Array.from(document.querySelectorAll(".field"))
    fields.forEach(field => {
        field.classList.remove("movable-field")
        field.classList.remove("takeable-field")
        field.classList.remove("new-field-marker")
        field.classList.remove("old-field-marker")
    })
}

function sendPieceMove(field) {
    const newX = parseInt(field.dataset.x)
    const newY = parseInt(field.dataset.y)
    const oldX = parseInt(currentFigureSelected.parentNode.dataset.x)
    const oldY = parseInt(currentFigureSelected.parentNode.dataset.y)
    const [rnX, rlY, roX, roY] = makeFullMoveReal([newX, newY, oldX, oldY])
    console.log([roX, roY], [rnX, rlY])
    socket.emit("sendMoveRequest", [[roX, roY], [rnX, rlY], localStorage.getItem("currentGameID"), localStorage.getItem("sessionId")])
}

function makeFullMoveReal(moves) {
    const [start, modifyer] = game.color === "white" ? [0, 1] : [7, -1]
    return moves.map(move => start + modifyer * move)
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
    if (isCurrentGameSkipped) return
    currentFigureMoving = event.target
    currentFigureMoving.classList.add("current-figure-moving")
    setPositonOfFigure(event, currentFigureMoving)
    event.target.classList.add("movable-figure")
    handleFigureInput(event.target.parentNode)
}


function setPositonOfFigure(event, figure) {
    const boardBox = figure.parentNode.getBoundingClientRect()
    const fullBoardBox = figure.parentNode.parentNode.getBoundingClientRect()
    const [x, y] = getCoodinates(event, boardBox)
    styleDraggingPositionFigure(x, y, figure, fullBoardBox, event, boardBox)
}

function styleDraggingPositionFigure(x, y, figure, boardBox, e,figuerBounding) {

    const left = Math.min(Math.max(x,boardBox.x - figuerBounding.x), boardBox.x + boardBox.width - figuerBounding.x)
    const top = Math.min(Math.max(y,boardBox.y - figuerBounding.y), boardBox.y + boardBox.height - figuerBounding.y)

    figure.style.left = left + "px"
    figure.style.top = top + "px"
}


function getCoodinates(e, boardBox) {
    if (e.touches) {
        return [
            e.touches[0].clientX - boardBox.left,
            e.touches[0].clientY - boardBox.top
        ]
    } else {
        return [
            e.clientX - boardBox.left,
            e.clientY - boardBox.top
        ]
    }
}

function endDraggingFigure(event) {
    event.preventDefault()
    if (currentFigureMoving === null) return

    currentFigureMoving.classList.remove("movable-figure")

    currentFigureMoving.style.top = 0;
    currentFigureMoving.style.left = 0;
    const field = document.elementFromPoint(event.clientX, event.clientY)
    
    currentFigureMoving.classList.remove("current-figure-moving")
 

   
    document.querySelectorAll(".field").forEach(el => el.classList.remove("hovered-field"))

    const currentFigureSelected = currentFigureMoving
    currentFigureMoving = null
   
    if (!field?.classList.contains("movable-field")) return
    field.innerHTML = ""
    handleFigureInput(field)
    field.appendChild(currentFigureSelected)
    index = 0;
    clearFieldTags()
}

function moveFigureWithmouse(event) {
    event.preventDefault()
    if (currentFigureMoving === null) return
    setPositonOfFigure(event, currentFigureMoving)
}



