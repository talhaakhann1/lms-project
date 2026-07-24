import mongoose, { Model, Schema } from "mongoose";

import type { ICategory } from "../interfaces/category.interface.js";

const categorySchema = new Schema<ICategory>(
  {
    name:{
        type:String,
        unique:true,
        required:true
    },
    slug:{
        type:String,
        required:true
    },
  },
  { timestamps: true },
);

export const Category: Model<ICategory> = mongoose.model<ICategory>(
  "Category",
  categorySchema,
);
