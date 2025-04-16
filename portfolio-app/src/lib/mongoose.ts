import mongoose from 'mongoose';

interface MongooseCache {
    conn: typeof mongoose | null;
}

declare global {
    // Safe declaration so we don't overwrite
    var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || { conn: null };

export async function dbConnect() 
{
    if (cached.conn) return cached.conn;

    cached.conn = await mongoose.connect(process.env.MONGODB_URI!);
    global.mongooseCache = cached;

    return cached.conn;
}
