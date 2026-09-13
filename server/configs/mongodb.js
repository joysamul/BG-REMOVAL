import mongoose from "mongoose";

let connectionPromise;

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) return;
    if (connectionPromise) return connectionPromise;

    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not configured");
    }

    connectionPromise = mongoose.connect(`${process.env.MONGODB_URI}/bg-removal`)
        .then(() => console.log("Database connected successfully"))
        .catch((error) => {
            connectionPromise = undefined;
            throw error;
        });

    return connectionPromise;
}

export default connectDB