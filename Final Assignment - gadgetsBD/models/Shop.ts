import mongoose, { Schema, model, models } from 'mongoose';

export interface IShop {
    _id: string;
    ownerId: mongoose.Types.ObjectId;
    shopName: string;
    description?: string;
    logo?: string;
    banner?: string;
    address?: string;
    phone?: string;
    city?: string;
    specialization?: string;
    yearEstablished?: number;
    employees?: number;
    brandPartnerships?: string;
    website?: string;
    rating: number;
    totalReviews: number;
    totalProducts: number;
    joinedDate: Date;
    responseTime?: string;
    policies?: {
        returnPolicy?: string;
        warranty?: string;
        shipping?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const ShopSchema = new Schema<IShop>(
    {
        ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        shopName: { type: String, required: true },
        description: { type: String },
        logo: { type: String },
        banner: { type: String },
        address: { type: String },
        phone: { type: String },
        city: { type: String },
        specialization: { type: String },
        yearEstablished: { type: Number },
        employees: { type: Number },
        brandPartnerships: { type: String },
        website: { type: String },
        rating: { type: Number, default: 0 },
        totalReviews: { type: Number, default: 0 },
        totalProducts: { type: Number, default: 0 },
        joinedDate: { type: Date, default: Date.now },
        responseTime: { type: String },
        policies: {
            returnPolicy: { type: String },
            warranty: { type: String },
            shipping: { type: String },
        },
    },
    { timestamps: true }
);

export const Shop = models.Shop || model<IShop>('Shop', ShopSchema);
