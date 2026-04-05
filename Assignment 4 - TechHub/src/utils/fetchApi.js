function fetchApi(endpoint, options = {}) {
    const url = `${import.meta.env.VITE_API_URL}${endpoint}`;

    return fetch(url, options)
        .then((response) => {
            if (!response.ok) {
                throw new Error(
                    `API request failed with status ${response.status}`
                );
            }
            return response.json();
        })
        .catch((error) => {
            console.error("Fetch API error:", error);
            throw error;
        });
}

fetchApi.get = (endpoint, options = {}) => {
    return fetchApi(endpoint, {
        ...options,
        method: "GET",
    });
};

fetchApi.post = (endpoint, data, options = {}) => {
    return fetchApi(endpoint, {
        ...options,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        body: JSON.stringify(data),
    });
};

fetchApi.put = (endpoint, data, options = {}) => {
    return fetchApi(endpoint, {
        ...options,
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        body: JSON.stringify(data),
    });
};

fetchApi.patch = (endpoint, data, options = {}) => {
    return fetchApi(endpoint, {
        ...options,
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        body: JSON.stringify(data),
    });
};

fetchApi.delete = (endpoint, options = {}) => {
    return fetchApi(endpoint, {
        ...options,
        method: "DELETE",
    });
};

export default fetchApi;
