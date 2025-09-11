import { useEffect, useState } from "react"
import socket from "../../lib/socket"
import Board from "../../components/board/Board"
import Navbar from "../../components/navbar/Navbar"
import "./FigureMoving"
import "./History.css"

export default function History() {
    const [games, setGames] = useState([])
    useEffect(() => {
        function updateGames(data) {
            setGames(data.games)
        }
        socket.on("userLoggedInSucess", updateGames)

        return () => {
            socket.off("userLoggedInSucess", updateGames)
        }
    }, [])

    return (

        <>
            <Navbar />
            <div className="history-container">
                {games.map(game => < Board game={game} key={game._id} classname="archive-game"/>)}
            </div>
        </>
    )
}