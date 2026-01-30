import socket from "../../lib/socket"

export function dragStart(e,setCurrentFigure,color,lastFigureTouched) {
    const fig = e.target;
    if(fig.classList.contains("figure")) {
        setCurrentFigure(fig)
        fig.classList.add("current-figure-moving")
        setPositonOfFigure(e,fig)
        handleFigureInput(fig.parentNode,color,lastFigureTouched)
    } else {
        handleFigureInput(fig,color,lastFigureTouched)
    }
    
}

export function dragMove(e,fig) {
    if(fig === null) return 
    setPositonOfFigure(e,fig)
}

export function dragEnd(setCurrentFigure,currentFigure,color,setLastFigureTouched,e) {
    if(!currentFigure) return
    const [x,y] = getCoodinates(e)
    const field = getFieldFromPoint(x,y)
    handleFigureInput(field,color,currentFigure)
    currentFigure.classList.remove("current-figure-moving")
    setLastFigureTouched(currentFigure)
    setCurrentFigure(null)
    makeSelectedField(null)
}

function setPositonOfFigure(event, figure) {
    const boardBox = figure.parentNode.getBoundingClientRect()
    const fullBoardBox = figure.parentNode.parentNode.getBoundingClientRect()
    const [x, y] = getCoodinates(event)
    styleDraggingPositionFigure(x, y, figure, fullBoardBox, boardBox)
}

function getCoodinates(e) {
    if (e.touches) {
        return [
            e.touches[0]?.clientX || 0,
            e.touches[0]?.clientY ||0,
        ]
    } else {
        return [
            e.clientX,
            e.clientY
        ]
    }
}

function styleDraggingPositionFigure(x, y, figure, boardBox, figuerBounding) {
    
    const left = makeFigureValue(x - figuerBounding.left,figuerBounding.width,figuerBounding.x,boardBox.x,boardBox.width)
    const top = makeFigureValue(y - figuerBounding.top,figuerBounding.height,figuerBounding.y,boardBox.y,boardBox.height)

    figure.style.left = left + "px"
    figure.style.top = top + "px"
    styleHoveredField(top,left,figuerBounding)
}

function makeFigureValue(x,figureWidth,figureStart,boardStart,boardWith) {
    const min = boardStart - figureStart - figureWidth / 2
    const mid = x - figureWidth / 2
    const max = boardStart + boardWith - figureStart - figureWidth / 2 -1
    return Math.max(Math.min(mid,max), min)
}   

function styleHoveredField(y,x,figuerBounding) {
    const lx = figuerBounding.x + x + figuerBounding.width / 2
    const ly = figuerBounding.y + y + figuerBounding.width / 2
    const field = getFieldFromPoint(lx,ly)
    if(field) makeSelectedField(field)
}

function getFieldFromPoint(x,y) {
    const fields = document.elementsFromPoint(x,y)
    return fields.find(fld => fld?.classList.contains("field"))
}

function makeSelectedField(field) {
    document.querySelectorAll(".field")
            .forEach(el => el.classList.remove("hovered"))
    field?.classList.add("hovered")
}


function handleFigureInput(field,color,figure) {
    if (field === null) return false
    if (field?.classList.contains("movable-field")) return sendPieceMove(field,color,figure)
    if (field?.childElementCount > 0) return getPossibleMoves(field.firstChild,color)
}


function getPossibleMoves(figure,color) {
    const x = parseInt(figure.parentNode.dataset.x)
    const y = parseInt(figure.parentNode.dataset.y)
    const [start, modifyer] = color === "white" ? [0, 1] : [7, -1]
    const realX = start + modifyer * x
    const realY = start + modifyer * y
    socket.emit("askForLegalMoves",
                 [realX, realY, localStorage.getItem("currentGameID"), localStorage.getItem("sessionid")],
                 (data) => recievePossibleMoves(data,color,figure))
}

function recievePossibleMoves(data, color) {
    const [start, modifyer] = color === "white" ? [0, 1] : [7, -1]
    clearFieldTags()
    data.forEach(move => {
        const el = document.getElementById(`field_${start + modifyer * move[0]}_${start + modifyer * move[1]}`)
        el.classList.add("movable-field")
    })
}

   export function clearFieldTags() {
        const fields = document.querySelectorAll(".field")
        fields.forEach(el => {
            el.classList.remove("movable-field")
        })
    }


function sendPieceMove(field,color,figure) {
    console.log(figure,field)
    const newX = parseInt(field.dataset.x)
    const newY = parseInt(field.dataset.y)
    const oldX = parseInt(figure.parentNode.dataset.x)
    const oldY = parseInt(figure.parentNode.dataset.y)
    const [rnX, rlY, roX, roY] = makeFullMoveReal([newX, newY, oldX, oldY],color)
    socket.emit("sendMoveRequest", [[roX, roY], [rnX, rlY], localStorage.getItem("currentGameID"), localStorage.getItem("sessionid")])
}

export function makeFullMoveReal(moves,color) {
    const [start, modifyer] = color === "white" ? [0, 1] : [7, -1]
    return moves.map(move => start + modifyer * move)
}