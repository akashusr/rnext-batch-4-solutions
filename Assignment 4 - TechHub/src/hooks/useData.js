import { useEffect, useState } from "react";

export default function useData(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let ignore = false;

        async function fetchDate() {
            try {
                setLoading(true);
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}${url}`
                );

                if (!response.ok) {
                    throw new Error(
                        `${response.status} ${response.statusText}`
                    );
                }

                const result = await response.json();
                setData(result);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }

        if (!ignore) {
            fetchDate();
        }

        return () => {
            ignore = true;
        };
    }, [url]);
    return {
        data,
        setData,
        loading,
        error,
    };
}
