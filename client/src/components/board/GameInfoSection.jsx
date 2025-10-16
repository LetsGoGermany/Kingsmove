import Figure from "./Figure"
import SimpleBtn from "../simple-btn/SimpleBtn";

export default function ShowNamesOnBoard({ game, top, color, setIndex, len}) {
    const figureDiff = calcFigureDiff(game?.board || [])

    game.players = game?.players || ["Player1", "Player2"]
    const isWhite = color==="white" === top
    return (
        <section className="game-info-section">
            <NameAndFigureInfo {...{figureDiff,game,isWhite,color, top}}/>
            {top || <GameControlBtns {...{setIndex,game,len}}/>}
            <div className={`time-box ${isWhite}`}>
                10:00
            </div>
        </section>
    )
}



function NameAndFigureInfo({ figureDiff, game, isWhite, color, top}) {
    return (
        <div className="fig-name-info">
           <NameInfo {...{game,color,top,isWhite}}/>
            <div className="name-display fig-info">
                <BeatenFigures isWhite={isWhite} figures={isWhite ? figureDiff?.white : figureDiff?.black} />
                <p>{isWhite === (figureDiff?.diff > 0) || "+" + Math.abs(figureDiff?.diff)}</p>
            </div>
        </div>)
}

function NameInfo({game,color,top,isWhite}) {
    return (
        <p className={`name-display ${game.toMove === color === top}`}>
            {game?.players[isWhite ? 1 : 0]}
        </p>
    )
}

function changeIndex(setIndex,newIndex,length) {
    setIndex(prev => Math.min(Math.max(0,prev+newIndex),length))
}

function GameControlBtns({setIndex, game, len}) {
    return (
        <div className="skip-btn-section">
        <SimpleBtn displayText={"|<"} func={() => setIndex(0)}/>
        <SimpleBtn displayText={"<"} func={() => changeIndex(setIndex, -1,len)}/>
        <SimpleBtn displayText={">"} func={() => changeIndex(setIndex, +1,len)}/>
        <SimpleBtn displayText={">|"} func={() => setIndex(len)}/>
        </div>
    )
}

function BeatenFigures({ isWhite, figures }) {
    if(figures === undefined) return
    return (
        <>
            <SetBeatenFigures figures={figures[1]} isWhite={isWhite}/>
            <div className="blocker"></div>
            <SetBeatenFigures figures={figures[0]} isWhite={isWhite}/>
        </>
    )
}

function SetBeatenFigures({figures, isWhite}) {
    return (
        <>
        {
        figures.map((el, i) => {
            const figureFull = {figureType:el,figureColor : isWhite ? "white" : "black"}
            return <Figure figure={figureFull} key={el+i}/>
        })
    }
    </>
    )
}


function calcFigureDiff(figures) {
    if(figures?.length === 0) return []
    
    const valuesBlack = getValues(figures,"black")
    const valuesWhite = getValues(figures,"white")

    const lostPiecesWhite = getLostPieces(valuesWhite.values)
    const lostPiecesBlack = getLostPieces(valuesBlack.values)
    const diffWhite = compareFigures(lostPiecesWhite,lostPiecesBlack)
    const diffBlack = compareFigures(lostPiecesBlack,lostPiecesWhite)

    return {
        white: diffWhite,
        black: diffBlack,
        diff: valuesBlack.score - valuesWhite.score
    }
}

function getValues(figures, color) {
    const values = [
        { name: "pawn", count: 8, value: 1 },
        { name: "knight", count: 2, value: 3 },
        { name: "bishop", count: 2, value: 3 },
        { name: "rook", count: 2, value: 5 },
        { name: "queen", count: 1, value: 9 },
        { name: "king", count: 1, value: 0 }
    ]

    const filterd = figures
        .flat()
        .filter(figure => figure.figureType !== "empty" && figure.figureColor === color)
        .map(el => el.figureType)

    filterd.forEach(el => values
        .find(type => type.name === el)
        .count--)
    const score = values.reduce((arr, curr) => arr += (curr.count * curr.value), 0)

    return {score,values}
} 

function getLostPieces(values) {
    const pieces = []
    values.forEach(figure => {
        for(let i=0;i<figure.count;i++) {
            pieces.push(figure.name)
        }
    })
    return pieces
}

function compareFigures(arr1, arr2) {
    const set1 = JSON.parse(JSON.stringify(arr1))
    const set2 = JSON.parse(JSON.stringify(arr2))
    const [unique,double] = [[],[]]

    set1.forEach(int => {
        const index = set2.indexOf(int)
        if (index < 0) return unique.push(int)
        set2.splice(index, 1)
        return double.push(int)
    })
    return [unique,double]
}