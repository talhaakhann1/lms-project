import type { OrderStatus } from "../enums/order.enum";
import { Course } from "./course.interface.js";
import { User } from "@/src/Schemas/user.schema.js";

export interface Order {
  id: string;
  course: Course;
  user: User;
  status: OrderStatus;
  totalAmount: number;
  isPaid: boolean;
  checkoutSessionId: string;
  createdAt: Date;
  updatedAt: Date;
}
