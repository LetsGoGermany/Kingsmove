import Navbar from "../../components/navbar/Navbar"
import "./Play.css"
import BgButton from "../../components/btns/bg-button/BgButton"
import { useState } from "react"

const times = [{
    name: "Bullet",
    times: [
        { display: "1 | 0", setting:"1.1"},
        { display: "2 | 0", setting:"1.2"},
        { display: "2 | 1", setting:"1.3"},
    ]
}, {
    name: "Blitz",
    times: [
        { display: "3 | 0", setting:"2.1"},
        { display: "3 | 5", setting:"2.2"},
        { display: "5 | 0", setting:"2.3"},
    ]
}, {
    name: "Speed",
    times: [
        { display: "10 | 0",setting:"3.1"},
        { display: "20 | 0", setting:"3.2"},
        { display: "20 | 30", setting:"3.3"},
    ]
}]

const options = [
    { setting: "white", img: "/startGame/white.png", alt: "Play as white"},
    { setting: "random", img: "/startGame/random.png", alt: "Play with random color", },
    { setting: "black", img: "/startGame/black.png", alt: "Play as black",},
]
export default function Play() {
    return (
        <>
            <Navbar />
            <PlayForm />
        </>
    )
}


function PlayForm() {
    const [currentColor, setCurrentColor] = useState(null)
    const [currentSetting, setCurrentSetting] = useState(null)
    function nextStep() {
        if(!currentColor || !currentSetting) return
        window.location.href = `/play/select-oponent?color=${currentSetting},setting=${currentColor}`
    }
    return (
        <div className="frame">
            <div className="time-form">
                <h1 className="title">Start a new Game</h1>
                {times.map(el => <TimeSection key={el.name} {...{ el,setCurrentColor}} />)}
                <div className="line"></div>
                <ColorSelection {...{setCurrentSetting}}/>
                <button className="start-btn" onClick={nextStep}>Continue</button>
            </div>
        </div>
    )
}

function ColorSelection({setCurrentSetting}) {
    return (
        <div className="color-selection-container">
            <p className="category-title">Select your Color</p>
            <section className="color-selection-btn-container">
                {options.map(el => <ColorSelectionButton {...{ el,setCurrentSetting}} key={el.alt}/>)}
            </section>
        </div>
    )
}

function ColorSelectionButton({ el, setCurrentSetting }) {
    return (
        <button
            className="select-color-btn"
            onClick={(btn) => setButton(btn, "select-color-btn", setCurrentSetting, el.setting)}
            key={el.alt}
            color={el.setting}
        >
            <img
                src={`${el.img}`}
                alt={el.alt}
            />
        </button>
    )
}

function setButton(e, classname, update, setting) {
    const btns = document.querySelectorAll(`.${classname}`)
    btns.forEach(el => el.classList.remove(`selected`))
    e.currentTarget.classList.add(`selected`)
    update(setting)
}

function TimeSection({ el, setCurrentColor }) {
    return (
        <>
            <p className="category-title">{el.name}</p>
            <div className="timeCover">
                {el.times.map(btn => <BgButton
                    key={btn.display}
                    display={btn.display}
                    onClick={(e) =>  setButton(e, "time-select-btn",setCurrentColor, btn.setting)}
                    classname="time-select-btn"
                />)}
            </div>
        </>
    )
}
