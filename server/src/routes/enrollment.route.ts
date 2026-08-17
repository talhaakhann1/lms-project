import { Router } from "express";
import { verifyJWT, verifyRoles } from "../middlewares/auth.middleware.js";
import { getAllEnrollment, getEnrollmentById, getStudentEnrollCourses } from "../controllers/enrollment.controller.js";

const router=Router();

router.route("/my-courses").get(verifyJWT,getStudentEnrollCourses)
router.route("/all").get(verifyJWT,verifyRoles(["admin","instructor"]),getAllEnrollment)
router.route("/:enrollmentId").get(verifyJWT,verifyRoles(["admin","instructor"]),getEnrollmentById)

export default router