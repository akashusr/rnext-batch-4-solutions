export default function tasksReducer(tasks, { type, payload }) {
    switch (type) {
        case "ADD_TASK":
            return {
                ...tasks,
                [payload.status]: [...tasks[payload.status], payload],
            };
        case "EDIT_TASK":
            if (payload.initialTask.status !== payload.updatedTask.status) {
                return {
                    ...tasks,
                    [payload.initialTask.status]: tasks[
                        payload.initialTask.status
                    ].filter((t) => t.id !== payload.updatedTask.id),
                    [payload.updatedTask.status]: [
                        ...tasks[payload.updatedTask.status],
                        payload.updatedTask,
                    ],
                };
            } else {
                return {
                    ...tasks,
                    [payload.updatedTask.status]: tasks[
                        payload.updatedTask.status
                    ].map((t) =>
                        t.id === payload.updatedTask.id
                            ? payload.updatedTask
                            : t
                    ),
                };
            }
        case "DELETE_TASK":
            return {
                ...tasks,
                [payload.task.status]: tasks[payload.task.status].filter(
                    (t) => t.id !== payload.task.id
                ),
            };
        default:
            // eslint-disable-next-line no-console
            console.warn(`Unknown action type: ${type}`);
            return tasks;
    }
}
