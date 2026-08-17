import mongoose, { Model, Schema } from "mongoose";
import { PaymentMethods, PaymentStatus } from "../types/payment.enum.js";
const paymentSchema = new Schema({
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: PaymentStatus
    },
    transactionId: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        default: "stripe"
    },
    paidAt: {
        type: Date,
        default: Date.now(),
    },
    orderId: {
        type: Schema.Types.ObjectId,
        ref: "Order",
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });
export const Payment = mongoose.model("Payment", paymentSchema);
//# sourceMappingURL=payment.model.js.map