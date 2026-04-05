import React from "react";
import { BoardColumnItems } from "../constants/BoardColumnItems.js";
import { useTasksContext } from "../hooks/useTasksContext";
import { TAGS } from "../utils/getTagColor";
import FormInputElement from "./FormInputElement";
import FormSelectElement from "./FormSelectElement";
import Button from "./ui/Button.jsx";

const initialTaskState = {
    title: "",
    description: "",
    tag: "",
    dueDate: "",
    status: "",
};

const initialErrorState = {
    title: "",
    description: "",
    tag: "",
    dueDate: "",
    status: "",
};

export default function TaskForm({ onClose, mode, initialTask }) {
    const [task, setTask] = React.useState(initialTask || initialTaskState);
    const [error, setError] = React.useState(initialErrorState);
    const { dispatch } = useTasksContext();

    // handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    // handle onblur for validation
    const handleBlur = (e) => {
        const { name, value } = e.target;
        if (!value) {
            setError((prev) => ({
                ...prev,
                [name]: `${
                    name.charAt(0).toUpperCase() + name.slice(1)
                } is required!`,
            }));
        }
    };

    // handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        // form validation
        const newError = {};
        if (!task.title) newError.title = "Title is required!";
        if (!task.description)
            newError.description = "Description is required!";
        if (!task.tag) newError.tag = "Tag is required!";
        if (!task.dueDate) newError.dueDate = "Due date is required!";
        if (!task.status) newError.status = "Status is required!";
        setError(newError);

        // if no error, submit the form
        if (Object.keys(newError).length === 0) {
            if (mode === "Edit Task") {
                dispatch({
                    type: "EDIT_TASK",
                    payload: {
                        initialTask,
                        updatedTask: {
                            ...initialTask,
                            ...task,
                        },
                    },
                });
            }

            if (mode === "Add Task") {
                dispatch({
                    type: "ADD_TASK",
                    payload: {
                        ...task,
                        id: crypto.randomUUID().slice(0, 8),
                        createdAt: Date.now(),
                    },
                });
            }
            // reset form
            setTask(initialTaskState);
            onClose();
        }
    };

    return (
        <form
            className="space-y-8"
            onSubmit={handleSubmit}
        >
            <div className="grid grid-cols-1 gap-6">
                <FormInputElement
                    label="Title"
                    id="title"
                    name="title"
                    placeholder="e.g. Design a new landing page"
                    value={task.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={error.title}
                />
                <FormInputElement
                    label="Task Subtitle / Description"
                    id="description"
                    name="description"
                    placeholder="e.g. It should include modern design trends."
                    value={task.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={error.description}
                />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormSelectElement
                    label="Tag"
                    id="tag"
                    name="tag"
                    placeholder="Select tag"
                    value={task.tag}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={TAGS}
                    error={error.tag}
                />
                <FormInputElement
                    label="Due Date"
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    value={task.dueDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={error.dueDate}
                />
                <FormSelectElement
                    label="Status"
                    id="status"
                    name="status"
                    placeholder="Select status"
                    value={task.status}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={BoardColumnItems}
                    error={error.status}
                />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                    onClick={onClose}
                    variant="outline"
                >
                    Cancel
                </Button>
                <Button type="submit">
                    {mode === "Add Task"
                        ? "Add Task"
                        : mode === "Edit Task"
                        ? "Save Changes"
                        : "N/A"}
                </Button>
            </div>
        </form>
    );
}
