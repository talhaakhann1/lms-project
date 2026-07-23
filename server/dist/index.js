import app from "./app.js";
import dotenv from "dotenv";
import express from "express";
dotenv.config();
app.use(express.json());
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
app.get("/health", (req, res) => {
    res.json("All working good");
});
//# sourceMappingURL=index.js.map