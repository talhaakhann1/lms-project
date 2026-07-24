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
      enum: PaymentStatus,
      default: PaymentStatus.PENDING,
    },
    transactionId: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: PaymentMethods,
    },
    paidAt: {
      type: Date,
      default: Date.now(),
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  },
  { timestamps: true },
);

export const Payment: Model<IPayment> = mongoose.model<IPayment>(
  "Payment",
  paymentSchema,
);
