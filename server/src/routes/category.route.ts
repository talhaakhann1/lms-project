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
import {
  createLessonSchema,
  updateLessonSchema,
} from "../Schemas/lession.scehma.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../Schemas/category.schema.js";
import {
  createCategory,
  getAllCategories,
  updateCategory,
} from "../controllers/category.controller.js";

const router = Router();

router
  .route("/create")
  .post(
    verifyJWT,
    verifyRoles(["admin", "instructor"]),
    validate(createCategorySchema),
    createCategory,
  );
router
  .route("/:categoryId/update")
  .patch(
    verifyJWT,
    verifyRoles(["admin", "instructor"]),
    validate(updateCategorySchema),
    updateCategory,
  );
  
router
  .route("/all")
  .get(
    // verifyJWT,
    // verifyRoles(["admin", "instructor"]),
    // validate(updateCategorySchema),
    getAllCategories,
  );
  

export default router;
