export function formatTagLabel(tag) {
    return tag
        .toLowerCase()
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}
