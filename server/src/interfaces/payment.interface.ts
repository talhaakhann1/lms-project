import { Document, Types } from "mongoose";
import type { PaymentMethods, PaymentStatus } from "../types/payment.enum.js";

export interface IPayment extends Document {
  amount: number;
  status: PaymentStatus;
  transactionId: string;
  paymentMethod: string;
  paidAt: Date;
  orderId: Types.ObjectId;
  user:Types.ObjectId;
}
