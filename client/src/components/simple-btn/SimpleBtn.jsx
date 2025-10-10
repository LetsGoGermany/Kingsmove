import "./SimpleBtn.css"

export default function SimpleBtn({displayText, func}) {
    return (
        <button className="simple-btn" onClick={func}>{displayText}</button>
    )
}