import mongoose, { Model, Schema } from "mongoose";
import type { ILayout } from "../interfaces/layout.interface.js";

const layoutSchema = new Schema<ILayout>(
  {
   heroBanner:{
    type:String
   },
    faqs:{
       type: String
    },
  },
  { timestamps: true },
);

export const Layout: Model<ILayout> = mongoose.model<ILayout>(
  "Layout",
  layoutSchema,
);
