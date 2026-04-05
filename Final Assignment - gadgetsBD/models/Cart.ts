import mongoose, { Schema, model, models } from 'mongoose';

interface ICartItem {
    productId: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
}

export interface ICart {
    _id: string;
    userId: mongoose.Types.ObjectId;
    items: ICartItem[];
    updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
});

const CartSchema = new Schema<ICart>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        items: [CartItemSchema],
    },
    { timestamps: true }
);

export const Cart = models.Cart || model<ICart>('Cart', CartSchema);
