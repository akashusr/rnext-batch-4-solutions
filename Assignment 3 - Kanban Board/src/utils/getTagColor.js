export const TAGS = [
    {
        label: "Design",
        value: "design",
        color: "#1d4ed8",
    },
    {
        label: "Operations",
        value: "operations",
        color: "#b45309",
    },
    {
        label: "Marketing",
        value: "marketing",
        color: "#15803d",
    },
    {
        label: "Creative",
        value: "creative",
        color: "#7e22ce",
    },
    {
        label: "Development",
        value: "development",
        color: "#4338ca",
    },
    {
        label: "Backend",
        value: "backend",
        color: "#b91c1c",
    },
    {
        label: "Setup",
        value: "setup",
        color: "#15803d",
    },
    {
        label: "Infrastructure",
        value: "infrastructure",
        color: "#1d4ed8",
    },
    {
        label: "Documentation",
        value: "documentation",
        color: "#0e7490",
    },
];

export function getTagColor(tag) {
    const loweredTag = tag.toLowerCase();
    const tagData = TAGS.find((t) => t.value === loweredTag);
    const color = tagData?.color || "#9E9E9E";
    return {
        text: color,
        bg: `${color}20`,
    };
}
