let currentFigureSelected;
let selectedField;
let selectedX;
let selectedY;

let gameBoard;
let fields = [];

const check = require("./checkForChess")

function touchPiece(board,fieldIndex) { //Wird ausgeführt, wenn eine Figur berüht wrid
    fields = []
    gameBoard = board;

    const figure = board[fieldIndex[1]][fieldIndex[0]]
    if(figure.fieldType === 'empty') return

    currentFigureSelected = figure;
    selectedField = fieldIndex
    selectedX = fieldIndex[0];
    selectedY = fieldIndex[1];
    
    const figureType = figure.figureType
    if(figureType == "pawn") calculatePawnMoves(figure)
    if(figureType == "king") checkForCastle(figure)
    const moves = possibleMovesByName[figureType]()
    calculatePossibleMoves(moves,figure)
    return getAvaiableMoves(gameBoard)
}

function checkForCastle(king) {
    const boardCopy = copy(gameBoard)
    const row = selectedField[1]
    if(king.notMoved === false) return
    if(check.checkIfInChess(king.figureColor,boardCopy)) return false
    checkForCastleSide(row,0,king,-1,boardCopy)
    checkForCastleSide(row,7,king,1,boardCopy)
}

function checkForCastleSide(row,rookColumn,king,modifyer,boardCopy) {
       const rook = boardCopy[row][rookColumn]
       if(rook.fieldType === "empty") return false
       if(rook.figureType != "rook" || rook.notMoved === false) return false
                for(i=1;4+(i*modifyer)!=rookColumn;i++) {
                    const currentField =  boardCopy[row][4+(i*modifyer)]
                        if(currentField.fieldType != "empty") return
                        changeFields(4+((i-1)*modifyer),row,4+(i*modifyer),row,boardCopy)
                         if(i < 3 && check.checkIfInChess(king.figureColor,boardCopy)) return
                }
        changeFields(...getFigurePosition(king,boardCopy),selectedX,selectedY,boardCopy)
        fields.push([4+(modifyer*2),row])
}

function calculatePawnMoves(figure) {
   const boardCopy = copy(gameBoard)
    const color = figure.figureColor
    const isFirstMove = figure.notMoved
    let x,y
    [x,y] = getFigurePosition(figure,boardCopy)
    pawnStraightMoves(x,y,isFirstMove,color,boardCopy)
    pawnDiagonalMoves(x,y,-1,color,boardCopy)
    pawnDiagonalMoves(x,y,1,color,boardCopy)
}

function pawnStraightMoves(x,y,isFirstMove,color,boardCopy) {
    const direction = color === 'white' ? 1 : -1
    let posY = y + direction
    if(posY < 0 || posY > 7) return 
    const currentField = boardCopy[posY][x]
  
    if(currentField.fieldType != "empty") return 
    changeFields(x,y,x,posY,boardCopy)
    console.log(x,posY)
    if(check.checkIfInChess(color,boardCopy) === false) fields.push([x,posY])
    if(isFirstMove === true) pawnStraightMoves(x,posY,false,color,boardCopy)
}


function pawnDiagonalMoves(x,y,modX,color,boardCopy) {
    const posX = x + modX
    const direction = color === 'white' ? 1 : -1
    let posY = y + direction
    if(posY < 0 || posY > 7) return 
    if(posX < 0 || posX > 7) return 
    const currenField = boardCopy[posY][posX]
    if(currenField.fieldType === "empty" && currenField.enPassentField === false) return 
    const childColor = currenField.figureColor
    if(childColor === color) return
    changeFields(selectedX,selectedY,posX,posY,boardCopy)

    if(check.checkIfInChess(color,boardCopy) === false) fields.push([posX,posY])
    
}

function bishopMoves() {
    let moves = [[1,1],[1,-1],[-1,1],[-1,-1]]
    return [moves,-1]
}

function knightMoves() {
    let moves = [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]]
    return [moves,1]
}

function rookMoves() {
    let moves = [[1,0],[-1,0],[0,1],[0,-1]]
    return [moves,-1]
}


function queenMoves() {
    let straightMoves = rookMoves()[0]
    let diagonalMoves = bishopMoves()[0]
    let moves = [...straightMoves,...diagonalMoves]
    return [moves,-1]
}

function kingMoves() {
    let moves = queenMoves()[0]
    return [moves,1]
}

function calculatePossibleMoves(moves,figure) {
    const boardCopy = copy(gameBoard)
    let [figureX,figureY] = getFigurePosition(figure,boardCopy)

    moves[0].forEach(element => {
        calculateFieldsByDirection(figureX,figureY,element[0],element[1],figure,moves[1])
    })
    changeFields(figureX,figureY,selectedX,selectedY,gameBoard)
} 
 
function calculateFieldsByDirection(x,y,dirX,dirY,figure,moveLimiter) {
    const boardCopy = copy(gameBoard)
    for(i=1;isPossibleField(x,y,dirX,dirY,i,moveLimiter);i++) {
        let posX = x + (dirX * i)
        let posY = y + (dirY * i)
        let currenField = boardCopy[posY][posX]
        const color = figure.figureColor
        if(currenField.fieldType === "figure" && currenField.figureColor == color) return 
         const oldX = posX-dirX
         const oldY = posY-dirY
        if(boardCopy[posY][posX].fieldType === "figure") i = 100
        changeFields(oldX,oldY,posX,posY,boardCopy)
        if(check.checkIfInChess(color,boardCopy) === false) fields.push([posX,posY])
    }
}

function isPossibleField(x,y,dirX,dirY,i,moveLimiter) {
    if(x + dirX * i > 7) return false
    if(x + dirX * i < 0) return false
    if(y + dirY * i > 7) return false
    if(y + dirY * i < 0) return false
    if(moveLimiter > 0 && i > moveLimiter) return false
    return true
}


 



function changeFields(x1,y1,x2,y2,boardCopy) {
    boardCopy[y2][x2] = boardCopy[y1][x1]
    boardCopy[y1][x1] = {fieldType:"empty",movableField:false,enPassentField:false}
    return boardCopy
}

function getFigurePosition(figure,boardCopy) {
     const y = boardCopy.findIndex(innerArray => JSON.stringify(innerArray).includes(JSON.stringify(figure)));
     const x = boardCopy[y].findIndex(obj => JSON.stringify(obj) === JSON.stringify(figure));

     return [x,y];
}

const possibleMovesByName = {
    "king": kingMoves,
    "queen": queenMoves,
    "rook": rookMoves,
    "bishop": bishopMoves,
    "knight": knightMoves,
    "pawn": () => {return [[[0,0]],0]}
}


function getAvaiableMoves() { 
    return fields
}


function copy(object) {
    return JSON.parse(JSON.stringify(object));
}


module.exports = {touchPiece,isPossibleField}