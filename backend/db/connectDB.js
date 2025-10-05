import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.log("Error Connection to MongoDB: ", error.message);
        process.exit(1);// failure, 0 is success but 1 is failure
    }
}