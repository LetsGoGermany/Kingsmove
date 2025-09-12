import { useEffect, useState } from "react"
import socket from "../../lib/socket"
import Board from "../../components/board/Board"
import Navbar from "../../components/navbar/Navbar"
import { useNavigate } from "react-router-dom"

import "./History.css"

export default function History() {

    const [games, setGames] = useState([])

    const navigate = useNavigate()
    useEffect(() => {
        function updateGames(data) {
            setGames(data)
        }
        socket.on("userLoggedInSucess", updateGames)

        return () => {
            socket.off("userLoggedInSucess", updateGames)
        }
    }, [])


    function loadGame(id) {
        localStorage.setItem("currentGameID",id)
        navigate("/")
    }

    return (

        <>
            <Navbar />
            <div className="history-container">

                    {games.games && games.games.map(game => {
                    const myColor = game.white === games.user_id ? "white" : "black"
                    const myMove = myColor === game.toMove
                    return <div 
                    className={`${myColor} ${myMove} history-game-container`}
                    key={game._id} 
                    onClick={() => {loadGame(game._id)}}
                    >
                            < Board game={game} key={game._id} myMove={myMove} classname={`archive-game`} />
                    </div>
                }
                )}
            </div>
        </>
    )
}