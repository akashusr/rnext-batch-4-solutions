import React from "react";
import { BoardColumnItems } from "../constants/BoardColumnItems";
import { TasksContext } from "../context/TasksContext";
import tasksReducer from "../reducers/tasksReducer";

export default function TasksContextProvider({ children }) {
    const [tasks, dispatch] = React.useReducer(
        tasksReducer,
        BoardColumnItems?.reduce((acc, column) => {
            acc[column.value] = [];
            return acc;
        }, {})
    );
    const [searchQuery, setSearchQuery] = React.useState("");

    return (
        <TasksContext.Provider
            value={{ tasks, dispatch, searchQuery, setSearchQuery }}
        >
            {children}
        </TasksContext.Provider>
    );
}
