import { Router } from "express";
import {
  createLesson,
  deleteLesson,
  getAllCourseLessons,
  getLessonById,
  updateLesson,
  updateLessonVideo,
} from "../controllers/lesson.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  verifyEnrollment,
  verifyJWT,
  verifyRoles,
} from "../middlewares/auth.middleware.js";
import { validate } from "../Schemas/validate.js";
import { createLessonSchema, updateLessonSchema } from "../Schemas/lession.scehma.js";

const router = Router();

router
  .route("/create/:courseId")
  .post(
    verifyJWT,
    verifyRoles(["admin","instructor"]),
    upload.single("video"),
    validate(createLessonSchema),
    createLesson,
  );
router
  .route("/update/:lessonId")
  .patch(verifyJWT, verifyRoles(["admin","instructor"]),upload.single("video"),validate(updateLessonSchema), updateLesson);
router
  .route("/delete/:lessonId")
  .delete(verifyJWT, verifyRoles(["admin","instructor"]), deleteLesson);
router
  .route("/lesson/:lessonId")
  .get(verifyJWT, getLessonById);
router
  .route("/:courseId")
  .get(verifyJWT, getAllCourseLessons);
  router
  .route("/update-video/:lessonId")
  .patch(
    verifyJWT,
    verifyRoles(["admin","instructor"]),
    upload.single("video"),
    updateLessonVideo,
  );

export default router;
