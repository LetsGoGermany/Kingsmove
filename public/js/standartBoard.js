let emptyBoard = []
class Figure {


    constructor(figureName,color,x) {
            this.figureType = figureName,
            this.figureColor = color,
            this.notMoved = true
            this.fieldType = "figure"
            this.startX = x
    }

}


function loadBoard() {
emptyBoard = []
   for(y=0;y<8;y++) {
    emptyBoard.push([])
    for (x = 0; x < 8; x++) {
            emptyBoard[y].push({fieldType:"empty",movableField:false})
    }
   }
   
    createFigures()
       return emptyBoard
}

function createFigures() {
    putFiguresonBoard(0,1,"white")
    putFiguresonBoard(7,6,"black")
}

function putFiguresonBoard(primaryRow, secondaryRow,color) {
    const figures = ["rook","knight","bishop","queen","king","bishop","knight","rook"]
    for(x=0;x<8;x++) {
        createFigure(figures[x],x,primaryRow,color)
        createFigure("pawn",x,secondaryRow,color)
    }
}

function createFigure(figureName,x,y,color) {
    emptyBoard[y][x] = new Figure(figureName,color,x)
}