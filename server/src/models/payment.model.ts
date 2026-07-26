import mongoose, { Model, Schema } from "mongoose";
import type { IPayment } from "../interfaces/payment.interface.js";
import { PaymentMethods, PaymentStatus } from "../types/payment.enum.js";

const paymentSchema = new Schema<IPayment>(
  {
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
      default:"stripe"
    },
    paidAt: {
      type: Date,
      default: Date.now(),
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
    user:{
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true },
);

export const Payment: Model<IPayment> = mongoose.model<IPayment>(
  "Payment",
  paymentSchema,
);
