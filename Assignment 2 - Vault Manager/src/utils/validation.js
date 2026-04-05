// form validation function
export function validateForm(bookmark, setError) {
    const { url, color, category, username, password } = bookmark;
    let hasError = false;
    // all fields are required validation
    if (!url) {
        setError((pe) => ({
            ...pe,
            url: "URL is required!",
        }));
        hasError = true;
    } else if (
        !/^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})?(\/[^\s]*)?$/.test(
            url
        )
    ) {
        setError((pe) => ({
            ...pe,
            url: "Please enter a valid URL.",
        }));
        hasError = true;
    }
    if (!color) {
        setError((pe) => ({
            ...pe,
            color: "Color is required!",
        }));
        hasError = true;
    }
    if (!category) {
        setError((pe) => ({
            ...pe,
            category: "Category is required!",
        }));
        hasError = true;
    }
    if (!username) {
        setError((pe) => ({
            ...pe,
            username: "Username is required!",
        }));
        hasError = true;
    }
    if (!password) {
        setError((pe) => ({
            ...pe,
            password: "Password is required!",
        }));
        hasError = true;
    } else if (password.length < 6) {
        setError((pe) => ({
            ...pe,
            password: "Password must be at least 6 characters long.",
        }));
        hasError = true;
    }

    return hasError;
}
