

import { Schema, model, models } from 'mongoose';

export interface ILink {
    shortCode: string;
    destinationUrl: string;
    qrImageUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

const LinkSchema = new Schema<ILink>(
    {
        shortCode: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        destinationUrl: {
            type: String,
            required: true,
        },
        qrImageUrl: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Link = models.Link || model<ILink>('Link', LinkSchema);

export default Link;
