import {
  verifyJWT,
  verifyRoles,
} from "../middlewares/auth.middleware.js";
import { Router } from "express";
import { getAdminMetrics  } from "../controllers/admin.controller.js";

const router = Router();

router
  .route("/metrics")
  .get(
    verifyJWT,
    verifyRoles(["admin"]),
    getAdminMetrics ,
  );

export default router