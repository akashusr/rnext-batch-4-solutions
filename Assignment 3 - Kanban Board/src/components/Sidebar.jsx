import { Board } from "../assets/icons/Board";
import { Calendar } from "../assets/icons/Calendar";
import { Dashboard } from "../assets/icons/Dashboard";
import { Settings } from "../assets/icons/Settings";
import { Workspace } from "../assets/icons/Workspace";

const sidebarLinks = [
    { name: "Dashboard", icon: <Dashboard />, href: "#" },
    { name: "Workspace", icon: <Workspace />, href: "#" },
    { name: "Board", icon: <Board />, href: "#" },
    { name: "Calendar", icon: <Calendar />, href: "#" },
    { name: "Settings", icon: <Settings />, href: "#" },
];

export default function Sidebar() {
    return (
        <aside className="w-full lg:w-64 bg-white border-gray-200 flex flex-col border-b lg:border-b-0 lg:border-r">
            <div className="px-4 py-6 sm:px-6">
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">K</span>
                    </div>
                    <span className="font-bold text-lg text-gray-900">
                        Kanban
                    </span>
                </div>
                <nav className="space-y-1">
                    {sidebarLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {link.icon}
                            <span>{link.name}</span>
                        </a>
                    ))}
                </nav>
            </div>
            <div className="mt-auto px-4 py-6 sm:px-6 border-t border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                        AT
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                            Anna Taylor
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                            anna.taylor@mail.com
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
