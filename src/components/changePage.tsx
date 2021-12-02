import { Link } from "react-router-dom";
import { FunctionComponent } from "preact";
import { Pages } from "./app";

const ChangePage:FunctionComponent<{
    page: Pages,
    push: "up" | "down",
}> = ({page}) => {
    const msgs:Record<Pages, string> = {
        boutme: "My Skills",
        contact: "Contact Me",
        portfolio: "Portfolio",
        "": "Back Home"
    }

    return <Link className="col btn btn-p" to={`/${page}`} style={{textDecoration: "none"}}>{msgs[page]}</Link>
}

export default ChangePage
