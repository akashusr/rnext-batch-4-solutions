import mongoose, { Schema, model, models } from 'mongoose';

export interface IProduct {
    _id: string;
    shopId: mongoose.Types.ObjectId;
    title: string;
    description: string;
    category: string;
    brand?: string;
    price: number;
    images: string[];
    stock: number;
    features?: string[];
    specifications?: Record<string, any>;
    isPublished: boolean;
    purchaseCount: number;
    averageRating: number;
    totalReviews: number;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
    {
        shopId: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: String, required: true },
        brand: { type: String },
        price: { type: Number, required: true },
        images: [{ type: String }],
        stock: { type: Number, required: true, default: 0 },
        features: [{ type: String }],
        specifications: { type: Schema.Types.Mixed },
        isPublished: { type: Boolean, default: true },
        purchaseCount: { type: Number, default: 0 },
        averageRating: { type: Number, default: 0 },
        totalReviews: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// Index for search and filtering
ProductSchema.index({ title: 'text', description: 'text' });
ProductSchema.index({ category: 1, isPublished: 1 });
ProductSchema.index({ shopId: 1 });

export const Product = models.Product || model<IProduct>('Product', ProductSchema);
