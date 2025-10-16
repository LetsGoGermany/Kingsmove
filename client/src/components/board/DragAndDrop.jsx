export function dragStart(e,setCurrentFigure) {
    console.log("test")
    const fig = e.target;
    if(fig.classList.contains("figure")) {
        setCurrentFigure(fig)
        fig.classList.add("current-figure-moving")
        setPositonOfFigure(e,fig)
    }
}

export function dragMove(e,fig) {
    if(fig === null) return 
    setPositonOfFigure(e,fig)
}

export function dragEnd(e,setCurrentFigure,currentFigure) {
    if(currentFigure === null) return // eslint-disable-next-line
    const fig = e.target
    currentFigure.classList.remove("current-figure-moving")
    setCurrentFigure(null)
}

function setPositonOfFigure(event, figure) {
    const boardBox = figure.parentNode.getBoundingClientRect()
    const fullBoardBox = figure.parentNode.parentNode.getBoundingClientRect()
    const [x, y] = getCoodinates(event, boardBox)
    styleDraggingPositionFigure(x, y, figure, fullBoardBox, event, boardBox)
}

function getCoodinates(e, boardBox) {
    if (e.touches) {
        return [
            e.touches[0].clientX - boardBox.left,
            e.touches[0].clientY - boardBox.top
        ]
    } else {
        return [
            e.clientX - boardBox.left,
            e.clientY - boardBox.top
        ]
    }
}

function styleDraggingPositionFigure(x, y, figure, boardBox, e, figuerBounding) {

    const left = Math.min(Math.max(x, boardBox.x - figuerBounding.x), boardBox.x + boardBox.width - figuerBounding.x)
    const top = Math.min(Math.max(y, boardBox.y - figuerBounding.y), boardBox.y + boardBox.height - figuerBounding.y)

    figure.style.left = left + "px"
    figure.style.top = top + "px"
}