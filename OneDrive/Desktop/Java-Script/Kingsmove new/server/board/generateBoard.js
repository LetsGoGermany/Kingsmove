let board = []


class Figure {


    constructor(figureName,color,x) {
            this.figureType = figureName
            this.figureColor = color
            this.notMoved = true
            this.fieldType = "figure"
            this.startX = x
            this.enPassentField = false 
    }

}


function loadBoard() {
board = []
   for(y=0;y<8;y++) {
    board.push([])
    for (x = 0; x < 8; x++) {
            board[y].push({fieldType:"empty",movableField:false,enPassentField:false})
    }
   }
   
    generateFigures()
       return board
}

function generateFigures() {
    placeFigures(0,1,"white")
    placeFigures(7,6,"black")
}

function placeFigures(primaryRow, secondaryRow,color) {
    const figures = ["rook","knight","bishop","queen","king","bishop","knight","rook"]
    for(x=0;x<8;x++) {
        createFigure(figures[x],x,primaryRow,color)
        createFigure("pawn",x,secondaryRow,color)
    }
}

function createFigure(figureName,x,y,color) {
    board[y][x] = new Figure(figureName,color,x)
}



module.exports = {loadBoard};