import React from "react";
import { TasksContext } from "../context/TasksContext";

export function useTasksContext() {
    const context = React.useContext(TasksContext);
    if (context === undefined || context === null) {
        throw new Error(
            "useTasksContext must be used within TasksContextProvider"
        );
    }
    return context;
}
