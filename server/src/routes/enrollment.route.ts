import { Router } from "express";
import { verifyJWT, verifyRoles } from "../middlewares/auth.middleware.js";
import { getAllEnrollment, getEnrollmentById } from "../controllers/enrollment.controller.js";

const router=Router();

router.route("/all").get(verifyJWT,verifyRoles(["admin"]),getAllEnrollment)
router.route("/:enrollmentId").get(verifyJWT,verifyRoles(["admin"]),getEnrollmentById)

export default router