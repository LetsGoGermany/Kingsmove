import "./board.css"

export default function Board({figures}) {
     const squares = Array.from({ length: 64 }, (_, i) => 63 - i);
    return (
        <div
            className="board board-small"
        >
            {
                squares.map(nr => <Field nr={nr} key={nr} figures={figures}/>)
            }
        </div>
    )
}

function Field({nr,figures}) {
    const row = Math.floor(nr / 8)
    const col = 7 - nr % 8
    return (
        <div
            className={`field ${(row + col) % 2 ? "fb" : "fw"}`}
            data-x={col}
            data-y={row}
            id={`field_${col}_${row}`}   
        >
            {figures[row][col]?.fieldType === "figure" && <Figure figure={figures[row][col]}/>}
        </div>
    )
}


function Figure({figure}) {
    return <img
        src={`/pieces/classic/${figure.figureColor}-${figure.figureType}.png`}
        alt={figure.figureType + figure.figureColor}
        className="figure"
        data-figure-color = {figure.figureColor}
        data-figure-type = {figure.figureType}
    />
}

