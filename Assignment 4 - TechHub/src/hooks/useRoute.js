import { useContext } from "react";
import { RouteContext } from "../contexts";

export default function useRoute() {
    const context = useContext(RouteContext);
    if (!context) {
        throw new Error("useRoute must be used within a RouteContextProvider");
    }
    return context;
}
