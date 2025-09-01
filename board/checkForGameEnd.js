const check = require("./checkForChess")

function status(color,board) {

    const boarCopy = JSON.parse(JSON.stringify(board))
    const enemyColor = color === "white" ? "black" : "white"
    
    const areMovesPossible = checkIfPossibleMoves(enemyColor,boarCopy)
    const isCheck = check.checkIfInChess(enemyColor,boarCopy)
    return statusUpdate(areMovesPossible,isCheck,color) 
}

function statusUpdate(areMovesPossible,isCheck,color) {
   if(areMovesPossible)  return {
            ending: false,
            winner: null,
        }

    if(!isCheck) return {
        ending: true,
        winner: null,
    }

    return {
        ending: true,
        winner: color
    }
}

const figureMoves = require("./figureMoves")

function checkIfPossibleMoves(color,boarCopy) {
    
    let pieces = []
    //console.log(color)
    for(row=0;row<8;row++) {
        for(col=0;col<8;col++) {
            if (boarCopy[row][col].fieldType === "figure" && boarCopy[row][col].figureColor === color) pieces.push([col,row])
        }
    }

    return pieces.some(piece => {
        const board = JSON.parse(JSON.stringify(boarCopy))
        const moves = figureMoves.touchPiece(board,piece)
        return moves.length > 0
    })
    
}



module.exports = {status}



