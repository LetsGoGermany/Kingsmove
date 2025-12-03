import "./BgButton.css"
export default function BgButton({ onClick, display, style, classname}) {
    return (
        <button className={`${classname} bg-btn`} onClick={onClick} style={style}>
            <p className="bg-btn-text">{display}</p>
        </button>
    )
}