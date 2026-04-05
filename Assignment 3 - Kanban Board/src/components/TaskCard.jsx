import { Calendar } from "../assets/icons/Calendar";
import { dateToMonthDay } from "../utils/dateToMonthDay";
import { formatTagLabel } from "../utils/formatTagLabel";
import { getTagColor } from "../utils/getTagColor";
import TaskCardMenu from "./TaskCardMenu";

export default function TaskCard({ label, task = {} }) {
    const { title, description, tag, dueDate } = task;
    const { text, bg } = getTagColor(tag);
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow relative">
            <TaskCardMenu
                label={label}
                task={task}
            />
            <div className="mb-3">
                <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
            </div>
            <p className="text-xs text-gray-600 mb-4">{description}</p>
            <div className="flex items-center gap-2 mb-3">
                <span
                    className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded"
                    style={{
                        color: text,
                        backgroundColor: bg,
                    }}
                >
                    {formatTagLabel(tag)}
                </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="w-4 h-4" />
                {dateToMonthDay(dueDate)}
            </div>
        </div>
    );
}
