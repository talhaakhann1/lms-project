import dotenv from "dotenv";
import app from "../src/app.js";
import { connectDB } from "../src/db/index.js";

dotenv.config();

await connectDB();

export default app;