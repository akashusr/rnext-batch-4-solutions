import ProductDetailClient from "./ProductDetailClient";
import connectDB from "@/lib/db";
import { Product } from "@/models/Product";
import "@/models/Shop";

async function getProduct(id: string) {
    try {
        await connectDB();
        const product = await Product.findById(id)
            .populate('shopId', 'shopName logo')
            .lean();
        return product ? JSON.parse(JSON.stringify(product)) : null;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

export default async function ProductDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const product = await getProduct(params.id);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
                </div>
            </div>
        );
    }

    return <ProductDetailClient product={product} />;
}
