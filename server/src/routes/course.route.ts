
import { upload } from "../middlewares/multer.middleware.js";
import {
  getLoggedInUserOrIgnore,
  verifyEnrollment,
  verifyJWT,
  verifyRoles,
} from "../middlewares/auth.middleware.js";
import { Router } from "express";
import { createCourse, deleteCourse, getAllCourses, getCourseById, updateCourse, updateCourseThumbnail } from "../controllers/course.controller.js";
import { validate } from "../Schemas/validate.js";
import { createCourseSchema, updateCourseSchema } from "../Schemas/course.schema.js";

const router = Router();

router
  .route("/create")
  .post(
    verifyJWT,
    verifyRoles(["admin","instructor"]),
    upload.single("thumbnail"),
    validate(createCourseSchema),
    createCourse,
  );
router
  .route("/update/:courseId")
  .patch(verifyJWT, verifyRoles(["admin","instructor"]),upload.single("thumbnail"),validate(updateCourseSchema), updateCourse);
router
  .route("/delete/:courseId")
  .delete(verifyJWT, verifyRoles(["admin","instructor"]), deleteCourse);
router
  .route("/:courseId")
  .get(getLoggedInUserOrIgnore,getCourseById);
router
  .route("/")
  .get(getLoggedInUserOrIgnore,getAllCourses);
  router
  .route("/update-thumbnail/:courseId")
  .patch(
    verifyJWT,
    verifyRoles(["admin","instructor"]),
    upload.single("thumbnail"),
    updateCourseThumbnail,
  );

export default router;

