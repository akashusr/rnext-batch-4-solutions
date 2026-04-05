import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import RouteContextProvider from "./providers/RouteContextProvider.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <RouteContextProvider>
            <App />
        </RouteContextProvider>
    </StrictMode>
);
