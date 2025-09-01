const sessionId = localStorage.getItem("sessionId")

socket.emit("requestAllGamesOnAccount", sessionId)

socket.on("sendAllGamesOfAccount", (data) => loadAllGames(data.games,data.id))

function loadAllGames(games,id) {
    games.forEach(element => {
        createGameElement(element,id)
    });
}

function createGameElement(game,id) {
    const wrapper = document.createElement("div")
    wrapper.classList.add("container")

    wrapper.dataset.id = game._id
    wrapper.addEventListener("click", (element) => loadGameFromArchive(element))


    const gameBord = document.createElement("div")

    wrapper.appendChild(gameBord)
    if(game.finished) gameBord.classList.add("game-over")
    const color = Object.entries(game).find(game => game[1] === id)[0]

    if(color !== game.toMove) gameBord.classList.add("not-my-turn")

    gameBord.classList.add("gameElement")

    document.getElementById("main").appendChild(wrapper)
    placeFigures(game.board, gameBord)
    if(game.black === id) gameBord.classList.add("flipped")
    
}


function loadGameFromArchive(element) {
    const id = element.currentTarget.dataset.id
    localStorage.setItem("currentGameID",id)
    window.location.href = "/"
}