import "./BgButton.css"
export default function BgButton({ onClick, display, style}) {
    return (
        <button className="send-btn" onClick={onClick} style={style}>
            <p className="send-btn-text">{display}</p>
        </button>
    )
}