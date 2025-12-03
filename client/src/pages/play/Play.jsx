import Navbar from "../../components/navbar/Navbar"
import "./Play.css"
import BgButton from "../../components/btns/bg-button/BgButton"

const times = [{
    name: "Bullet",
    times: [
        { display: "1 | 0", startTime: 60, bonusTime: 0 },
        { display: "2 | 0", startTime: 120, bonusTime: 0 },
        { display: "2 | 1", startTime: 120, bonusTime: 1 },
    ]
}, {
    name: "Blitz",
    times: [
        { display: "3 | 0", startTime: 180, bonusTime: 0 },
        { display: "3 | 5", startTime: 180, bonusTime: 5 },
        { display: "5 | 0", startTime: 300, bonusTime: 0 },
    ]
},{
    name: "Speed",
    times: [
        { display: "10 | 0", startTime: 600, bonusTime: 0 },
        { display: "20 | 0", startTime: 1200, bonusTime: 0 },
        { display: "20 | 30", startTime: 1200, bonusTime: 30 },
    ]
}]

const options = [
    {color:"white",img:"/startGame/white.png",alt:"Play as white"},
    {color:"random",img:"/startGame/random.png",alt:"Play with random color"},
    {color:"black",img:"/startGame/black.png",alt:"Play as black"},
]
export default function Play() {
    return (
        <>
            <Navbar />
            <div className="frame">
                <div className="time-form">
                    <h1 className="title">Start a new Game</h1>
                    {times.map(el => <TimeSection key={el.name} {...{el}}/>)}
                    <div className="line"></div>
                    <ColorSelection />
                    <button className="start-btn">Continue</button>
                </div>
            </div>
        </>
    )
}

function ColorSelection() {
    return (
        <div className="color-selection-container">
            {options.map(el => {
                return (
                    <button 
                            className="select-color-btn"
                            onClick={(btn) => setButton(btn, "select-color-btn")}
                            key={el.alt}
                            >
                        <img
                            src={`${el.img}`}
                            alt={el.alt}
                        />
                    </button>
                    )
            })}
        </div>
    )
}

      function setButton(e,classname) {
            const btns = document.querySelectorAll(`.${classname}`)
            btns.forEach(el => el.classList.remove(`selected`))
            e.currentTarget.classList.add(`selected`)
        }

function TimeSection({ el }) {
  
    return (
        <>
            <p className="category-title">{el.name}</p>
            <div className="timeCover">
                {el.times.map(btn => <BgButton 
                    key={btn.display} 
                    display={btn.display} 
                    onClick={(btn) => {
                        setButton(btn,"time-select-btn")
                    }} 
                    classname="time-select-btn" 
                    />)}
            </div>
        </>
    )
}
