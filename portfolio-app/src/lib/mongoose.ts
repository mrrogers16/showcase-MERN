import mongoose from 'mongoose';

let cached = (global as any).mongoose || { conn: null };

export async function dbConnect() 
{
    if (cached.conn) 
    {
        return cached.conn;
    }

    cached.conn = await mongoose.connect(process.env.MONGODB_URI!);
    (global as any).mongoose = cached;

    return cached.conn;
}
