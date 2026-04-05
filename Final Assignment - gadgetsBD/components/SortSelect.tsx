"use client";

export default function SortSelect({ defaultValue }: { defaultValue: string }) {
    return (
        <select
            className="text-sm bg-gray-100 border border-gray-300 rounded px-2 py-1 shadow-sm focus:ring-1 focus:ring-amazon-secondary focus:border-amazon-secondary"
            defaultValue={defaultValue}
            onChange={(e) => {
                const url = new URL(window.location.href);
                url.searchParams.set("sort", e.target.value);
                window.location.href = url.toString();
            }}
        >
            <option value="createdAt">Newest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Avg. Customer Review</option>
        </select>
    );
}
