import type { Types } from "mongoose";
import type { OrderStatus } from "../types/order.enum.js";

export interface IOrder{
    course:Types.ObjectId
    user:Types.ObjectId
    status:OrderStatus,
    amount:number,
    isPaid:boolean
    paymentIntentId:Types.ObjectId
}