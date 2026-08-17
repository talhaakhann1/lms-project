import app from "./app.js";
import dotenv from "dotenv";
import express from "express";
import type { Request, Response } from "express";
import { connectDB } from "./db/index.js";

dotenv.config({
    path:"./.env"
});

const PORT = process.env.PORT||8000;

connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    server.on("error", (err) => {
      console.error("Server error:", err);
    });
  })
  .catch((err: unknown) => {
    console.error("MongoDB connection failed:", err);
  });

app.get("/health", (req: Request, res: Response) => {
  res.json("All working good");
});
