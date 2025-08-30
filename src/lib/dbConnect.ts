import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var mongoose:
    | {
        conn: mongoose.Connection | null;
        promise: Promise<mongoose.Connection> | null;
      }
    | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached?.conn) {
    return cached.conn;
  }
  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached!.promise = mongoose
      .connect(MONGODB_URI!, opts)
      .then((mongooseInstance) => {
        console.log("MongoDB connected successfully!");
        cached!.conn = mongooseInstance.connection;
        return mongooseInstance.connection;
      });
  }
  cached!.conn = await cached!.promise;
  return cached!.conn;
}

export default dbConnect;
