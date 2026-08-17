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
            enum:OrderStatus,
            default:OrderStatus.PENDING
        },
        totalAmount:{
            type:Number,
            default:0
        },
        isPaid:{
            type:Boolean,
            default:false
        },
        checkoutSessionId :{
              type:String
        }
},
  { timestamps: true },
);

export const Order: Model<IOrder> = mongoose.model<IOrder>(
  "Order",
  OrderSchema,
);
