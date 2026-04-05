import mongoose, { Schema, model, models } from 'mongoose';

export interface IPasswordReset {
    _id: string;
    userId: mongoose.Types.ObjectId;
    token: string;
    expiresAt: Date;
    used: boolean;
    createdAt: Date;
}

const PasswordResetSchema = new Schema<IPasswordReset>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        token: { type: String, required: true, unique: true },
        expiresAt: { type: Date, required: true },
        used: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Index for token lookup
PasswordResetSchema.index({ token: 1 });
// Index for cleanup of expired tokens
PasswordResetSchema.index({ expiresAt: 1 });

export const PasswordReset = models.PasswordReset || model<IPasswordReset>('PasswordReset', PasswordResetSchema);
