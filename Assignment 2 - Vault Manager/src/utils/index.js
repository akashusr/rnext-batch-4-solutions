// greeting message based on current time,
export function getGreetingMessage() {
    const date = new Date();
    const hours = date.getHours();

    if (hours >= 6 && hours < 12) return "Morning";
    if (hours >= 12 && hours < 16) return "Noon";
    if (hours >= 16 && hours < 20) return "Evening";
    return "Night";
}

// current formatted date -- Day, MM DD
export function getCurrentTime() {
    const options = { weekday: "long", month: "short", day: "numeric" };
    const formattedDate = new Date().toLocaleDateString("en-US", options);

    return formattedDate;
}

// extract website name from URL
export function getWebsiteName(url) {
    const domain = url.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0];
    const parts = domain.split(".");
    const main = parts.length > 2 ? parts[parts.length - 2] : parts[0];
    return main.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// extract domain from URL
export function getDomain(url) {
    return url
        .replace(/^(https?:\/\/)?(www\.)?/, "")
        .split("/")[0]
        .split(":")[0];
}

// get short name for favicon
export function getShortName(url) {
    // Extract domain
    const domain = url
        .replace(/^(https?:\/\/)?(www\.)?/, "")
        .split("/")[0]
        .toLowerCase();
    // Extract main domain (handles subdomains)
    const parts = domain.split(".");
    const main = parts.length > 2 ? parts[parts.length - 2] : parts[0];
    // Common daily-use site short names
    const map = {
        youtube: "YT",
        facebook: "FB",
        twitter: "TW",
        instagram: "IG",
        linkedin: "IN",
        dribbble: "DB",
        google: "GG",
        github: "GH",
        reddit: "RD",
        spotify: "SP",
        netflix: "NX",
        amazon: "AM",
        tiktok: "TT",
        whatsapp: "WA",
        discord: "DC",
        zoom: "ZM",
        pinterest: "PT",
        snapchat: "SC",
        slack: "SL",
        telegram: "TG",
        quora: "QR",
        medium: "MD",
        stackoverflow: "SO",
    };

    return map[main] || main.slice(0, 2).toUpperCase();
}
