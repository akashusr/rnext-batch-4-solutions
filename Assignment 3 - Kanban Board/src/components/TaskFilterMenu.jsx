import React from "react";
import { Filter } from "../assets/icons/Filter";
import { TAGS } from "../utils/getTagColor";
import Button from "./ui/Button";

export default function TaskFilterMenu({ activeTags, setActiveTags = [] }) {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleTagClick = (tagValue) => {
        if (activeTags.includes(tagValue)) {
            setActiveTags(activeTags.filter((tag) => tag !== tagValue));
        } else {
            setActiveTags([...activeTags, tagValue]);
        }
    };

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
                <Filter />
                Filter
                {/* {activeTags.length > 0 && (
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
                    Filter by tag
                </p>
                {TAGS?.map((tag) => (
                    <Button
                        key={tag.value}
                        variant="list"
                        className={
                            activeTags.includes(tag.value)
                                ? "bg-gray-100 font-medium"
                                : ""
                        }
                        style={{ color: tag.color }}
                        onClick={() => handleTagClick(tag.value)}
                    >
                        {tag.label}
                        {activeTags.includes(tag.value) && " ✓"}
                    </Button>
                ))}
            </div>
        </div>
    );
}
