function checkIfInChess(color,gameBoard) {

    const enemyColor = color === 'white' ? 'black' : 'white';

    const pieces = gameBoard.flatMap(field => field).filter(field => field.fieldType === 'figure' && field.figureColor === enemyColor)

    const king = gameBoard.flat().find(piece => piece.figureColor === color && piece.figureType === 'king');

    const sortedPieces = pieces.filter(piece => canPieceGiveCheck(piece,color,gameBoard,king))
    const isCheck = sortedPieces.some(piece => checkIfPieceGivesCheck(piece,color,gameBoard))

   return isCheck
}

function canPieceGiveCheck(piece,color,gameBoard,king) {
    const [kingX,kingY] = [...getFigurePosition(king,gameBoard) ]
    const [pieceX,pieceY] = [...getFigurePosition(piece,gameBoard)]
    const direction = color == "white" ? -1 : 1 
    return canPieceGiveCheckInTheory(piece,kingX,kingY,pieceX,pieceY,direction)
}

function canPieceGiveCheckInTheory(piece,kingX,kingY,pieceX,pieceY,direction) {
    if(piece.figureType == "bishop" && Math.abs(kingX - pieceX) == Math.abs(kingY - pieceY)) return true
    if(piece.figureType == "rook" && (kingX == pieceX || kingY == pieceY)) return true
    if(piece.figureType == "knight" &&
        (Math.abs(pieceX-kingX) == 2 && Math.abs(pieceY - kingY) == 1 || Math.abs(pieceX-kingX) == 1 && Math.abs(pieceY - kingY) == 2)
    ) return true
    if(piece.figureType == "pawn" && parseInt(pieceY) + parseInt(direction) == kingY && Math.abs(kingX - pieceX) == 1) return true
    if(piece.figureType == "queen" &&    
            (Math.abs(pieceX - kingX) == 0 || Math.abs(pieceY - kingY) == 0 || Math.abs(kingX - pieceX) == Math.abs(kingY - pieceY))       
    ) return true
    if(piece.figureType == "king" && Math.abs(kingX - pieceX) <= 1 && Math.abs(kingY - pieceY) <= 1) return true
    return false
}

const figureMoves = require("./figureMoves")

function checkIfPieceGivesCheck(piece,color,gameBoard) {
    const figureType = piece.figureType;
    if(figureType == "pawn") return givesPawnCheck(piece,color,gameBoard)
    const moves = possibleMovesByName[figureType]()

    return checkForCheckByDirection(moves,color,piece,gameBoard)
}

function givesPawnCheck(piece,color,gameBoard) {
    const oppositeColor = color === 'white' ? 'black' : 'white';
    const direction = oppositeColor === 'white' ? 1 : -1;

    const posX = getFigurePosition(piece,gameBoard)[0];
    const posY = getFigurePosition(piece,gameBoard)[1]+direction;

    const field1 = checkPawnCheckField(posX,posY,1,color, gameBoard)
    const field2 = checkPawnCheckField(posX,posY,-1,color, gameBoard)
    return field1 || field2
    
}

function checkPawnCheckField(posX,posY,dirX,color,gameBoard) {
    const newPosX = posX + dirX;
    if(newPosX < 0 || newPosX > 7) return false
    if(posY < 0 || posY > 7) return false
    const field = gameBoard[posY][newPosX]
    return field.fieldType === "figure" && field.figureType == "king" && field.figureColor == color
}

function checkForCheckByDirection(moves,color,piece,gameBoard) {
    return moves[0].some(element => { 
    const dirX = element[0]
    const dirY = element[1]
    const moveLimiter = moves[1]
    const [x,y] = getFigurePosition(piece,gameBoard)
    const check = checkForCheckloop(x,y,dirX,dirY,moveLimiter,color,gameBoard)
    return check
    });
}

function checkForCheckloop(x,y,dirX,dirY,moveLimiter,color,gameBoard) {
    for(k=1;isPossibleField(x,y,dirX,dirY,k,moveLimiter);k++) {
        const newPosX = x + dirX * k
        const newPosY = y + dirY * k
        const field = gameBoard[newPosY][newPosX]
        if(field.fieldType === "empty") continue
        return field.figureType == "king" && field.figureColor == color

    }
    return false
}

module.exports = {checkIfInChess}


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

function isPossibleField(x,y,dirX,dirY,i,moveLimiter) {
    if(x + dirX * i > 7) return false
    if(x + dirX * i < 0) return false
    if(y + dirY * i > 7) return false
    if(y + dirY * i < 0) return false
    if(moveLimiter > 0 && i > moveLimiter) return false
    return true
}