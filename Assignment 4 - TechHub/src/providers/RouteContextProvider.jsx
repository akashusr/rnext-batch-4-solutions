import { useEffect, useState } from "react";
import { RouteContext } from "../contexts";

export default function RouteContextProvider({ children }) {
    const [route, setRoute] = useState("/");

    useEffect(() => {
        window.scrollTo(0, 0);
        history.replaceState({}, "", route);

        document.title = `${
            route === "/"
                ? "Home"
                : route.slice(1).charAt(0).toUpperCase() + route.slice(2)
        } | TechHub LWS`;
    }, [route]);

    return (
        <RouteContext.Provider value={{ route, setRoute }}>
            {children}
        </RouteContext.Provider>
    );
}
