import type { PaymentMethods, PaymentStatus } from "../enums/payment.enum";
import { User } from "@/src/Schemas/user.schema.js";
import { Order } from "./order.interface";

export interface Payment {
  id: string;
  amount: number;
  status: PaymentStatus;
  transactionId: string;
  paymentMethod: string;
  paidAt: Date;
  order: Order;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}
