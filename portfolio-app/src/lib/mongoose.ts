import mongoose from 'mongoose';

type MongooseCache = { conn: typeof mongoose | null };

// Extend globalThis inline (this is TypeScript-legal and ESLint-safe)
const globalCache = globalThis as typeof globalThis & {
    mongooseCache?: MongooseCache;
};

const cached: MongooseCache = globalCache.mongooseCache || { conn: null };

export async function dbConnect() {
    if (cached.conn) return cached.conn;

    cached.conn = await mongoose.connect(process.env.MONGODB_URI!);
    globalCache.mongooseCache = cached;

    return cached.conn;
}
