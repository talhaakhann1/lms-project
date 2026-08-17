import mongoose from "mongoose";
let isConnected = false;
export const connectDB = async () => {
    try {
        if (isConnected)
            return;
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        console.log(`\n MongoDB connected ✔ Host: ${connectionInstance.connection.host}`);
        isConnected = connectionInstance.connection.readyState === 1;
    }
    catch (error) {
        console.log("MongoDB FAILED ❌", error);
        process.exit(1);
    }
};
//# sourceMappingURL=index.js.map