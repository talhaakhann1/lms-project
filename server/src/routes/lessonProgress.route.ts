import { Router } from "express";
import { validate } from "../Schemas/validate.js";
import { verifyEnrollment, verifyJWT, verifyRoles } from "../middlewares/auth.middleware.js";
import { getAllEnrollment } from "../controllers/enrollment.controller.js";
import { completeLesson, getLessonProgress } from "../controllers/lessonProgress.controller.js";

const router=Router();

router.route("/complete-lesson/:lessonId").patch(verifyJWT,verifyEnrollment,completeLesson)
router.route("/:lessonId").get(verifyJWT,verifyEnrollment,getLessonProgress)

export default router