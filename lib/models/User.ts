import { Schema, model, models } from 'mongoose';

export interface IUser {
    email: string;
    password: string;
    name: string;
    isAdmin: boolean;
    createdAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const User = models.User || model<IUser>('User', UserSchema);

export default User;