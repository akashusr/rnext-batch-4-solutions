import Reset from "../assets/icons/Reset";
import TaskFilterMenu from "./TaskFilterMenu";
import TaskSortMenu from "./TaskSortMenu";

export default function BoardColumnHeader({
    label = "Column Title",
    tasksCount = 0,
    activeTags,
    setActiveTags,
    sort,
    setSort,
}) {
    return (
        <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-gray-900">{label}</h2>
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                    {tasksCount}
                </span>
            </div>
            <div className="ml-auto flex items-center gap-2">
                {(sort.length > 0 || activeTags.length > 0) && (
                    <button
                        type="button"
                        className="flex items-center gap-2 px-2 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none cursor-pointer relative"
                        onClick={() => {
                            setActiveTags([]);
                            setSort("");
                        }}
                    >
                        <Reset />
                    </button>
                )}
                <TaskFilterMenu
                    activeTags={activeTags}
                    setActiveTags={setActiveTags}
                />
                <TaskSortMenu
                    sort={sort}
                    setSort={setSort}
                />
            </div>
        </div>
    );
}
