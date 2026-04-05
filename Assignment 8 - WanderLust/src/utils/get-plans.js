export async function getPlans(count) {
    try {
        const res = await fetch(`${process.env.BASE_URL}/plans?count=${count}`);

        if (!res.ok) {
            throw new Error("Failed to fetch plans");
        }

        return res.json();
    } catch (error) {
        throw new Error("Failed to fetch plans. Please try again.");
    }
}
