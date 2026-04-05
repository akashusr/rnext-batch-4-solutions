import mongoose, { Schema, model, models } from 'mongoose';

export interface ICategory {
    _id: string;
    name: string;
    slug: string;
    image?: string;
    productCount: number;
    createdAt: Date;
}

const CategorySchema = new Schema<ICategory>(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        image: { type: String },
        productCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export const Category = models.Category || model<ICategory>('Category', CategorySchema);
