import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const dbConnect = async () => {
  try {
    if (cached.conn) {
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        bufferCommands: false,
      };

      cached.promise = mongoose
        .connect(process.env.MONGODB_URI, opts)
        .then((mongoose) => {
          return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    throw error;
  }
};
