import { useEffect, useState } from "react"
import socket from "../../lib/socket"
import Board from "../../components/board/Board"
import Navbar from "../../components/navbar/Navbar"
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
            <div 
                style={{overflow:"scroll",display:"flex"}}
                >
                {games.map(game => < Board figures={game.board} key={game._id} style={{
                    width: "100px",
                    height: "100px",
                }}/>)}
            </div>
        </>
    )
}