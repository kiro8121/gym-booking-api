import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(
            "mongodb://byhxkiro_db_user:4jQUgBjdAcFQaHFv@ac-ecwe4fm-shard-00-00.vscw21w.mongodb.net:27017,ac-ecwe4fm-shard-00-01.vscw21w.mongodb.net:27017,ac-ecwe4fm-shard-00-02.vscw21w.mongodb.net:27017/gym_booking?ssl=true&replicaSet=atlas-mizdj1-shard-0&authSource=admin&appName=Cluster0"
        );
        console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};