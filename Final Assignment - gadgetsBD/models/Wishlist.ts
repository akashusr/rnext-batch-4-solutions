import mongoose, { Schema, model, models } from 'mongoose';

export interface IWishlist {
    _id: string;
    userId: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
    createdAt: Date;
}

const WishlistSchema = new Schema<IWishlist>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    },
    { timestamps: true }
);

// One wishlist entry per user per product
WishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });
// Efficient lookup for a user's full wishlist
WishlistSchema.index({ userId: 1, createdAt: -1 });

export const Wishlist = models.Wishlist || model<IWishlist>('Wishlist', WishlistSchema);
