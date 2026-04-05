import React from "react";
import BoardColumnContainer from "./BoardColumnContainer";
import BoardColumnHeader from "./BoardColumnHeader";
import Message from "./Message";
import TaskCard from "./TaskCard";
import TaskCardsContainer from "./TaskCardsContainer";

export default function BoardColumn({ label, tasks = [] }) {
    const [activeTags, setActiveTags] = React.useState([]);
    const [sort, setSort] = React.useState("");

    // Filter tasks based on active tags
    const filteredTasks = tasks.filter((task) => {
        if (activeTags.length === 0) return tasks;
        return activeTags.some((tag) => task.tag === tag);
    });

    // Sort tasks based on selected sort option
    filteredTasks.sort((a, b) => {
        if (sort === "newest") {
            return b.createdAt - a.createdAt;
        } else if (sort === "oldest") {
            return a.createdAt - b.createdAt;
        } else {
            return b.createdAt - a.createdAt; // by default, sort by newest
        }
    });

    return (
        <BoardColumnContainer>
            <BoardColumnHeader
                label={label}
                tasksCount={tasks.length}
                activeTags={activeTags}
                setActiveTags={setActiveTags}
                sort={sort}
                setSort={setSort}
            />
            <TaskCardsContainer>
                {filteredTasks.length === 0 ? (
                    <Message>No tasks found in [{label}] column.</Message>
                ) : (
                    filteredTasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            label={label}
                        />
                    ))
                )}
            </TaskCardsContainer>
        </BoardColumnContainer>
    );
}
