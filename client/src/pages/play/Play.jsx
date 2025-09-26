import Navbar from "../../components/navbar/Navbar"
import "./Play.css"
import BgButton from "../../components/bg-button/BgButton"

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
}]

export default function Play() {
    return (
        <>
            <Navbar />
            <div className="time-form">
                {times.map(el => {
                    return <div className="timeCover">
                        {el.times.map(btn => <BgButton display={btn.display} />)}
                    </div>
                })}
            </div>
        </>
    )
}