import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL!;
if(!MONGODB_URL) {
    throw new Error("MONGODB_URL is not set");
}

let cached = global.mongoose;
if(!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
    if(cached.conn) {
        return cached.conn;
    }

    if(!cached.promise) {
        const options = {
            bufferCommands: true, //commands ko buffer me rakhna
            maxPoolSize: 10 //ek baar m kitne connections ho skte h mongodb se
        }
        cached.promise = mongoose.connect(MONGODB_URL, options).then(() => mongoose.connection);
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw new Error("Error connecting to database");
    }

    return cached.conn;
}