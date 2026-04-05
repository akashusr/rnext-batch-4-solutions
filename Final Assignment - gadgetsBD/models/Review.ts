import mongoose, { Schema, model, models } from 'mongoose';

export interface IReview {
    _id: string;
    productId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    orderId: mongoose.Types.ObjectId;
    rating: number;
    title?: string;
    comment: string;
    images?: string[];
    createdAt: Date;
    updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
    {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        title: { type: String },
        comment: { type: String, required: true },
        images: [{ type: String }],
    },
    { timestamps: true }
);

// Unique index to ensure one review per user per product
ReviewSchema.index({ productId: 1, userId: 1 }, { unique: true });
// Index for fetching product reviews
ReviewSchema.index({ productId: 1, createdAt: -1 });

// Delete the model from cache if it exists to ensure schema updates are applied
if (models.Review) {
    delete models.Review;
}

export const Review = model<IReview>('Review', ReviewSchema);
