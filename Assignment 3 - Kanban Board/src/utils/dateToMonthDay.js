export function dateToMonthDay(dateString) {
    const d = new Date(dateString);
    const m = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    return `${m[d.getMonth()]} ${d.getDate()}`;
}
