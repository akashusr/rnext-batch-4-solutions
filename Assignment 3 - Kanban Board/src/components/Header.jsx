import React from "react";
import Search from "../assets/icons/Search";
import { useTasksContext } from "../hooks/useTasksContext";
import TaskModal from "./TaskModal";
import Button from "./ui/Button";

export default function Header() {
    const [modalOpen, setModalOpen] = React.useState(false);
    const { searchQuery, setSearchQuery } = useTasksContext();
    return (
        <>
            <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-xs font-semibold text-blue-600 uppercase">
                            Board Overview
                        </p>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Workspace
                        </h1>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end w-full md:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search />
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search tasks"
                                className="w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none"
                            />
                        </div>
                        <Button onClick={() => setModalOpen(true)}>
                            + Add Task
                        </Button>
                    </div>
                </div>
            </div>
            {modalOpen && (
                <TaskModal
                    onClose={() => setModalOpen(false)}
                    mode="Add Task"
                />
            )}
        </>
    );
}
