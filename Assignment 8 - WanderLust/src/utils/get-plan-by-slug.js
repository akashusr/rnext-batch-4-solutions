export async function getPlanBySlug(slug) {
    try {
        const res = await fetch(`${process.env.BASE_URL}/plans/${slug}`);

        if (!res.ok) {
            return { success: false, data: null };
        }

        return res.json();
    } catch (error) {
        return { success: false, data: null };
    }
}
