import { BoardColumnItems } from "../constants/BoardColumnItems";
import { useTasksContext } from "../hooks/useTasksContext";
import BoardColumn from "./BoardColumn";
import BoardLayout from "./BoardLayout";

export default function Board() {
    const { tasks, searchQuery } = useTasksContext();

    return (
        <BoardLayout>
            {BoardColumnItems?.map((column) => {
                const filteredTasks = tasks[column.value].filter((task) =>
                    task.title.toLowerCase().includes(searchQuery.toLowerCase())
                );
                return (
                    <BoardColumn
                        key={column.value}
                        label={column.label}
                        tasks={filteredTasks}
                    />
                );
            })}
        </BoardLayout>
    );
}
