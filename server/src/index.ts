import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./db/index.js";
import { connectRedis } from "./config/redis.js";

const PORT = process.env.PORT || 8000;

async function startServer() {
  try {
    await connectDB();
    await connectRedis();
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    server.on("error", (err) => {
      console.error("Server error:", err);
    });
    const shutdown = () => {
      server.close(() => {
        process.exit(0);
      });
    };
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (err: unknown) {
    console.error("Startup failed:", err);
    process.exit(1);
  }
}
startServer();
