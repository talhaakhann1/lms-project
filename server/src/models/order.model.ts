import mongoose, { Model, Schema } from "mongoose";
import type { IOrder } from "../interfaces/order.interface.js";
import { boolean } from "zod";
import { OrderStatus } from "../types/order.enum.js";

const OrderSchema = new Schema<IOrder>(
{
     course:{
        type: Schema.Types.ObjectId,
      ref: "Course",
     },
        user:{
            type: Schema.Types.ObjectId,
      ref: "User",
        },
        status:{
            type:String,
            enum:OrderStatus
        },
        amount:{
            type:Number
        },
        isPaid:{
            type:Boolean,
            default:false
        },
        paymentIntentId:{
               type: Schema.Types.ObjectId,
      ref: "Payment",
        }
},
  { timestamps: true },
);

export const Order: Model<IOrder> = mongoose.model<IOrder>(
  "Order",
  OrderSchema,
);
