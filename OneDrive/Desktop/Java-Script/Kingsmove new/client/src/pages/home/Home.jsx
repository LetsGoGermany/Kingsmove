import Navbar from "../../components/navbar/Navbar"
import Board from "../../components/board/Board"

export default function App() {
  return (
    <>
    <Navbar />
    <div className="cover">
    < Board figures={figures}/>
    </div>
    </>
  )
}

const figures = [
    [
      {
        "figureType": "rook",
        "figureColor": "white",
        "notMoved": true,
        "fieldType": "figure",
        "startX": 0,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      },
      {
        "figureType": "king",
        "figureColor": "white",
        "notMoved": false,
        "fieldType": "figure",
        "startX": 4,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      }
    ],
    [
      {
        "figureType": "pawn",
        "figureColor": "white",
        "notMoved": true,
        "fieldType": "figure",
        "startX": 0,
        "enPassentField": false
      },
      {
        "figureType": "pawn",
        "figureColor": "white",
        "notMoved": true,
        "fieldType": "figure",
        "startX": 1,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      },
      {
        "figureType": "pawn",
        "figureColor": "white",
        "notMoved": true,
        "fieldType": "figure",
        "startX": 5,
        "enPassentField": false
      },
      {
        "figureType": "pawn",
        "figureColor": "white",
        "notMoved": true,
        "fieldType": "figure",
        "startX": 6,
        "enPassentField": false
      },
      {
        "figureType": "pawn",
        "figureColor": "white",
        "notMoved": true,
        "fieldType": "figure",
        "startX": 7,
        "enPassentField": false
      }
    ],
    [
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      },
      {
        "figureType": "knight",
        "figureColor": "white",
        "notMoved": false,
        "fieldType": "figure",
        "startX": 1,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      },
      {
        "figureType": "knight",
        "figureColor": "white",
        "notMoved": false,
        "fieldType": "figure",
        "startX": 6,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      }
    ],
    [
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      },
      {
        "figureType": "pawn",
        "figureColor": "white",
        "notMoved": false,
        "fieldType": "figure",
        "startX": 2,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      },
      {
        "figureType": "knight",
        "figureColor": "black",
        "notMoved": false,
        "fieldType": "figure",
        "startX": 6,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      }
    ],
    [
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      },
      {
        "figureType": "pawn",
        "figureColor": "black",
        "notMoved": false,
        "fieldType": "figure",
        "startX": 5,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      }
    ],
    [
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": true
      },
      {
        "figureType": "pawn",
        "figureColor": "black",
        "notMoved": false,
        "fieldType": "figure",
        "startX": 6,
        "enPassentField": false
      },
      {
        "figureType": "bishop",
        "figureColor": "white",
        "notMoved": false,
        "fieldType": "figure",
        "startX": 2,
        "enPassentField": false
      }
    ],
    [
      {
        "figureType": "pawn",
        "figureColor": "black",
        "notMoved": true,
        "fieldType": "figure",
        "startX": 0,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      },
      {
        "figureType": "pawn",
        "figureColor": "black",
        "notMoved": true,
        "fieldType": "figure",
        "startX": 2,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      }
    ],
    [
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      },
      {
        "figureType": "rook",
        "figureColor": "black",
        "notMoved": false,
        "fieldType": "figure",
        "startX": 0,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      },
      {
        "figureType": "king",
        "figureColor": "black",
        "notMoved": false,
        "fieldType": "figure",
        "startX": 4,
        "enPassentField": false
      },
      {
        "fieldType": "empty",
        "movableField": false,
        "enPassentField": false
      }
    ]
  ]