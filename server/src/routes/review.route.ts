import { Router } from "express";
import {
  createReview,
  deleteReview,
  getCourseReviewById,
  updateReview,
} from "../controllers/review.controller.js";
import {
  createReviewSchema,
  updateReviewSchema,
} from "../Schemas/review.schema.js";
import { validate } from "../Schemas/validate.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/create/:courseId")
  .post(verifyJWT, validate(createReviewSchema), createReview);
router
  .route("/update/:reviewId")
  .patch(verifyJWT, validate(updateReviewSchema), updateReview);
router.route("/:reviewId").delete(verifyJWT, deleteReview);
router.route("/course/:courseId").get(getCourseReviewById);

export default router;
