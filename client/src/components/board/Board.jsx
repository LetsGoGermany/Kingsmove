import "./board.css"
import socket from "../../lib/socket";
import { useEffect } from "react";
let myColor;
let currentFigureMoving = null;
let currentFigureSelected = undefined;

export default function Board({ game, classname, color }) {

    useEffect(() => {
        document.addEventListener("mousemove", moveFigureWithmouse)
        document.addEventListener("mouseup", endDraggingFigure)
        return () => {
            document.removeEventListener("mousemove", moveFigureWithmouse)
            document.removeEventListener("mouseup", endDraggingFigure)
        }
    }, [])

    myColor = color
    const squares = Array.from({ length: 64 }, (_, i) => 63 - i);
    return (
        <div style={{width : "fit-content", height:"100%",display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
            <ShowNamesOnBoard {...{ game, top:true,color }} />
            <div className={`board board-small ${classname}`}>
                {squares.map(nr => <Field nr={nr} key={nr} classname={classname} figures={game?.board || []} color={color} />)}
            </div>
            <ShowNamesOnBoard  {...{ game, top:false,color }} />
        </div>
    )
}


function Field({ nr, figures, classname, color }) {
    const row = Math.floor(nr / 8)
    const col = 7 - nr % 8
    const [modifyer, start] = color === "white" ? [1, 0] : [-1, 7]
    const currentFigure = figures[start + modifyer * row]?.[start + modifyer * col];
    return (
        <div
            className={`field ${(row + col) % 2 ? "fb" : "fw"}`}
            data-x={col}
            data-y={row}
            id={`field_${col}_${row}`}
            onMouseEnter={(e) => currentFigureMoving === null || e.target.classList.add("hovered-field")}
            onMouseLeave={(e) => e.target.classList.remove("hovered-field")}
        >
            {currentFigure?.fieldType === "figure" && <Figure figure={currentFigure} classname={classname} />}
        </div>
    )
}


function Figure({ figure, classname }) {
    return <img
        src={`/pieces/classic/${figure.figureColor}-${figure.figureType}.png`}
        alt={figure.figureType + figure.figureColor}
        className="figure"
        data-figure-color={figure.figureColor}
        data-figure-type={figure.figureType}
        onMouseDown={classname === "moving" ? startDraggingFigure : undefined}
    />
}

function ShowNamesOnBoard({ game, top, color }) {
    game.players = game.players || ["Player1","Player2"]
    return (
        <section 
            className={`name-display`}
        >
            {game?.players[color === "white" === top ? 1 : 0]}
        </section>
    )
}


function moveFigureWithmouse(event) {
    event.preventDefault()
    if (currentFigureMoving === null) return
    setPositonOfFigure(event, currentFigureMoving)
}

function setPositonOfFigure(event, figure) {
    const boardBox = figure.parentNode.getBoundingClientRect()
    const fullBoardBox = figure.parentNode.parentNode.getBoundingClientRect()
    const [x, y] = getCoodinates(event, boardBox)
    styleDraggingPositionFigure(x, y, figure, fullBoardBox, event, boardBox)
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

function styleDraggingPositionFigure(x, y, figure, boardBox, e, figuerBounding) {

    const left = Math.min(Math.max(x, boardBox.x - figuerBounding.x), boardBox.x + boardBox.width - figuerBounding.x)
    const top = Math.min(Math.max(y, boardBox.y - figuerBounding.y), boardBox.y + boardBox.height - figuerBounding.y)

    figure.style.left = left + "px"
    figure.style.top = top + "px"
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
}

function handleFigureInput(field) {
    if (field === null) return false
    if (field.classList.contains("movable-field")) return sendPieceMove(field)
    if (field.childElementCount > 0) return getPossibleMoves(field.firstChild)
}

function getPossibleMoves(figure) {

    const x = parseInt(figure.parentNode.dataset.x)
    const y = parseInt(figure.parentNode.dataset.y)
    const [start, modifyer] = myColor === "white" ? [0, 1] : [7, -1]
    const realX = start + modifyer * x
    const realY = start + modifyer * y
    currentFigureSelected = figure
    socket.emit("askForLegalMoves", [realX, realY, localStorage.getItem("currentGameID"), localStorage.getItem("sessionid")], recievePossibleMoves)
}

function recievePossibleMoves(data) {
    const [start, modifyer] = myColor === "white" ? [0, 1] : [7, -1]
    clearFieldTags()
    data.forEach(move => {
        const el = document.getElementById(`field_${start + modifyer * move[0]}_${start + modifyer * move[1]}`)
        el.classList.add("movable-field")
    })
}

function clearFieldTags() {
    document.querySelectorAll(".field").forEach(el => {
        el.classList.remove("movable-field")
    })
}

function sendPieceMove(field) {
    const newX = parseInt(field.dataset.x)
    const newY = parseInt(field.dataset.y)
    const oldX = parseInt(currentFigureSelected.parentNode.dataset.x)
    const oldY = parseInt(currentFigureSelected.parentNode.dataset.y)
    const [rnX, rlY, roX, roY] = makeFullMoveReal([newX, newY, oldX, oldY])
    console.log([roX, roY], [rnX, rlY])
    socket.emit("sendMoveRequest", [[roX, roY], [rnX, rlY], localStorage.getItem("currentGameID"), localStorage.getItem("sessionid")])
}

function makeFullMoveReal(moves) {
    const [start, modifyer] = myColor === "white" ? [0, 1] : [7, -1]
    return moves.map(move => start + modifyer * move)
}

let isCurrentGameSkipped = false

function startDraggingFigure(event) {
    event.preventDefault()
    if (isCurrentGameSkipped) return
    currentFigureMoving = event.target
    currentFigureMoving.classList.add("current-figure-moving")
    setPositonOfFigure(event, currentFigureMoving)
    event.target.classList.add("movable-figure")
    handleFigureInput(event.target.parentNode)
}