
const currentFigureDesign = "classic"

function switchWholeTheme(boardDesign,pieceDesign) {
    if(pieceDesign == undefined) pieceDesign = boardDesign 
    switchBoardTheme(boardDesign)
    designFigures(pieceDesign)
}

function switchBoardTheme(designName) {
        const fields = Array.from(document.querySelectorAll('.field'));
        fields.forEach(element => {
            const x = parseInt(element.dataset.x);
            const y = parseInt(element.dataset.y);
            const colorIndex = (x + y) % 2;
            const color = colorIndex == 1 ? 'white' : 'black';
            element.style.backgroundImage = `url("/gamedesign/board/${designName}/${color}.png")`;
        })
}

function designFigures(designName) {
    const figures = Array.from(document.querySelectorAll(".figure"))
    figures.forEach(element => {
            const figureColor = element.dataset.figureColor
            const figureType = element.dataset.figureType
            const src = `/gamedesign/pieces/${designName}/${figureColor}-${figureType}.png`
            element.setAttribute("src",src)
    })
}



