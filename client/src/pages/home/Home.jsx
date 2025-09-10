import Navbar from "../../components/navbar/Navbar"
import Board from "../../components/board/Board"
import { useEffect, useState } from "react"
import socket from "../../lib/socket"

export default function App() {
  const [board, setBoard] = useState([])

  useEffect(() => {
    function updateBoard(data) {
      const n = data.games.length - 1
      console.log(n)
      setBoard(data.games[n].board)
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
        < Board figures={board} />
      </div>
    </>
  )
}

