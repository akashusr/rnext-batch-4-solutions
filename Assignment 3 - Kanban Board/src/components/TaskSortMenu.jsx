import React from "react";
import { Sort } from "../assets/icons/Sort";
import Button from "./ui/Button";

export default function TaskSortMenu({ sort, setSort }) {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <div
            className="relative"
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                    setIsOpen(false);
                }
            }}
        >
            <Button
                variant="badge"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Sort />
                Sort
                {/* {sort && (
                    <span className="w-3 h-3 bg-red-500 rounded-full absolute -top-px -right-px flex items-center justify-center text-white text-xs font-semibold">
                        ✓
                    </span>
                )} */}
            </Button>
            <div
                className={`absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg text-sm text-gray-700 py-2 z-40 ${
                    isOpen ? "" : "hidden"
                }`}
                onMouseDown={(e) => e.preventDefault()}
            >
                <p className="px-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Sort by date
                </p>
                <Button
                    variant="list"
                    className={
                        sort === "newest" ? "bg-gray-100 font-medium" : ""
                    }
                    onClick={() =>
                        sort === "newest" ? setSort("") : setSort("newest")
                    }
                >
                    Newest first {sort === "newest" && " ✓"}
                </Button>
                <Button
                    variant="list"
                    className={
                        sort === "oldest" ? "bg-gray-100 font-medium" : ""
                    }
                    onClick={() =>
                        sort === "oldest" ? setSort("") : setSort("oldest")
                    }
                >
                    Oldest first {sort === "oldest" && " ✓"}
                </Button>
            </div>
        </div>
    );
}
