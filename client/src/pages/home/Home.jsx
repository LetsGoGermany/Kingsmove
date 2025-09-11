import Navbar from "../../components/navbar/Navbar"
import Board from "../../components/board/Board"
import { useEffect, useState } from "react"
import socket from "../../lib/socket"

export default function App() {
  const [board, setBoard] = useState([])

  useEffect(() => {
    function updateBoard(data) {
      const n = data.games.length - 1
      localStorage.setItem("currentGameID",data.games[n]._id)
      setBoard(data.games[n])
    }
    socket.on("userLoggedInSucess", updateBoard)
    return () => {
      socket.off("userLoggedInSucess", updateBoard)
    }
  }, [])
  return (
    <>
      <Navbar />
      <div className="cover">
          < Board game={board} classname="moving"/>
      </div>
    </>
  )
}

