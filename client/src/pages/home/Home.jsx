import Navbar from "../../components/navbar/Navbar"
import Board from "../../components/board/Board"
import { useEffect, useState } from "react"
import socket from "../../lib/socket"

export default function App() {
  const [game, setGame] = useState([])
  const [color, setColor] = useState("")

  useEffect(() => {
    function updateBoard(data) {
      const game = data.games.find(game => game._id === localStorage.getItem("currentGameID"))
      setGame(game)
      setColor(data.user_id === game?.white ? "white" : "black")

    }
    socket.on("userLoggedInSucess", updateBoard)
    socket.on("newBoard", updateBoard)
    return () => {
      socket.off("userLoggedInSucess", updateBoard)
      socket.off("newBoard", updateBoard)
    }
  }, [])

  return (
    <>
      <Navbar />
      <div className="cover">
        <section className="container">
          < Board game={game} classname="moving" color={color} />
        </section>
      </div>
    </>
  )
}

