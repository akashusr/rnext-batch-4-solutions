import React from "react";
import { ThreeDot } from "../assets/icons/ThreeDot";
import { BoardColumnItems } from "../constants/BoardColumnItems";
import { useTasksContext } from "../hooks/useTasksContext";
import TaskDeleteModal from "./TaskDeleteModal";
import TaskModal from "./TaskModal";

export default function TaskCardMenu({ label, task }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
    const { dispatch } = useTasksContext();

    // function to handle task move
    const handleTaskMove = (newStatus) => {
        dispatch({
            type: "EDIT_TASK",
            payload: {
                initialTask: task,
                updatedTask: {
                    ...task,
                    status: newStatus,
                },
            },
        });
        setIsOpen(false);
    };

    // function to handle delete task
    const handleDeleteTask = () => {
        dispatch({
            type: "DELETE_TASK",
            payload: { task },
        });
        setIsOpen(false);
    };

    const moveToOptions = BoardColumnItems?.reduce((options, column) => {
        if (column.label !== label) {
            options.push({
                label: column.label,
                value: column.value,
            });
        }
        return options;
    }, []);

    return (
        <>
            <div
                className="absolute top-4 right-4 text-gray-500"
                onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) {
                        setIsOpen(false);
                    }
                }}
            >
                <button
                    type="button"
                    className="p-1 rounded-full hover:bg-gray-100 hover:text-gray-700 focus:outline-none cursor-pointer"
                    aria-label="Open card menu"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <ThreeDot />
                </button>
                <div
                    className={`absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg text-sm text-gray-700 py-2 ${
                        isOpen ? "" : "hidden"
                    } z-40`}
                    onMouseDown={(e) => e.preventDefault()}
                >
                    <p className="px-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Move to
                    </p>
                    {moveToOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleTaskMove(option.value)}
                        >
                            {option.label}
                        </button>
                    ))}
                    <div className="border-t border-gray-100 mt-2 pt-2 space-y-1">
                        <button
                            type="button"
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 cursor-pointer"
                            onClick={() => {
                                setModalOpen(true);
                                setIsOpen(false);
                            }}
                        >
                            Edit Card
                        </button>
                        <button
                            type="button"
                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer"
                            onClick={() => {
                                setDeleteModalOpen(true);
                                setIsOpen(false);
                            }}
                        >
                            Delete Card
                        </button>
                    </div>
                </div>
            </div>
            {modalOpen && (
                <TaskModal
                    onClose={() => setModalOpen(false)}
                    mode="Edit Task"
                    initialTask={task}
                />
            )}
            {deleteModalOpen && (
                <TaskDeleteModal
                    onClose={() => setDeleteModalOpen(false)}
                    onDelete={() => {
                        handleDeleteTask();
                        setDeleteModalOpen(false);
                    }}
                />
            )}
        </>
    );
}
