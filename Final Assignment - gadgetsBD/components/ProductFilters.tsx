"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Suspense } from "react";

interface ProductFiltersProps {
    categories: string[];
    brands: string[];
}

function FiltersContent({ categories, brands }: ProductFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const currentCategory = searchParams.get("category") || "";
    const currentBrand = searchParams.get("brand") || "";

    const createQueryString = (name: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(name, value);
        } else {
            params.delete(name);
        }
        return params.toString();
    };

    const handleCategoryChange = (cat: string) => {
        const newCategory = currentCategory === cat ? "" : cat;
        const queryString = createQueryString("category", newCategory);
        router.push(`${pathname}?${queryString}`);
    };

    const handleBrandChange = (brand: string) => {
        const newBrand = currentBrand === brand ? "" : brand;
        const queryString = createQueryString("brand", newBrand);
        router.push(`${pathname}?${queryString}`);
    };

    return (
        <>
            {/* Category */}
            <div className="mb-6">
                <h3 className="font-bold text-base mb-3">Category</h3>
                <div className="space-y-2">
                    {categories.map((cat) => (
                        <label
                            key={cat}
                            className="flex items-center gap-2 cursor-pointer hover:text-amazon-orange"
                        >
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-gray-300 text-amazon-secondary focus:ring-amazon-secondary"
                                checked={currentCategory === cat}
                                onChange={() => handleCategoryChange(cat)}
                            />
                            <span className="text-sm">{cat}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Brand */}
            <div className="border-t pt-4 mb-6">
                <h3 className="font-bold text-base mb-3">Brand</h3>
                <div className="space-y-2">
                    {brands.map((brand) => (
                        <label
                            key={brand}
                            className="flex items-center gap-2 cursor-pointer hover:text-amazon-orange"
                        >
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-gray-300 text-amazon-secondary focus:ring-amazon-secondary"
                                checked={currentBrand === brand}
                                onChange={() => handleBrandChange(brand)}
                            />
                            <span className="text-sm">{brand}</span>
                        </label>
                    ))}
                </div>
            </div>
        </>
    );
}

export default function ProductFilters({ categories, brands }: ProductFiltersProps) {
    return (
        <Suspense fallback={
            <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="space-y-2">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-4 bg-gray-100 rounded w-32"></div>
                    ))}
                </div>
            </div>
        }>
            <FiltersContent categories={categories} brands={brands} />
        </Suspense>
    );
}
