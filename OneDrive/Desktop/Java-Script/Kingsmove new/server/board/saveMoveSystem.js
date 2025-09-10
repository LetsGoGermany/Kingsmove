
const letters = "abcdefgh"
const figureLetters = {
    "pawn":"",
    "knight":"N",
    "bishop":"B",
    "rook":"R",
    "queen":"Q",
    "king":"K"
}

function saveMove(firstField,field,figure,takeMove,isCheck,castle,movesLeft) {
    const normalNotation = doNormalNotation(field,figure,takeMove,isCheck,castle,movesLeft)
    const castleNotation = castle ? notateCastle(field) : false
    const specialNotation = checkSpecialNotation(firstField,field,figure,takeMove,isCheck,castle,movesLeft)
    console.log(normalNotation,castleNotation,specialNotation)
   
}

function doNormalNotation(field,figure,takeMove,isCheck,castle,movesLeft) {
     const takeField = takeMove ? "x":""
    const checkSymbol = isCheck ? (movesLeft ? "+":"#") : ""
    const isDraw = (!movesLeft && !isCheck ) ? " 1/2-1/2" : ""
    let fieldX =  letters[parseInt(field.dataset.x)-1]
    let fieldY = parseInt(field.dataset.y)
    const figureLetter = figureLetters[figure.dataset.figureType]
    const move = [figureLetter,takeField,fieldX,fieldY,checkSymbol,isDraw].join("")
    return move
}

function checkSpecialNotation(firstField,field,figure,takeMove,isCheck,castle,movesLeft) {
    const figures = document.querySelectorAll(`[data-figure-type="${figure.dataset.figureType}"][data-figure-color="${figure.dataset.figureColor}"]`)
    if(figures.length === 1) {
        return false
    } 
   // filtertFigures = Array.from(figures).filter(element => filterFiguresFromSpecialNotation(element,field))
}


function filterFiguresFromSpecialNotation(figure,field) { 
    
}

function notateCastle(field) {
    const FieldX = parseInt(field.dataset.x)
    const castleside = FieldX === 3 ? "O-O-O" : "O-O"
    return castleside
}