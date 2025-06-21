import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const mongouri = (process.env.PRODUCTION === "true") ? process.env.MONGO_URI : process.env.DEPLOYMENT_MONGO_URI;
        const conn = await mongoose.connect(mongouri);
        console.log(`MongoDB Connected: ${conn.connection.db.databaseName}`);
    } catch (error) {
        console.log(`Error connection to mongoDB: ${error}`);
    }
};