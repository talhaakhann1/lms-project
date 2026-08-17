import express from "express";
import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "./middlewares/error.middleware.js";
import { stripeWebhook } from "./controllers/webhook.controller.js";
// Router import 
import userRouter from "./routes/user.route.js";
import paymentRouter from "./routes/payment.route.js";
import reviewRouter from "./routes/review.route.js";
import courseRouter from "./routes/course.route.js";
import enrollmentRouter from "./routes/enrollment.route.js";
import lessonRouter from "./routes/lesson.route.js";
import lessonProgressRouter from "./routes/lessonProgress.route.js";
import orderRouter from "./routes/order.route.js";
import adminRouter from "./routes/admin.route.js";
const app = express();
const allowedOrigins = [
    "http://localhost:3000",
    process.env.CORS_ORIGIN,
].filter((origin) => Boolean(origin));
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), stripeWebhook);
app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());
app.use("/api/auth", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/enrollments", enrollmentRouter);
app.use("/api/orders", orderRouter);
app.use("/api/lesson-progress", lessonProgressRouter);
app.use("/api/lessons", lessonRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/courses", courseRouter);
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map