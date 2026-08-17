import { Router } from "express";
import { verifyJWT, verifyRoles } from "../middlewares/auth.middleware.js";
import { createOrder, getAllOrders, getOrderById } from "../controllers/order.controller.js";
const router = Router();
router.route('/:courseId/create').post(verifyJWT, createOrder);
router.route('/all').get(verifyJWT, verifyRoles(["admin"]), getAllOrders);
router.route('/:orderId').get(verifyJWT, getOrderById);
export default router;
//# sourceMappingURL=order.route.js.map