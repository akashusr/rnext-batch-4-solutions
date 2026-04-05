import Modal from "@/components/Modal";
import ProductDetailClient from "@/app/products/[id]/ProductDetailClient";
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

export default async function ProductDetailModal({
    params,
}: {
    params: { id: string };
}) {
    const product = await getProduct(params.id);

    if (!product) {
        return (
            <Modal>
                <div className="text-center py-8">
                    <h2 className="text-xl font-bold">Product Not Found</h2>
                </div>
            </Modal>
        );
    }

    return (
        <Modal>
            <div className="max-w-[800px]">
                {/* Product Image */}
                <div className="bg-gray-50 h-64 flex items-center justify-center mb-4 rounded">
                    {product.images?.[0] ? (
                        <img
                            src={product.images[0]}
                            className="h-full object-contain mix-blend-multiply"
                            alt={product.title}
                        />
                    ) : (
                        <div className="text-6xl">📦</div>
                    )}
                </div>

                {/* Product Info */}
                <h2 className="text-lg font-bold text-amazon-blue mb-1">
                    {product.title}
                </h2>
                {product.shopId?.shopName && (
                    <p className="text-xs text-gray-500 mb-2">
                        by {product.shopId.shopName}
                    </p>
                )}
                <div className="mb-3">
                    <span className="text-xs align-top">৳</span>
                    <span className="text-2xl font-bold">
                        {product.price?.toLocaleString()}
                    </span>
                </div>
                {product.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {product.description}
                    </p>
                )}
                <a
                    href={`/products/${product._id}`}
                    className="block text-center bg-amazon-yellow hover:bg-amazon-yellow-hover text-sm py-2 rounded-md shadow-sm font-medium border border-amazon-secondary transition-colors"
                >
                    View Full Details
                </a>
            </div>
        </Modal>
    );
}
