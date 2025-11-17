import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in .env.local");
}

// Extend the NodeJS global type to include mongoose cache
declare global {
    // eslint-disable-next-line no-var
    var mongoose: {
        conn: mongoose.Connection | null;
        promise: Promise<mongoose.Connection> | null;
    };
}

// Use globalThis to store the cache
let cached: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
} = globalThis.mongoose || { conn: null, promise: null };

async function connectDB(): Promise<mongoose.Connection> {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI as string).then((mongooseInstance) => {
            return mongooseInstance.connection;
        });
    }

    cached.conn = await cached.promise;
    globalThis.mongoose = cached; // save cache to globalThis

    return cached.conn;
}

export default connectDB;
