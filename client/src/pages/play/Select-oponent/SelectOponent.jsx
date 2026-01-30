
import Navbar from "../../../components/navbar/Navbar";
import "./SelectOponent.css"
export default function SelectOponent() {
    return (
        <>
            <Navbar />
            <Main />
        </>
    )
}
const options = {
    friend: {
        title: "Invite a Friend",
        src: "/startGame/friends.png",
        className: "or-display",
        href: "test"
    },
    link: {
        title: "Create a Link",
        src: "/startGame/create-link.png",
        className: "",
        href: "test"
    },
}

function Main() {
    return (
        <div className="cover">
            <div className="main-wrapper">
                <StartOption {...options.friend} />
                <StartOption {...options.link} />
            </div>
        </div>
    )
}

function StartOption({ src, title, className,href }) {
    return (
        <div className="Option-element">
            <a href={href}>
                <img src={src} alt={title} className="option-img" />
            </a>
            <div className="blocker"></div>
            <p className={`option-title ${className}`.trim()}>{title}</p>
        </div>
    )
}

