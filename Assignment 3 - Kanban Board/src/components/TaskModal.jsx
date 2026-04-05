import { LeftArrow } from "../assets/icons/LeftArrow";
import TaskForm from "./TaskForm";

export default function TaskModal({ onClose, mode, initialTask }) {
    return (
        <div className="modal-overlay fixed inset-0 w-screen h-screen bg-gray-50 z-50 overflow-y-auto">
            <div className="max-w-4xl min-h-full mx-auto px-4 py-10 sm:py-12">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
                            onClick={onClose}
                        >
                            <LeftArrow />
                            Back to board
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900 mt-8">
                            {mode}
                        </h1>
                        <p className="text-sm text-gray-500">
                            {mode === "Add Task"
                                ? "Create a card for your board."
                                : "Edit the details of your task."}
                        </p>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
                    <TaskForm
                        onClose={onClose}
                        mode={mode}
                        initialTask={initialTask}
                    />
                </div>
            </div>
        </div>
    );
}
