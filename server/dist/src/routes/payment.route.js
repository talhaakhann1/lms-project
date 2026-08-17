import { Router } from "express";
import { verifyJWT, verifyRoles } from "../middlewares/auth.middleware.js";
import { createPaymentSession, getAllPayment, getPaymentByOrderId } from "../controllers/payment.controller.js";
const router = Router();
router.route('/create-payment-session/:orderId').post(verifyJWT, createPaymentSession);
router.route('/:orderId').get(verifyJWT, getPaymentByOrderId);
router.route('/all').get(verifyJWT, verifyRoles(["admin"]), getAllPayment);
export default router;
//# sourceMappingURL=payment.route.js.map