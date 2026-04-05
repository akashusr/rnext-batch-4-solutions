import mongoose, { Schema, model, models } from 'mongoose';

export interface IUser {
    _id: string;
    name: string;
    email: string;
    password?: string;
    mobile?: string;
    userType: 'customer' | 'shopOwner';
    image?: string;
    googleId?: string;
    shopId?: mongoose.Types.ObjectId;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    refreshToken?: string;
    refreshTokenExpires?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        mobile: { type: String },
        userType: { type: String, enum: ['customer', 'shopOwner'], default: 'customer' },
        image: { type: String },
        googleId: { type: String },
        shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
        resetPasswordToken: { type: String },
        resetPasswordExpires: { type: Date },
        refreshToken: { type: String },
        refreshTokenExpires: { type: Date },
    },
    { timestamps: true }
);

export const User = models.User || model<IUser>('User', UserSchema);
