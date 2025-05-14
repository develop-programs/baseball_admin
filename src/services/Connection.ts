import mongoose from "mongoose";

export async function connectToDatabase() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;

        if (!MONGODB_URI) {
            console.error("MongoDB URI is not defined in environment variables");
            process.exit(1);
        }

        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB successfully");
        return mongoose.connection;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Database connection error:", error.message);
            process.exit(1);
        } else {
            console.error("Unexpected error during database connection:", error);
            process.exit(1);
        }
    }
}