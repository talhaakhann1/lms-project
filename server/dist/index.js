import app from "./app.js";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./db/index.js";
dotenv.config({
    path: "./.env"
});
app.use(express.json());
const PORT = process.env.PORT || 8000;
connectDB()
    .then(() => {
    const server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
    server.on("error", (err) => {
        console.error("Server error:", err);
    });
})
    .catch((err) => {
    console.error("MongoDB connection failed:", err);
});
app.get("/health", (req, res) => {
    res.json("All working good");
});
//# sourceMappingURL=index.js.map