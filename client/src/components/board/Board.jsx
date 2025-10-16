import "./board.css"
import { useEffect, useState } from "react";
import Figure from "./Figure";
import ShowNamesOnBoard from "./GameInfoSection";
import { dragMove, dragStart, dragEnd} from "./DragAndDrop";

export default function Board({ game, classname, color }) {
    const [index, setIndex] = useState(0)
    const [boardBuilder, setBoardBuilder] = useState([])

    useEffect(() => {
        document.addEventListener("keydown", pressKey)
        return (() => document.removeEventListener("keydown", pressKey))
    })

    const length = game?.moves?.length || 0

    function pressKey(e) {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") e.preventDefault()

        if (e.ctrlKey && e.key === "ArrowLeft") setIndex(0)
        else if (e.ctrlKey && e.key === "ArrowRight") setIndex(length)
        else if (e.key === "ArrowLeft") changeIndex(setIndex, -1, length)
        else if (e.key === "ArrowRight") changeIndex(setIndex, +1, length)

        function changeIndex(setIndex, newIndex, length) {
            setIndex(prev => Math.min(Math.max(0, prev + newIndex), length))
        }
    }
    useEffect(() => {
        setIndex(length)
    }, [game,length])

    useEffect(() => {
        if (game.length === 0) return
        renderGame(index, game, setBoardBuilder)
    }, [index, game])

    const squares = Array.from({ length: 64 }, (_, i) => 63 - i);
    const nameProps = { game: game || {}, color, setIndex }
    const move = index > 0 ? game.moves[index - 1] : [[],[]]
    return (
        <div className="board-wrapper">
            <ShowNamesOnBoard {...nameProps} top={true} />
            <MainBoard {...{ classname, boardBuilder, color, squares, move}} />
            <ShowNamesOnBoard {...nameProps} top={false} len={length}/>
        </div>
    )
}


function MainBoard({ classname, boardBuilder, color, squares , move}) {
    const [currentFigure,setCurrentFigure] = useState(null)

    useEffect(() => {
        document.addEventListener("mousemove",(e) => dragMove(e,currentFigure))
        document.addEventListener("mouseup",(e) => dragEnd(e,setCurrentFigure,currentFigure))
        return () => {
        document.removeEventListener("mousemove",(e) => dragMove(e,currentFigure))
        document.removeEventListener("dragend",(e) => dragEnd(e,setCurrentFigure))
        }
    },[currentFigure])

    return (
        <div 
        className={`board board-small ${classname}`}
        onMouseDown={(e) => dragStart(e,setCurrentFigure)}
        >
            {squares.map(nr => <Field {...{nr,classname,figures:boardBuilder,color,move}} key={nr}/>)}
        </div>
    )
}


function Field({ nr, figures, classname, color,move}) {
    const row = Math.floor(nr / 8)
    const col = 7 - nr % 8
    const isFirstField = row === move[0][1] && col=== move[0][0]
    const isSecondField = row === move[1][1] && col === move[1][0]
    const selectedField = `${isFirstField ? "first-field" : isSecondField ? "second-field" : ""}`
    const [modifyer, start] = color === "white" ? [1, 0] : [-1, 7]
    const currentFigure = figures[start + modifyer * row]?.[start + modifyer * col];
    return (
        <div
            className={`field ${(row + col) % 2 ? "fb" : "fw"} ${selectedField}`}
            data-x={col}
            data-y={row}
            id={`field_${col}_${row}`}
        >
            {currentFigure?.fieldType === "figure" && <Figure figure={currentFigure} classname={classname} />}
        </div>
    )
}

function renderGame(index, game, setBoardBuilder) {
    let currentBoard = JSON.parse(JSON.stringify(game.board))
    if (index !== game?.moves?.length) {
        currentBoard = calculateNewBoard(game.moves, index)
    }
    setBoardBuilder(currentBoard)
}

function calculateNewBoard(moves, index) {
    let board = JSON.parse(JSON.stringify(standartBoard))
    for (let i = 0; i <= index - 1; i++) {
        const [[x1, y1], [x2, y2]] = moves[i]
        board = swapFields([x1, x2, y1, y2], board)
        if (moves[i][2] && moves[i][2] === "e.P.") board[y1][x2] = { fieldType: "empty", movableField: false, enPassentField: false }
        if (moves[i][2] && moves[i][2] === "O-O") {
            const newX = x1 === 2 ? 3 : 5
            const rookX = x1 === 2 ? 0 : 7
            board = swapFields([rookX, newX, y1, y1], board)
        }
    }
    return board
}

function swapFields([x1, x2, y1, y2], board) {
    board[y2][x2] = board[y1][x1]
    board[y1][x1] = { fieldType: "empty", movableField: false, enPassentField: false }
    return board
}

const standartBoard = await fetch("http://192.168.2.115:1887/api/standartBoard")
    .then(res => res.json())